import type { Express, Request, Response, NextFunction } from "express";
import { collection, getDocs } from "firebase/firestore";
import type { Firestore as ClientFirestore } from "firebase/firestore";
import { renderAdminConsoleHtml } from "./adminConsole";
import { getAdminFirestore, hasFirebaseAdmin } from "./firebaseAdmin";
import {
  deleteMerchantCompletely,
  getAdminStats,
  listCollection,
  updateBetaConfig,
} from "./adminDb";

type BuildResponse = (data: unknown, message?: string) => object;
type BuildError = (code: string, message: string, status?: number) => object;

function getAdminKey(req: Request): string | undefined {
  const header = req.headers["x-admin-key"];
  if (typeof header === "string") return header;
  if (Array.isArray(header)) return header[0];
  if (typeof req.query.key === "string") return req.query.key;
  return undefined;
}

export function requireAdmin(
  buildErrorResponse: BuildError
): (req: Request, res: Response, next: NextFunction) => void {
  return (req, res, next) => {
    const secret = process.env.ADMIN_API_SECRET;
    if (!secret || getAdminKey(req) !== secret) {
      return res.status(404).json(buildErrorResponse("NOT_FOUND", "Not Found", 404));
    }
    next();
  };
}

function requireAdminSdk(res: Response, buildErrorResponse: BuildError) {
  if (!hasFirebaseAdmin()) {
    res.status(503).json(
      buildErrorResponse(
        "ADMIN_SDK_MISSING",
        "Set FIREBASE_SERVICE_ACCOUNT in Render Environment (Firebase service account JSON)."
      )
    );
    return null;
  }
  try {
    return getAdminFirestore();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Admin SDK init failed";
    res.status(503).json(buildErrorResponse("ADMIN_SDK_ERROR", message));
    return null;
  }
}

async function clientListWaitlist(clientDb: ClientFirestore) {
  const snap = await getDocs(collection(clientDb, "waitlist"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

async function clientListStores(clientDb: ClientFirestore) {
  const snap = await getDocs(collection(clientDb, "stores"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export function registerAdminRoutes(
  app: Express,
  clientDb: ClientFirestore,
  buildSuccessResponse: BuildResponse,
  buildErrorResponse: BuildError
) {
  const guard = requireAdmin(buildErrorResponse);

  app.get("/admin", guard, (_req, res) => {
    res.type("html").send(renderAdminConsoleHtml(""));
  });

  app.get("/api/admin/overview", guard, async (_req, res) => {
    try {
      if (hasFirebaseAdmin()) {
        const stats = await getAdminStats(getAdminFirestore());
        return res.json(buildSuccessResponse({ ...stats, adminSdkReady: true }));
      }
      const waitlist = await clientListWaitlist(clientDb);
      const stores = await clientListStores(clientDb);
      res.json(
        buildSuccessResponse({
          waitlistPending: waitlist.filter((e) => (e as { status?: string }).status === "pending").length,
          waitlistTotal: waitlist.length,
          storesCount: stores.length,
          betaConfig: { merchants_onboarded: 0, founding_spots: 100, launch_city: "Bengaluru" },
          adminSdkReady: false,
          note: "Add FIREBASE_SERVICE_ACCOUNT for delete merchants, config, and auth cleanup.",
        })
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Overview failed";
      res.status(500).json(buildErrorResponse("ADMIN_OVERVIEW_FAILED", message));
    }
  });

  app.get("/api/admin/waitlist", guard, async (_req, res) => {
    try {
      const entries = hasFirebaseAdmin()
        ? await listCollection(getAdminFirestore(), "waitlist")
        : await clientListWaitlist(clientDb);
      entries.sort((a, b) => {
        const ta = (a as { timestamp?: { toMillis?: () => number } }).timestamp?.toMillis?.() ?? 0;
        const tb = (b as { timestamp?: { toMillis?: () => number } }).timestamp?.toMillis?.() ?? 0;
        return tb - ta;
      });
      res.json(buildSuccessResponse({ entries }));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Waitlist fetch failed";
      res.status(500).json(buildErrorResponse("ADMIN_WAITLIST_FAILED", message));
    }
  });

  app.patch("/api/admin/waitlist/:id", guard, async (req, res) => {
    try {
      const db = requireAdminSdk(res, buildErrorResponse);
      if (!db) return;
      const { id } = req.params;
      const { status } = req.body as { status?: string };
      const allowed = ["pending", "contacted", "approved", "rejected"];
      if (!status || !allowed.includes(status)) {
        return res.status(400).json(buildErrorResponse("BAD_REQUEST", "Invalid status"));
      }
      const ref = db.collection("waitlist").doc(id);
      const existing = await ref.get();
      if (!existing.exists) {
        return res.status(404).json(buildErrorResponse("NOT_FOUND", "Waitlist entry not found"));
      }
      await ref.update({ status });
      res.json(buildSuccessResponse({ id, status }, "Waitlist updated"));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Update failed";
      res.status(500).json(buildErrorResponse("ADMIN_UPDATE_FAILED", message));
    }
  });

  app.delete("/api/admin/waitlist/:id", guard, async (req, res) => {
    try {
      const db = requireAdminSdk(res, buildErrorResponse);
      if (!db) return;
      await db.collection("waitlist").doc(req.params.id).delete();
      res.json(buildSuccessResponse({ id: req.params.id }, "Waitlist entry deleted"));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Delete failed";
      res.status(500).json(buildErrorResponse("ADMIN_DELETE_FAILED", message));
    }
  });

  app.get("/api/admin/stores", guard, async (_req, res) => {
    try {
      const stores = hasFirebaseAdmin()
        ? await listCollection(getAdminFirestore(), "stores")
        : await clientListStores(clientDb);
      res.json(buildSuccessResponse({ stores }));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Stores fetch failed";
      res.status(500).json(buildErrorResponse("ADMIN_STORES_FAILED", message));
    }
  });

  app.patch("/api/admin/stores/:storeId", guard, async (req, res) => {
    try {
      const db = requireAdminSdk(res, buildErrorResponse);
      if (!db) return;
      const { storeId } = req.params;
      const allowed = [
        "storeName",
        "address",
        "location",
        "products",
        "platforms_active",
        "subscription_status",
        "visibility_score",
        "kyb_status",
      ] as const;
      const patch: Record<string, unknown> = {};
      for (const key of allowed) {
        if (req.body[key] !== undefined) patch[key] = req.body[key];
      }
      if (Object.keys(patch).length === 0) {
        return res.status(400).json(buildErrorResponse("BAD_REQUEST", "No valid fields to update"));
      }
      const ref = db.collection("stores").doc(storeId);
      if (!(await ref.get()).exists) {
        return res.status(404).json(buildErrorResponse("NOT_FOUND", "Store not found"));
      }
      await ref.update(patch);
      res.json(buildSuccessResponse({ storeId, ...patch }, "Store updated"));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Store update failed";
      res.status(500).json(buildErrorResponse("ADMIN_STORE_UPDATE_FAILED", message));
    }
  });

  app.delete("/api/admin/merchants/:userId", guard, async (req, res) => {
    try {
      const db = requireAdminSdk(res, buildErrorResponse);
      if (!db) return;
      const result = await deleteMerchantCompletely(req.params.userId);
      res.json(buildSuccessResponse(result, "Merchant removed completely"));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Merchant delete failed";
      res.status(500).json(buildErrorResponse("ADMIN_MERCHANT_DELETE_FAILED", message));
    }
  });

  app.get("/api/admin/analytics", guard, async (req, res) => {
    try {
      const db = requireAdminSdk(res, buildErrorResponse);
      if (!db) return;
      const storeId = req.query.storeId as string | undefined;
      const snap = storeId
        ? await db.collection("analytics").where("storeId", "==", storeId).get()
        : await db.collection("analytics").limit(200).get();
      res.json(buildSuccessResponse({ records: snap.docs.map((d) => ({ id: d.id, ...d.data() })) }));
    } catch (error: unknown) {
      res.status(500).json(buildErrorResponse("ADMIN_ANALYTICS_FAILED", String(error)));
    }
  });

  app.get("/api/admin/posts", guard, async (req, res) => {
    try {
      const db = requireAdminSdk(res, buildErrorResponse);
      if (!db) return;
      const storeId = req.query.storeId as string | undefined;
      const snap = storeId
        ? await db.collection("posts").where("storeId", "==", storeId).get()
        : await db.collection("posts").limit(200).get();
      res.json(buildSuccessResponse({ records: snap.docs.map((d) => ({ id: d.id, ...d.data() })) }));
    } catch (error: unknown) {
      res.status(500).json(buildErrorResponse("ADMIN_POSTS_FAILED", String(error)));
    }
  });

  app.delete("/api/admin/posts/:id", guard, async (req, res) => {
    try {
      const db = requireAdminSdk(res, buildErrorResponse);
      if (!db) return;
      await db.collection("posts").doc(req.params.id).delete();
      res.json(buildSuccessResponse({ id: req.params.id }, "Post deleted"));
    } catch (error: unknown) {
      res.status(500).json(buildErrorResponse("ADMIN_POST_DELETE_FAILED", String(error)));
    }
  });

  app.get("/api/admin/preferences", guard, async (_req, res) => {
    try {
      const db = requireAdminSdk(res, buildErrorResponse);
      if (!db) return;
      const records = await listCollection(db, "merchant_preferences");
      res.json(buildSuccessResponse({ records }));
    } catch (error: unknown) {
      res.status(500).json(buildErrorResponse("ADMIN_PREFS_FAILED", String(error)));
    }
  });

  app.patch("/api/admin/config/beta", guard, async (req, res) => {
    try {
      const db = requireAdminSdk(res, buildErrorResponse);
      if (!db) return;
      const { merchants_onboarded, founding_spots, launch_city } = req.body as {
        merchants_onboarded?: number;
        founding_spots?: number;
        launch_city?: string;
      };
      const config = await updateBetaConfig(db, { merchants_onboarded, founding_spots, launch_city });
      res.json(buildSuccessResponse({ config }, "Beta config saved"));
    } catch (error: unknown) {
      res.status(500).json(buildErrorResponse("ADMIN_CONFIG_FAILED", String(error)));
    }
  });

  app.post("/api/admin/stores/:storeId/analytics/seed", guard, async (req, res) => {
    try {
      const db = requireAdminSdk(res, buildErrorResponse);
      if (!db) return;
      const { storeId } = req.params;
      const dates: string[] = [];
      const now = new Date();
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        dates.push(d.toISOString().split("T")[0]);
      }
      for (const date of dates) {
        await db.collection("analytics").add({
          storeId,
          date,
          impressions: Math.floor(Math.random() * 200) + 100,
          clicks: Math.floor(Math.random() * 60) + 20,
          calls: Math.floor(Math.random() * 10) + 2,
          directions: Math.floor(Math.random() * 15) + 3,
        });
      }
      res.json(buildSuccessResponse({ storeId, created: dates.length }, "Analytics seeded"));
    } catch (error: unknown) {
      res.status(500).json(buildErrorResponse("ADMIN_SEED_FAILED", String(error)));
    }
  });
}

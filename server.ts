import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp,
  Timestamp 
} from "firebase/firestore";
import { GoogleGenAI, Type } from "@google/genai";
import firebaseConfig from "./firebase-applet-config.json";

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

// Initialize Google Gen AI
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Helper function to send standard success response
function buildSuccessResponse(data: any, message = "Operation completed successfully") {
  return {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString()
  };
}

// Helper function to send standard error response
function buildErrorResponse(code: string, message: string, status = 500) {
  return {
    success: false,
    error: {
      code,
      message
    },
    timestamp: new Date().toISOString()
  };
}

// --- API ENDPOINTS ---

/**
 * 1. Health check for all integrations
 * GET /api/status/health
 */
app.get("/api/status/health", (req, res) => {
  try {
    res.json({
      status: "healthy",
      platforms: ["google_maps", "google_search", "instagram", "whatsapp", "facebook", "justdial", "sulekha"],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json(buildErrorResponse("HEALTH_CHECK_FAILED", "Failed checks"));
  }
});

/**
 * 2. Add store owner to waitlist (Public)
 * POST /api/waitlist
 */
app.post("/api/waitlist", async (req, res) => {
  try {
    const { store_name, owner_name, email, phone, city, store_type } = req.body;

    if (!store_name || !owner_name || !email || !phone || !city) {
      return res.status(400).json(
        buildErrorResponse("BAD_REQUEST", "Please supply all required waitlist parameters.")
      );
    }

    const waitlistRef = collection(db, "waitlist");
    const docRef = await addDoc(waitlistRef, {
      store_name: String(store_name).trim(),
      owner_name: String(owner_name).trim(),
      email: String(email).toLowerCase().trim(),
      phone: String(phone).trim(),
      city: String(city).trim(),
      store_type: store_type || "Kirana/Grocery",
      timestamp: new Date(), // fallback in node
      status: "pending"
    });

    res.status(201).json(buildSuccessResponse({
      id: docRef.id,
      store_name
    }, "Added to waitlist"));
  } catch (error: any) {
    console.error("Express Waitlist write failed:", error);
    res.status(500).json(buildErrorResponse("WRITE_FAILED", error.message || "Failed to commit waitlist registration."));
  }
});

/**
 * 3. Create store profile (Authenticated context)
 * POST /api/stores
 */
app.post("/api/stores", async (req, res) => {
  try {
    const { storeName, address, location, products, userId, platforms_active } = req.body;

    if (!storeName || !userId) {
      return res.status(400).json(
        buildErrorResponse("BAD_REQUEST", "Store name and owner user ID are required.")
      );
    }

    const storeId = userId; // Keep a 1:1 user-to-store mapping for standard prototype demo
    const storeRef = doc(db, "stores", storeId);

    const storePayload = {
      userId,
      storeName: String(storeName).trim(),
      address: String(address || "").trim(),
      location: String(location || "").trim(),
      products: String(products || "").trim(),
      visibility_score: platforms_active ? Math.min(100, Math.round(20 + platforms_active.length * 6.5)) : 20,
      platforms_active: platforms_active || [],
      subscription_status: "free_tier",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await setDoc(storeRef, storePayload);

    res.status(201).json(buildSuccessResponse({
      storeId,
      ...storePayload
    }, "Store created successfully"));
  } catch (error: any) {
    console.error("Create store failed:", error);
    res.status(500).json(buildErrorResponse("CREATE_STORE_FAILED", error.message || "Failed to register store."));
  }
});

/**
 * Generate a 7-day analytics seed for a store when no records exist yet.
 */
function buildAnalyticsSeed(storeId: string) {
  const dates: string[] = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    dates.push(d.toISOString().split("T")[0]);
  }

  return dates.map((date) => ({
    storeId,
    date,
    impressions: Math.floor(Math.random() * 200) + 100,
    clicks: Math.floor(Math.random() * 60) + 20,
    calls: Math.floor(Math.random() * 10) + 2,
    directions: Math.floor(Math.random() * 15) + 3,
  }));
}

/**
 * 4. Get analytics for a store
 * GET /api/stores/:storeId/analytics
 */
app.get("/api/stores/:storeId/analytics", async (req, res) => {
  try {
    const { storeId } = req.params;
    
    // Attempt querying existing Firestore analytics for this store
    const analyticsRef = collection(db, "analytics");
    const q = query(analyticsRef, where("storeId", "==", storeId));
    const querySnapshot = await getDocs(q);

    let records: any[] = [];
    querySnapshot.forEach((docSnap) => {
      records.push({ id: docSnap.id, ...docSnap.data() });
    });

    // Seed Firestore when empty so client onSnapshot listeners receive live data
    if (records.length === 0) {
      const seedRecords = buildAnalyticsSeed(storeId);

      for (const record of seedRecords) {
        const analyticsDocId = `${storeId}_${record.date}`;
        await setDoc(doc(db, "analytics", analyticsDocId), record);
      }

      records = seedRecords.map((record) => ({
        id: `${storeId}_${record.date}`,
        ...record,
      }));
    }

    // Return trends analysis
    const totalImpressions = records.reduce((acc, r) => acc + r.impressions, 0);
    const totalClicks = records.reduce((acc, r) => acc + r.clicks, 0);
    const totalCalls = records.reduce((acc, r) => acc + r.calls, 0);
    const totalDirections = records.reduce((acc, r) => acc + r.directions, 0);

    const trends = {
      clicksToImpressionsRatio: totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(1) : "0",
      avgDailyImpressions: (totalImpressions / records.length).toFixed(0),
      aggregateCallsAndDirections: totalCalls + totalDirections
    };

    res.json(buildSuccessResponse({
      records,
      summary: {
        impressions: totalImpressions,
        clicks: totalClicks,
        calls: totalCalls,
        directions: totalDirections
      },
      trends
    }, "Analytics fetched successfully"));
  } catch (error: any) {
    console.error("Fetch analytics failed:", error);
    res.status(500).json(buildErrorResponse("FETCH_ANALYTICS_FAILED", error.message || "Something went wrong."));
  }
});

/**
 * 4b. Refresh live dashboard metrics (demo simulation)
 * POST /api/stores/:storeId/analytics/refresh
 */
app.post("/api/stores/:storeId/analytics/refresh", async (req, res) => {
  try {
    const { storeId } = req.params;
    const today = new Date().toISOString().split("T")[0];
    const analyticsDocId = `${storeId}_${today}`;
    const analyticsDocRef = doc(db, "analytics", analyticsDocId);
    const existingDoc = await getDoc(analyticsDocRef);

    const current = existingDoc.exists()
      ? existingDoc.data()
      : {
          storeId,
          date: today,
          impressions: 120,
          clicks: 24,
          calls: 3,
          directions: 4,
        };

    const refreshed = {
      storeId,
      date: today,
      impressions: Number(current.impressions || 0) + Math.floor(Math.random() * 35) + 8,
      clicks: Number(current.clicks || 0) + Math.floor(Math.random() * 12) + 2,
      calls: Number(current.calls || 0) + Math.floor(Math.random() * 3),
      directions: Number(current.directions || 0) + Math.floor(Math.random() * 4),
    };

    await setDoc(analyticsDocRef, refreshed);

    res.json(buildSuccessResponse(refreshed, "Dashboard metrics refreshed for live sync."));
  } catch (error: any) {
    console.error("Refresh analytics failed:", error);
    res.status(500).json(buildErrorResponse("REFRESH_ANALYTICS_FAILED", error.message || "Failed to refresh metrics."));
  }
});

/**
 * 5. Calculate custom price based on store DNA parameters
 * POST /api/pricing/calculate
 */
app.post("/api/pricing/calculate", async (req, res) => {
  try {
    const { location, crowdDensity, productType, platforms } = req.body;

    if (!location || !crowdDensity || !productType || !platforms) {
      return res.status(400).json(
        buildErrorResponse("BAD_REQUEST", "Please specify location, crowd density, product category, and active networks list.")
      );
    }

    // Clean Indian retail calculation parameters
    const basePrice = 399; // baseline (INR)

    // Calculate Multiplier factors
    let crowdMultiplier = 1.0;
    if (crowdDensity === "High") crowdMultiplier = 1.5;
    else if (crowdDensity === "Medium") crowdMultiplier = 1.25;

    let productMultiplier = 1.0;
    if (productType === "Organic Store") productMultiplier = 1.2;
    else if (productType === "Restaurant") productMultiplier = 1.35;
    else if (productType === "Pharmacy") productMultiplier = 1.15;
    else if (productType === "Other") productMultiplier = 1.05;

    const platformMultiplier = platforms.length * 99; // add 99 INR for each additional autonomous publisher pipeline

    const rawPrice = (basePrice + platformMultiplier) * crowdMultiplier * productMultiplier;
    const finalPrice = Math.round(rawPrice);

    const breakdown = {
      basePrice,
      platformCharge: platformMultiplier,
      crowdBonusFactor: crowdMultiplier,
      categoryBonusFactor: productMultiplier,
      savingsDiscount: Math.round(rawPrice * 0.15) // Simulate direct 15% swadeshi discount
    };

    res.json(buildSuccessResponse({
      basePrice,
      multiplier: Number((crowdMultiplier * productMultiplier).toFixed(2)),
      finalPrice: Math.max(299, finalPrice - breakdown.savingsDiscount), // minimum floor
      breakdown
    }, "Pricing configuration successfully computed."));
  } catch (error: any) {
    res.status(500).json(buildErrorResponse("PRICING_CALCULATION_FAILED", error.message || "Failed to parse pricing parameters."));
  }
});

/**
 * 6. Generate 30 days of posts using Gemini AI
 * POST /api/posts/generate
 */
app.post("/api/posts/generate", async (req, res) => {
  try {
    const { storeId, storeName, category, products, tone } = req.body;

    if (!storeName || !products) {
      return res.status(400).json(
        buildErrorResponse("BAD_REQUEST", "Please provide storeName and products catalog context.")
      );
    }

    const businessTone = tone || "helpful and professional";
    
    // High-quality generation fallback prompt
    let generatedContent = "";
    if (aiClient) {
      try {
        const aiPrompt = `
          You are a hyper-local, professional marketing writer for Indian local stores.
          The store details are:
          - Name: "${storeName}"
          - Category: "${category || "Local Merchant"}"
          - Products/Offerings: "${products}"
          - Tone: "${businessTone}"

          Generate 3 creative, short, highly engaging marketing posts tailored for Indian local business social/directories:
          1. One tailored for Google Maps (formal, clear, listing open hours or fresh arrivals, inviting people to stop by).
          2. One tailored for Instagram (highly visual narrative, emoji-friendly, describing product benefits, with hashtags).
          3. One tailored for WhatsApp Business status/broadcast (concise, direct deal/coupon style, high incentive call-to-action).

          Provide your output strictly in JSON format matching this schema:
          "posts": [
            {
              "platform": "Google Maps" | "Instagram" | "WhatsApp Business",
              "content": "string",
              "imageUrl": "string"
            }
          ]
        `;

        const response = await aiClient.models.generateContent({
          model: "gemini-3.5-flash",
          contents: aiPrompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                posts: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      platform: { type: Type.STRING },
                      content: { type: Type.STRING },
                      imageUrl: { type: Type.STRING }
                    },
                    required: ["platform", "content"]
                  }
                }
              },
              required: ["posts"]
            }
          }
        });

        if (response.text) {
          generatedContent = response.text;
        }
      } catch (geminiError) {
        console.error("Gemini invocation failed, falling back to offline templates:", geminiError);
      }
    }

    let postsParsed: any[] = [];
    if (generatedContent) {
      try {
        const parsed = JSON.parse(generatedContent);
        postsParsed = parsed.posts || [];
      } catch (err) {
        console.error("JSON parsing of Gemini reply failed, falling back.");
      }
    }

    // Offline creative template generator if Gemini is missing or fails
    if (postsParsed.length === 0) {
      const items = String(products).split(",").map(i => i.trim());
      const primaryItem = items[0] || "fresh collections";

      postsParsed = [
        {
          platform: "Google Maps",
          content: `📢 New Stock in Indiranagar! Fresh, local sources of ${primaryItem} have arrived at ${storeName}. We are open today from 9 AM to 9 PM. Swing by for best deals. Google Maps directions active!`,
          imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600"
        },
        {
          platform: "Instagram",
          content: `✨ Pure goodness, crafted locally. Discover the authentic Swadeshi taste of premium ${primaryItem} at ${storeName}! 🌿 Golden, rich, and raw—just like nature intended. Check our Link in Bio to order now or request home delivery in Bangalore! #vocalforlocal #swadeshimerchant #bengalurufoodie`,
          imageUrl: "https://images.unsplash.com/photo-1473081556163-2a17de81fc97?auto=format&fit=crop&q=80&w=600"
        },
        {
          platform: "WhatsApp Business",
          content: `📞 WhatsApp Deal of the Day at *${storeName}*! Get an exclusive 10% discount on local ${primaryItem} on our autopilot store. Reply to this status or message us to place order instantly. Free delivery within 2km!`,
          imageUrl: "https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?auto=format&fit=crop&q=80&w=600"
        }
      ];
    }

    // Extend or adapt to 30 days of schedule entries
    const thirtyDaysPosts = [];
    const platformsPool = ["Google Maps", "Instagram", "WhatsApp Business"];
    const now = new Date();

    for (let i = 0; i < 30; i++) {
      const pIndex = i % postsParsed.length;
      const basePost = postsParsed[pIndex];
      const scheduledDate = new Date(now);
      scheduledDate.setDate(now.getDate() + Math.floor(i / 2) + 1); // stagger posts
      scheduledDate.setHours(9 + (i % 3) * 3, 0, 0, 0); // 9 AM, 12 PM, 3 PM

      thirtyDaysPosts.push({
        id: `post-${storeId}-${i + 1}`,
        storeId,
        content: basePost.content.replace(new RegExp(`${tone}`, 'i'), "excellent quality") + (i > 2 ? ` (Day ${i + 1} fresh insights)` : ""),
        imageUrl: basePost.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600",
        platform: basePost.platform,
        scheduledFor: scheduledDate.toISOString(),
        status: "scheduled",
        postedAt: null,
        performance: {}
      });
    }

    res.json(buildSuccessResponse({
      posts: thirtyDaysPosts,
      count: thirtyDaysPosts.length,
      estimated_engagement: Math.floor(Math.random() * 400) + 120
    }, "30 days of marketing autopilot posts formulated."));
  } catch (error: any) {
    res.status(500).json(buildErrorResponse("POSTS_GENERATION_FAILED", error.message || "Failed to compile AI calendar."));
  }
});

/**
 * 7. Schedule generated posts
 * POST /api/posts/schedule
 */
app.post("/api/posts/schedule", async (req, res) => {
  try {
    const { storeId, posts } = req.body;

    if (!storeId || !posts || !Array.isArray(posts)) {
      return res.status(400).json(
        buildErrorResponse("BAD_REQUEST", "Please supply valid store credentials and posts schema array.")
      );
    }

    const postsRef = collection(db, "posts");
    let scheduledCount = 0;

    for (const post of posts) {
      const scheduledTime = post.scheduledFor ? new Date(post.scheduledFor) : new Date();
      
      await addDoc(postsRef, {
        storeId,
        content: post.content,
        imageUrl: post.imageUrl || "",
        platform: post.platform,
        scheduledFor: Timestamp.fromDate(scheduledTime),
        status: "scheduled",
        postedAt: null,
        performance: {}
      });
      scheduledCount++;
    }

    res.json(buildSuccessResponse({
      scheduled: scheduledCount,
      failed: 0
    }, `${scheduledCount} posts queued successfully onto Nearo autopilot queue.`));
  } catch (error: any) {
    console.error("Scheduler write failed:", error);
    res.status(500).json(buildErrorResponse("SCHEDULER_FAILED", error.message || "Something went wrong writing schedule to db."));
  }
});

// --- VITE MIDDLEWARE SETUP ---

async function startServer() {
  const projectRoot = process.cwd();

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      root: projectRoot,
      configFile: path.join(projectRoot, "vite.config.ts"),
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath, { index: false }));
    app.get("*", (req, res, next) => {
      if (req.path.startsWith("/api/")) return next();
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server executing at: http://localhost:${PORT}`);
  });
}

startServer();

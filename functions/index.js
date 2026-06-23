const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

/**
 * 1. schedulePost: Triggered on creation of document in the 'posts' collection.
 * When a post is created with a 'scheduledFor' timestamp, it queues it for publication.
 */
exports.schedulePost = functions.firestore
  .document("posts/{postId}")
  .onCreate(async (snapshot, context) => {
    const postData = snapshot.data();
    const postId = context.params.postId;

    if (!postData || !postData.scheduledFor) {
      functions.logger.info(`Post ${postId} created without secondary scheduler constraints.`);
      return null;
    }

    functions.logger.info(`[Scheduler] Post ${postId} successfully registered and queued for publication at ${new Date(postData.scheduledFor.toDate())}`);
    return db.collection("posts").doc(postId).update({
      status: "scheduled"
    });
  });

/**
 * 2. publishPost: Scheduled cron running every 15 minutes.
 * Checks for scheduled posts due now, simulates publishing through platform APIs, and marks them as posted.
 */
exports.publishPost = functions.pubsub
  .schedule("*/15 * * * *")
  .onRun(async (context) => {
    const now = admin.firestore.Timestamp.now();
    functions.logger.info(`[Cron] Executing publishPost checks at ${now.toDate().toISOString()}`);

    try {
      // Find posts scheduled for now or earlier that haven't been published yet
      const pendingSnapshot = await db.collection("posts")
        .where("status", "==", "scheduled")
        .where("scheduledFor", "<=", now)
        .limit(20)
        .get();

      if (pendingSnapshot.empty) {
        functions.logger.info("[Cron] No pending scheduled posts found in queue.");
        return null;
      }

      const batch = db.batch();
      functions.logger.info(`[Cron] Found ${pendingSnapshot.size} posts to publish.`);

      pendingSnapshot.docs.forEach((doc) => {
        const postRef = doc.ref;
        const postData = doc.data();

        // Simulate publishing via Third-Party Local API integration
        functions.logger.info(`[Publisher] Simulating publishing post ${doc.id} onto platform ${postData.platform}`);

        batch.update(postRef, {
          status: "posted",
          postedAt: now,
          performance: {
            impressions: Math.floor(Math.random() * 150) + 50,
            clicks: Math.floor(Math.random() * 20) + 5,
            calls: Math.floor(Math.random() * 3),
            directions: Math.floor(Math.random() * 5)
          }
        });
      });

      await batch.commit();
      functions.logger.info(`[Cron] Successfully processed and published batch updates.`);
    } catch (err) {
      functions.logger.error("[Cron Error] Error publishing posts:", err);
    }
    return null;
  });

/**
 * 3. aggregateAnalytics: Daily scheduled cron running at 11:59 PM.
 * Calculates daily impressions, clicks, calls, directions per store and appends analytics entries.
 */
exports.aggregateAnalytics = functions.pubsub
  .schedule("59 23 * * *")
  .timeZone("Asia/Kolkata")
  .onRun(async (context) => {
    functions.logger.info("[Cron] Running daily retail analytics aggregator...");

    const todayString = new Date().toISOString().split("T")[0];

    try {
      const storesSnapshot = await db.collection("stores").get();
      if (storesSnapshot.empty) {
        functions.logger.info("[Analytics] No active stores found in system.");
        return null;
      }

      const batch = db.batch();

      for (const storeDoc of storesSnapshot.docs) {
        const storeId = storeDoc.id;
        const platforms = storeDoc.data().platforms_active || [];

        // Simulate daily aggregate organic metrics based on store's size & active platform coverage
        const platformCount = platforms.length;
        const multiplier = 1.0 + (platformCount * 0.15);

        const dailyImpressions = Math.floor((Math.floor(Math.random() * 120) + 80) * multiplier);
        const dailyClicks = Math.floor((Math.floor(Math.random() * 25) + 12) * multiplier);
        const dailyCalls = Math.floor((Math.floor(Math.random() * 5) + 2) * multiplier);
        const dailyDirections = Math.floor((Math.floor(Math.random() * 8) + 4) * multiplier);

        const analyticsId = `${storeId}_${todayString}`;
        const analyticsRef = db.collection("analytics").doc(analyticsId);

        batch.set(analyticsRef, {
          storeId: storeId,
          date: todayString,
          impressions: dailyImpressions,
          clicks: dailyClicks,
          calls: dailyCalls,
          directions: dailyDirections,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        functions.logger.info(`[Analytics] Computed daily stats for store: ${storeId}`);
      }

      await batch.commit();
      functions.logger.info("[Analytics] Completed daily retail telemetry integration.");
    } catch (err) {
      functions.logger.error("[Analytics Error] Error compiling reports:", err);
    }
    return null;
  });

/**
 * 4. calculateVisibilityScore: Firestore trigger on store details updates.
 * Recalculates the store's composite visibility score out of 100 on platform presence updates.
 */
exports.calculateVisibilityScore = functions.firestore
  .document("stores/{storeId}")
  .onUpdate(async (change, context) => {
    const beforeData = change.before.data();
    const afterData = change.after.data();
    const storeId = context.params.storeId;

    if (!afterData) return null;

    const beforePlatforms = beforeData.platforms_active || [];
    const afterPlatforms = afterData.platforms_active || [];

    // Trigger score recalculation only if platforms changed (avoid trigger recursion loop)
    const listsMatch = beforePlatforms.length === afterPlatforms.length && 
                       beforePlatforms.every(p => afterPlatforms.includes(p));

    if (listsMatch && beforeData.visibility_score !== undefined) {
      return null;
    }

    functions.logger.info(`[Score Engine] Recalculating sync visibility score for store ${storeId}`);

    // Core business DNA scoring algorithm
    const baseVal = 20; // baseline for store verification
    const pointsPerPlatform = 6.5; // score per connected channel Out of 12
    const totalPlatformsScore = afterPlatforms.length * pointsPerPlatform;

    // Additional checks based on description richness
    const descLengthBonus = afterData.products && afterData.products.length > 50 ? 5 : 0;
    const addressPresentBonus = afterData.address && afterData.address.length > 10 ? 5 : 0;

    const computedScore = Math.min(
      100,
      Math.round(baseVal + totalPlatformsScore + descLengthBonus + addressPresentBonus)
    );

    functions.logger.info(`[Score Engine] Computed final score is ${computedScore}/100. Updating record.`);

    return change.after.ref.update({
      visibility_score: computedScore
    });
  });

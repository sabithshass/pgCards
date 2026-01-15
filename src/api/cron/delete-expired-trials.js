require('dotenv').config();
const connectDB = require('../../../config/dbConnection');
const UserProfile = require('../../../modals/userProfile');

connectDB(); // Connect to MongoDB

export default async function handler(req, res) {
  if (req.headers['x-vercel-cron'] !== 'true') {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const now = new Date();
    const result = await UserProfile.deleteMany({
      isPurchase: { $ne: true },
      trialEndsAt: { $lt: now }
    });

    console.log(`[CRON] Deleted ${result.deletedCount} expired trial users at ${now}`);
    return res.status(200).json({ success: true, deletedCount: result.deletedCount });
  } catch (err) {
    console.error("[CRON ERROR]", err);
    return res.status(500).json({ message: "Cron job failed" });
  }
}

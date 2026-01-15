// const cron = require("node-cron");
// const UserProfile = require("../models/UserProfile");

// const deleteExpiredTrialUsers = async () => {
//   try {
//     const now = new Date();

//     const result = await UserProfile.deleteMany({
//       isPurchase: { $ne: true },
//       trialEndsAt: { $lt: now },
//     });

//     console.log(
//       `[CRON] Deleted ${result.deletedCount} expired trial users at ${now}`
//     );
//   } catch (error) {
//     console.error("[CRON] Error deleting expired trial users:", error);
//   }
// };

// // Runs every day at 2 AM
// cron.schedule("0 2 * * *", async () => {
//   console.log("[CRON] Running expired trial user cleanup...");
//   await deleteExpiredTrialUsers();
// });

// module.exports = deleteExpiredTrialUsers;


const UserProfile = require("../models/UserProfile");

exports.deleteExpiredTrialUsers = async (req, res) => {
  try {
    if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const now = new Date();

    const result = await UserProfile.deleteMany({
      isPurchase: { $ne: true },
      trialEndsAt: { $lt: now }
    });

    return res.status(200).json({
      success: true,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error("[CRON ERROR]", error);
    return res.status(500).json({ message: "Cron job failed" });
  }
};

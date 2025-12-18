// // module.exports.appDownloadRedirect = async (req, res) => {

// //     const userAgent = req.headers["user-agent"]?.toLowerCase() || "";

// //     const IOS_APP_STORE_URL =
// //       "https://apps.apple.com/in/app/pixel-x-racer/id6468572363";

// //     const ANDROID_PLAY_STORE_URL =
// //       "https://play.google.com/store/apps/details?id=com.pixel.pixelxracer.pixelracer";

// //     if (userAgent.includes("iphone") || userAgent.includes("ipad") || userAgent.includes("ios")) {
// //       return {data:IOS_APP_STORE_URL};
// //     }

// //     if (userAgent.includes("android")) {
// //       return{ data:ANDROID_PLAY_STORE_URL};
// //     }


// //     return {data:"https://archfiendstudio.com/"};
 
// // };
// module.exports.appDownloadRedirect = async (req, res) => {

//     const userAgent = req.headers["user-agent"]?.toLowerCase() || "";

//     const IOS_APP_STORE_URL =
//       "https://apps.apple.com/in/app/metashot/id6449360506";

//     const ANDROID_PLAY_STORE_URL =
//       "https://play.google.com/store/apps/details?id=com.metashot.metacricket";

//     if (
//       userAgent.includes("iphone") ||
//       userAgent.includes("ipad") ||
//       userAgent.includes("ios")
//     ) {
//       return res.redirect(302, IOS_APP_STORE_URL);
//     }

//     if (userAgent.includes("android")) {
//       return res.redirect(302, ANDROID_PLAY_STORE_URL);
//     }

//     // fallback (desktop / unknown)
//     return res.redirect(302, "https://metashot.in");
  
// };

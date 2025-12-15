module.exports.appDownloadRedirect = async (req, res) => {

    const userAgent = req.headers["user-agent"]?.toLowerCase() || "";

    const IOS_APP_STORE_URL =
      "https://apps.apple.com/in/app/pixel-x-racer/id6468572363";

    const ANDROID_PLAY_STORE_URL =
      "https://play.google.com/store/apps/details?id=com.pixel.pixelxracer.pixelracer";

    if (userAgent.includes("iphone") || userAgent.includes("ipad") || userAgent.includes("ios")) {
      return res.redirect(IOS_APP_STORE_URL);
    }

    if (userAgent.includes("android")) {
      return res.redirect(ANDROID_PLAY_STORE_URL);
    }


    return res.redirect("https://archfiendstudio.com/");
 
};

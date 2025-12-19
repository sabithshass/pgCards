const UserProfile = require("../modals/userProfile");
const QRCode = require("qrcode");

module.exports.saveUserProfile = async (req, res) => {
  const {
    userId,
    fullName,
    companyDesignation,
    companyName,
    about,
    phoneNumbers,
    emails,
    contactDetails,
    socialMedia,
    backgroundImage,
    profilePicture,
    coverLogo,
    theme,
  } = req.body;

  if (!userId) {
    return {
      msg: "User ID is required",
      code: 400,
    };
  }

  await UserProfile.findOneAndUpdate(
    { user: userId },
    {
      $set: {
        fullName,
        companyDesignation,
        companyName,
        about,
        phoneNumbers,
        emails,
        contactDetails,
        socialMedia,
        backgroundImage,
        profilePicture,
        coverLogo,
        theme,
      },
      $setOnInsert: {
        user: userId,
      },
    },
    {
      upsert: true,
      new: true,
    }
  );

  return {
    data: true,
    msg: "Profile saved successfully",
    code: 200,
    status: "SUCCESS",
  };
};


module.exports.getUserProfileById = async (req) => {
  const userId = req.params.id;

  if (!userId) {
    return {
      data: false,
      msg: "User ID is required",
      code: 400,
    };
  }

  const user = await UserProfile.findById(userId);

  if (!user) {
    return {
      data: false,
      msg: "User not found",
      code: 404,
    };
  }

  return {
    msg: "User profile fetched successfully",
    code: 200,
    status: true,
    data: user,
  };
};

module.exports.generateUserQR = async (req, res) => {
  const { userId } = req.body;

  const userProfile = await UserProfile.findOne({ user: userId });
  if (!userProfile) {
    return { msg: "User not found",code:404 };
  }

  if (userProfile.qrCode) {
    return {
      msg: "Existing QR returned",
      qr: userProfile.qrCode,
      redirectUrl: userProfile.redirectUrl,
    };
  }

  const redirectUrl = `https://pg-cards-seven.vercel.app/user_profile/${userProfile._id}`;

  const qrImage = await QRCode.toDataURL(redirectUrl);

  userProfile.qrCode = qrImage;
  userProfile.redirectUrl = redirectUrl;
  await userProfile.save();

  return {
    msg: "QR generated successfully",
    code:200,
    data:{qr: qrImage,
    redirectUrl:redirectUrl,theme: userProfile.theme,}
  };
};


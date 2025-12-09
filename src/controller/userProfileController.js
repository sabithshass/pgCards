const UserProfile = require("../modals/userProfile");
const QRCode = require("qrcode");

module.exports.saveUserProfile = async (req, res) => {
  const {
    fullName,
    userId,
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
  } = req.body;

  const profileData = {
    user: userId,
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
  };

  let profile = await UserProfile.findOne({ user: userId });

  if (profile) {
    profile = await UserProfile.findOneAndUpdate(
      { user: userId },
      { $set: profileData },
      { new: true }
    );

    return {
      data: true,
      msg: "Profile updated successfully",
      code: 200,
      status: "SUCCESS",
    };
  } else {
    profile = await UserProfile.create(profileData);
    return {
      data: true,
      msg: "Profile created successfully",
      code: 200,
      status: "SUCCESS",
    };
  }
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
    return { msg: "User not found" };
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
    redirectUrl:redirectUrl}
  };
};


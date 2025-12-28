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
    isPurchase,
  } = req.body;

  if (!userId) {
    return {
      msg: "User ID is required",
      code: 400,
    };
  }

  const existingProfile = await UserProfile.findOne({ user: userId });

  const trialEndsAt = existingProfile?.trialEndsAt
    ? existingProfile.trialEndsAt
    : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

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
        isPurchase,
      },
      $setOnInsert: {
        user: userId,
        trialEndsAt,
        isPurchase: false,
      },
    },
    {
      upsert: true,
      new: true,
    }
  );

  console.log("userProfile", UserProfile);
  console.log("theme", theme);

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

  // const now = new Date();
  // const trialValid = user.trialEndsAt && now <= user.trialEndsAt;

  // if (!user.isPurchase && !trialValid) {
  //   return {
  //     data: false,
  //     msg: "Trial expired. Please purchase to continue.",
  //     code: 403,
  //   };
  // }

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
    return { msg: "User not found", code: 404 };
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
    code: 200,
    data: {
      qr: qrImage,
      redirectUrl: redirectUrl,
      theme: userProfile.theme,
      isPurchase: userProfile.isPurchase,
    },
  };
};

// module.exports.generateUserQR = async (req, res) => {
//   const { userId } = req.body;

//   const userProfile = await UserProfile.findOne({ user: userId });
//   if (!userProfile) {
//     return { msg: "User not found", code: 404 };
//   }

//   // If QR already exists
//   if (userProfile.qrCode) {
//     return {
//       msg: "Existing QR returned",
//       qr: userProfile.qrCode,
//       redirectUrl: userProfile.redirectUrl,
//     };
//   }

//   const redirectUrl = `https://pg-cards-seven.vercel.app/user_profile/${userProfile._id}?theme=${encodeURIComponent(
//     userProfile.theme
//   )}`;

//   const qrImage = await QRCode.toDataURL(redirectUrl);

//   userProfile.qrCode = qrImage;
//   userProfile.redirectUrl = redirectUrl;
//   await userProfile.save();

//   return {
//     msg: "QR generated successfully",
//     code: 200,
//     data: {
//       qr: qrImage,
//       redirectUrl: redirectUrl,
//       theme: userProfile.theme,
//       isPurchase: userProfile.isPurchase,
//     },
//   };
// };

// module.exports.getAllUserProfiles = async (req) => {
//   const profiles = await UserProfile.find()
//     .populate("user")
//     .sort({ createdAt: -1 });

//   if (!profiles.length) {
//     return {
//       error: true,
//       msg: "No user profiles found",
//       code: 404,
//     };
//   }

//   return {
//     msg: "Users profile fetched successfully",
//     code: 200,
//     status: true,
//     data: profiles,
//   };
// };

module.exports.getAllUserProfiles = async (req) => {
  const page = parseInt(req.body.page) || 1;
  const limit = parseInt(req.body.limit) || 10;

  const skip = (page - 1) * limit;

  const [profiles, total] = await Promise.all([
    UserProfile.find()
      .populate("user")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    UserProfile.countDocuments(),
  ]);

  if (!profiles.length) {
    return {
      error: true,
      msg: "No user profiles found",
      code: 404,
    };
  }

  return {
    msg: "Users profile fetched successfully",
    code: 200,
    status: true,
    data: {
      list: profiles,
      pagination: {
        totalRecords: total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        limit,
      },
    },
  };
};

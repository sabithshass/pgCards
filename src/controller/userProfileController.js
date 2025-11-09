const UserProfile = require('../models/UserProfile'); // your schema
const User = require('../models/User');

module.exports.saveUserProfile = async (req, res) => {

    const {
      fullName,
      userId,
      companyDesignation,
      companyName,
      about,
      phoneNumbers,
      emails,
      contactDetails
    } = req.body;

    // const userExists = await User.findById(userId);
    // if (!userExists) {
    //   return res.status(404).json({ success: false, message: "User not found" });
    // }


    const profileData = {
      userId,
      fullName,
      companyDesignation,
      companyName,
      about,
      phoneNumbers,
      emails,
      contactDetails
    };

    let profile = await UserProfile.findOne({ user: userId });

    if (profile) {
      profile = await UserProfile.findOneAndUpdate(
        { user: userId },
        { $set: profileData },
        { new: true }
      );
      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: profile
      });
    } else {
      profile = await UserProfile.create(profileData);
      return res.status(201).json({
        success: true,
        message: "Profile created successfully",
        data: profile
      });
    }
  
};

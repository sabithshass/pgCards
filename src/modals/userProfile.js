const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fullName: {
      type: String,
      trim: true,
      required: true,
    },
    companyDesignation: {
      type: String,
      trim: true,
    },
    companyName: {
      type: String,
      trim: true,
    },
    phoneNumbers: [
      {
        label: {
          type: String,
          enum: ["work", "personal", "home", "other"],
          default: "other",
        },
        number: {
          type: String,
          trim: true,
        },
      },
    ],

    emails: [
      {
        emailAddress: {
          type: String,
          trim: true,
          lowercase: true,
        },
      },
    ],
    contactDetails: {
      address: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true },
      googleMapLink: { type: String, trim: true },
    },
    socialMedia: [
      {
        platform: { type: String, trim: true },
        url: { type: String, trim: true },
      },
    ],

    coverLogo: {
      type: String,
      trim: true,
    },

    profilePicture: {
      type: String,
      trim: true,
    },

    backgroundImage: {
      type: String,
      trim: true,
    },
    theme: {
      type: String,
      trim: true,
    },
    trialEndsAt: {
      type: Date,
    },

    isPurchase: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("UserProfile", userProfileSchema);

const mongoose = require("mongoose");

const cardProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: ["PVC", "Metal", "Wooden", "Digital", "Accessories"],
      required: true,
    },
    basePrice: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    material: {
      type: String,
      trim: true,
    },
    features: [
      {
        type: String,
        trim: true,
      },
    ],

    variants: [
      {
        color: {
          type: String,
          required: true,
          trim: true,
        },
        frontImage: {
          type: String,
          required: true,
          trim: true,
        },
        backImage: {
          type: String,
          required: true,
          trim: true,
        },
        price: {
          type: Number,
          required: true,
        },
        finish: {
          type: String,
          trim: true,
        },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("CardProduct", cardProductSchema);

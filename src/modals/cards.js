const mongoose = require("mongoose");

const cardProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    category: {
      type: String,
      enum: ["PVC", "Metal", "Wooden", "Digital", "Accessories"],
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: "INR"
    },
    frontImage: {
      type: String,
      required: true
    },
    backImage: {
      type: String,
      required: true
    },
    material: {
      type: String 
    },
    finish: {
      type: String 
    },
    features: [
      {
        type: String 
      }
    ],
    sku: {
      type: String,
      unique: true
    },
    inStock: {
      type: Boolean,
      default: true
    },
    variants: [
      {
        color: String,
        finish: String,
        price: Number
      }
    ]
  },
  {
    timestamps: true,
    versionKey: false 
  }
);

module.exports = mongoose.model("CardProduct", cardProductSchema);

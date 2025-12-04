const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },

    productId: { type: mongoose.Schema.Types.ObjectId, required: true },
    variantId: { type: mongoose.Schema.Types.ObjectId },

    amount: { type: Number, required: true },    
    currency: { type: String, default: "AED" },

    paymentIntentId: { type: String },
    paymentMethodId: { type: String },
    paymentStatus: { type: String, default: "pending" }, 
    receiptUrl: { type: String },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = mongoose.model("Order", OrderSchema);

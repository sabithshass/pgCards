const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const Order = require("../modals/order");

module.exports.createPaymentIntent = async (req) => {
  const { userId, productId, variantId, amount } = req.body;

  if (!userId || !productId || !variantId || !amount) {
    return { code: 400, msg: "params missing" };
  }

  const paymentCurrency = "aed";

  const order = await Order.create({
    userId,
    productId,
    variantId,
    amount,
    currency: paymentCurrency,
    paymentStatus: "pending",
  });

  // const paymentIntent = await stripe.paymentIntents.create({
  //   amount: amount,
  //   currency: paymentCurrency,
  //   payment_method_types: ["card"],
  //   metadata: {
  //     productId: String(productId),
  //     userId: String(userId),
  //   },
  // });

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "aed",
    payment_method_types: ["card"],
    metadata: {
      orderId: order._id.toString(),
      userId: userId.toString(),
    },
  });

  await Order.findByIdAndUpdate(order._id, {
    paymentIntentId: paymentIntent.id,
  });

  return {
    code: 200,
    msg: "Order Created & Payment Intent Generated",
    data: {
      orderId: order._id,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    },
  };
};




module.exports.confirmPayment = async (req) => {
  const { paymentIntentId, orderId } = req.body;

  if (!paymentIntentId || !orderId) {
    return { code: 400, msg: "params missing" };
  }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "paid",
        paymentIntentId: paymentIntent.id,
        updatedAt: new Date(),
      });

      return { code: 200, msg: "Payment confirmed successfully" };
    } else {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "failed",
        updatedAt: new Date(),
      });

      return { code: 400, msg: `Payment not successful, status: ${paymentIntent.status}` };
    }
 
};
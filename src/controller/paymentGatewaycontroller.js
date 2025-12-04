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

// module.exports.stripeWebhook = async (req) => {
//   try {
//     const sig = req.headers["stripe-signature"];

//     let event;
//     try {
//       event = stripe.webhooks.constructEvent(
//         req.rawBody,
//         sig,
//         process.env.STRIPE_WEBHOOK_SECRET
//       );
//     } catch (err) {
//       return {
//         error: true,
//         msg: "Webhook signature verification failed",
//         details: err.message,
//         code: 400,
//         status: "FAILED",
//       };
//     }

//     if (event.type === "payment_intent.succeeded") {
//       const paymentIntent = event.data.object;

//       return {
//         error: false,
//         data: paymentIntent,
//         msg: "Payment success webhook received",
//         code: 200,
//         status: "SUCCESS",
//       };
//     }

//     return {
//       error: false,
//       data: event,
//       msg: "Webhook received",
//       code: 200,
//       status: "SUCCESS",
//     };
//   } catch (error) {
//     return {
//       error: true,
//       msg: "Webhook error",
//       details: error.message,
//       code: 500,
//       status: "FAILED",
//     };
//   }
// };


module.exports.webhookIntent = async (req) => {
  console.log("STRIPE KEY:", process.env.STRIPE_SECRET_KEY);

  const sig = req.headers["stripe-signature"];

  const event = stripe.webhooks.constructEvent(
    req.body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET
  );

  console.log("EVENT TYPE:", event.type);
  if(!event){
    return{
      msg:"no event provided",
    }
  }


  const paymentIntent = event.data.object;
  const orderId = paymentIntent.metadata?.orderId;

  if (event.type === "payment_intent.succeeded") {
    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: "paid",
      paymentIntentId: paymentIntent.id,
      updatedAt: new Date(),
    });

    console.log("Payment Success:", orderId);
  }

  if (event.type === "payment_intent.payment_failed") {
    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: "failed",
      updatedAt: new Date(),
    });

    console.log("Payment Failed:", orderId);
  }

  if (event.type === "payment_intent.canceled") {
    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: "canceled",
      updatedAt: new Date(),
    });

    console.log("Payment Canceled:", orderId);
  }

  console.log("Unhandled event:", event.type);

  return {
    code: 200,
    msg: "Webhook received",
    data: true,
  };
};


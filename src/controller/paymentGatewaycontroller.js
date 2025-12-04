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




module.exports.config = {
  api: {
    bodyParser: false,
  },
};

function buffer(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

module.exports.webhookIntent = async (req, res) => {
  console.log("STRIPE KEY:", process.env.STRIPE_SECRET_KEY);

  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook Error:", err.message);
    return res.status(400).json({ msg: err.message });
  }

  console.log("EVENT TYPE:", event.type);

  const paymentIntent = event.data.object;
  const orderId = paymentIntent?.metadata?.orderId;

  if (!event) {
    return res.json({ msg: "no event provided" });
  }

  // -------------------------
  // SUCCESS
  // -------------------------
  if (event.type === "payment_intent.succeeded") {
    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: "paid",
      paymentIntentId: paymentIntent.id,
      updatedAt: new Date(),
    });

    console.log("Payment Success:", orderId);
  }

  // -------------------------
  // FAILED
  // -------------------------
  if (event.type === "payment_intent.payment_failed") {
    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: "failed",
      updatedAt: new Date(),
    });

    console.log("Payment Failed:", orderId);
  }

  // -------------------------
  // CANCELED
  // -------------------------
  if (event.type === "payment_intent.canceled") {
    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: "canceled",
      updatedAt: new Date(),
    });

    console.log("Payment Canceled:", orderId);
  }

  console.log("Unhandled event:", event.type);

  return res.json({
    code: 200,
    msg: "Webhook received",
    data: true,
  });
};



// module.exports.webhookIntent = async (req) => {
//   console.log("STRIPE KEY:", process.env.STRIPE_SECRET_KEY);

//   const sig = req.headers["stripe-signature"];

//   const event = stripe.webhooks.constructEvent(
//     req.body,
//     sig,
//     process.env.STRIPE_WEBHOOK_SECRET
//   );

//   console.log("EVENT TYPE:", event.type);
//   if(!event){
//     return{
//       msg:"no event provided",
//     }
//   }


//   const paymentIntent = event.data.object;
//   const orderId = paymentIntent.metadata?.orderId;

//   if (event.type === "payment_intent.succeeded") {
//     await Order.findByIdAndUpdate(orderId, {
//       paymentStatus: "paid",
//       paymentIntentId: paymentIntent.id,
//       updatedAt: new Date(),
//     });

//     console.log("Payment Success:", orderId);
//   }

//   if (event.type === "payment_intent.payment_failed") {
//     await Order.findByIdAndUpdate(orderId, {
//       paymentStatus: "failed",
//       updatedAt: new Date(),
//     });

//     console.log("Payment Failed:", orderId);
//   }

//   if (event.type === "payment_intent.canceled") {
//     await Order.findByIdAndUpdate(orderId, {
//       paymentStatus: "canceled",
//       updatedAt: new Date(),
//     });

//     console.log("Payment Canceled:", orderId);
//   }

//   console.log("Unhandled event:", event.type);

//   return {
//     code: 200,
//     msg: "Webhook received",
//     data: true,
//   };
// };
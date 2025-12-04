const express = require("express");
const router = express.Router();
const reqHandling = require("../utils/reqHandling");
const paymentGatewayController = require("../controller/paymentGatewaycontroller");

router.post("/createPayment", async (req, res) => {
  try {
    const result = await paymentGatewayController.createPaymentIntent(req);

    if (result.error) {
      return reqHandling.handleError({
        res,
        reason: result.msg,
        code: result.code,
      });
    }

    return reqHandling.handleResponse({
      res,
      data: result.data,
      msg: result.msg,
      code: result.code,
      status: result.status,
    });
  } catch (err) {
    return reqHandling.handleError({
      res,
      reason: err.message || "Server error",
      code: 500,
    });
  }
});

router.post("/webhook", async (req, res) => {
  try {
    const result = await paymentGatewayController.webhookIntent(req);

    if (result.error) {
      return reqHandling.handleError({
        res,
        reason: result.msg,
        code: result.code,
      });
    }

    return reqHandling.handleResponse({
      res,
      data: result.data,
      msg: result.msg,
      code: result.code,
      status: result.status,
    });
  } catch (err) {
    return reqHandling.handleError({
      res,
      reason: err.message || "Server error",
      code: 500,
    });
  }
});

module.exports = router;
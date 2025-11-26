const express = require("express");
const router = express.Router();
const cartController = require("../controller/cartController");
const reqHandling = require("../utils/reqHandling");

router.post("/addToCart", async (req, res) => {
  try {
    const result = await cartController.addToCart(req);

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

router.post("/updateQuantity", async (req, res) => {
  try {
    const result = await cartController.updateQuantity(req);

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

router.post("/getUserCart", async (req, res) => {
  try {
    const result = await cartController.getUserCart(req);

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

router.post("/removeItem", async (req, res) => {
  try {
    const result = await cartController.removeItem(req);

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
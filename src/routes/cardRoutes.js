const express = require("express");
const router = express.Router();
const cardController = require("../controller/cardController");
const reqHandling = require("../utils/reqHandling");

router.post("/createProduct", async (req, res) => {
  try {
    const result = await cardController.createProduct(req);

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

router.post("/updateProduct", async (req, res) => {
  try {
    const result = await cardController.updateProduct(req);

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

router.post("/getProducts", async (req, res) => {
  try {
    const result = await cardController.getProducts(req);

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
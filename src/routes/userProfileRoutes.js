const express = require("express");
const router = express.Router();
const userProfileController = require("../controller/userProfileController");
const qrRedirectController =require("../controller/qrRedirectController")
const reqHandling = require("../utils/reqHandling");

router.post("/saveUserProfile", async (req, res) => {
  try {
    const result = await userProfileController.saveUserProfile(req);

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

router.get("/getUserProfile/:id", async (req, res) => {
  try {
    const result = await userProfileController.getUserProfileById(req);

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

router.post("/getUser", async (req, res) => {
  try {
    const result = await userProfileController.generateUserQR(req);

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

router.post("/redirectArchified", async (req, res) => {
  try {
    const result = await qrRedirectController.appDownloadRedirect(req);

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
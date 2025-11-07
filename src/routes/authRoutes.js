const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const googleAuthcontroller= require('../controller/googleAuthcontroller');
const reqHandling = require('../utils/reqHandling');

router.post('/register', async (req, res) => {
    try {
        const result = await authController.register(req);

        if (result.error) {
            return reqHandling.handleError({
                res,
                reason: result.msg,
                code: result.code
            });
        }

        return reqHandling.handleResponse({
            res,
            data: result.data,
            msg: result.msg,
            code: result.code,
            status: result.status
        });

    } catch (err) {
        return reqHandling.handleError({
            res,
            reason: err.message || 'Server error',
            code: 500
        });
    }
});

router.post('/googleAuth', async (req, res) => {
  try {
    const result = await googleAuthcontroller.googleSignIn(req);

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
      reason: err.message || 'Server error',
      code: 500,
    });
  }
});

router.post('/login', async (req, res) => {
    try {
      console.log("entered");
      
        const result = await authController.login(req);

        if (result.error) {
            return reqHandling.handleError({
                res,
                reason: result.msg,
                code: result.code
            });
        }

        return reqHandling.handleResponse({
            res,
            data: result.data,
            msg: result.msg,
            code: result.code,
            status: result.status
        });

    } catch (err) {
        return reqHandling.handleError({
            res,
            reason: err.message || 'Server error',
            code: 500
        });
    }
});

router.post('/forgotPassword', async (req, res) => {
    try {
      console.log("entered");
      
        const result = await authController.forgotPassword(req);

        if (result.error) {
            return reqHandling.handleError({
                res,
                reason: result.msg,
                code: result.code
            });
        }

        return reqHandling.handleResponse({
            res,
            data: result.data,
            msg: result.msg,
            code: result.code,
            status: result.status
        });

    } catch (err) {
        return reqHandling.handleError({
            res,
            reason: err.message || 'Server error',
            code: 500
        });
    }
});

router.post('/resetPassword', async (req, res) => {
    try {
        const result = await authController.resetPassword(req);

        if (result.error) {
            return reqHandling.handleError({
                res,
                reason: result.msg,
                code: result.code
            });
        }

        return reqHandling.handleResponse({
            res,
            data: result.data,
            msg: result.msg,
            code: result.code,
            status: result.status
        });

    } catch (err) {
        return reqHandling.handleError({
            res,
            reason: err.message || 'Server error',
            code: 500
        });
    }
});


module.exports = router;


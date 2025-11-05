const express = require('express');
const router = express.Router();
const { getUploader } = require('../../config/cloudinary');
const uploadController = require('../controller/uploadController');
const reqHandling = require('../utils/reqHandling');

const upload = getUploader('user_profiles'); // you can change folder name

router.post('/single', upload.single('image'), async (req, res) => {
  try {
    const result = await uploadController.uploadSingleImage(req);

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

module.exports.uploadSingleImage = async (req) => {
  if (!req.file) {
    return { error: true, msg: 'No image uploaded', code: 400 };
  }

  const imageUrl = req.file.path;

  return {
    error: false,
    data: imageUrl ,
    msg: 'Image uploaded successfully',
    code: 200,
    status: 'SUCCESS'
  };
};

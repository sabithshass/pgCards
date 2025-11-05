// const cloudinary = require('cloudinary').v2;
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const multer = require('multer');
// require('dotenv').config();

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: 'user_photos', // Cloudinary folder
//     allowed_formats: ['jpg', 'png', 'jpeg'],
//     transformation: [{ quality: 'auto', fetch_format: 'auto' }], // Optimize images
//   },
// });

// const upload = multer({
//   storage,
//   limits: { fileSize: 2 * 1024 * 1024 },
// });

// module.exports = { cloudinary, upload };

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// ✅ Configure your Cloudinary credentials from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Create a storage configuration that Multer uses
const createStorage = (folder = 'uploads') =>
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder, // Cloudinary folder name
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ width: 800, height: 800, crop: 'limit' }],
    },
  });

// ✅ Return a multer instance that uploads directly to Cloudinary
const getUploader = (folder) => multer({ storage: createStorage(folder) });

module.exports = { cloudinary, getUploader };

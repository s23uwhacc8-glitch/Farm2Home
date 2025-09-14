// server/middleware/upload.js
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage setup
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "farm2home", // all images go to this folder
    allowed_formats: ["jpg", "png", "jpeg"],
    transformation: [{ width: 800, crop: "limit" }], // optional resize
  },
});

const upload = multer({ storage });

module.exports = upload;

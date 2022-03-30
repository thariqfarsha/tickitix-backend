const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Jika file disimpan di dalam cloud storage (cloudinary)
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Tickitix",
  },
});

// Jika file disimpan di dalam project backend (localhost)
// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, "public/uploads/movie");
//   },
//   filename(req, file, cb) {
//     cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
//   },
// });

const upload = multer({ storage }).single("image");

module.exports = upload;

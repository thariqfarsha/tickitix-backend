const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const helperWrapper = require("../helpers/wrapper");

// Jika file disimpan di dalam project backend (localhost)
// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, "public/uploads/movie");
//   },
//   filename(req, file, cb) {
//     cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
//   },
// });

module.exports = {
  movieImage: (req, res, next) => {
    // Jika file disimpan di dalam cloud storage (cloudinary)
    const storage = new CloudinaryStorage({
      cloudinary,
      params: {
        folder: "Tickitix/Movie",
      },
    });
    // Tambahkan kondisi untuk limit dan cek ekstensi (fileFilter) di sini (cek multer npm)

    const upload = multer({
      storage,
      limits: { fileSize: 500000 },
      fileFilter: (req, file, cb) => {
        if (file.mimetype !== "image/jpeg" || file.mimetype !== "image/png") {
          cb(new Error("File should be a .jpg or .png image"), false);
        }
        cb(null, true);
      },
    }).single("image");

    upload(req, res, (error) => {
      if (error instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        return helperWrapper.response(res, 401, error.message, null);
      }
      if (error) {
        // An unknown error occurred when uploading.
        return helperWrapper.response(res, 401, error.message, null);
      }
      return next();
    });
  },
  userImage: (req, res, next) => {
    const storage = new CloudinaryStorage({
      cloudinary,
      params: {
        folder: "Tickitix/User",
      },
    });

    const upload = multer({
      storage,
      limits: { fileSize: 500000 },
      fileFilter: (req, file, cb) => {
        if (file.mimetype !== "image/jpeg" || file.mimetype !== "image/png") {
          cb(new Error("File should be a .jpg or .png image"), false);
        }
        cb(null, true);
      },
    }).single("image");

    upload(req, res, (error) => {
      if (error instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        return helperWrapper.response(res, 401, error.message, null);
      }
      if (error) {
        // An unknown error occurred when uploading.
        return helperWrapper.response(res, 401, error.message, null);
      }
      return next();
    });
  },
};

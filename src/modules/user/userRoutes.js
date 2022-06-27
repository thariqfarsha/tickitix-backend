const express = require("express");

const Router = express.Router();
const userController = require("./userController");
const middlewareUpload = require("../../middleware/uploadFile");

Router.get("/:id", userController.getUserById);
Router.patch("/profile/:id", userController.updateProfile);
Router.patch(
  "/image/:id",
  middlewareUpload.userImage,
  userController.updateImage
);
Router.patch("/password/:id", userController.updatePassword);
Router.delete("/image/:id", userController.deleteImage);

module.exports = Router;

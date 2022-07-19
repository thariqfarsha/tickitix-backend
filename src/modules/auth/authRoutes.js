const express = require("express");

const Router = express.Router();

const authController = require("./authController");

Router.post("/register", authController.register);
Router.post("/login", authController.login);
Router.get("/activate/:id", authController.activateAccount);
Router.post("/refresh", authController.refresh);
Router.post("/logout", authController.logout);
Router.post("/forgot-password", authController.forgotPassword);
Router.patch("/reset-password", authController.resetPassword);

module.exports = Router;

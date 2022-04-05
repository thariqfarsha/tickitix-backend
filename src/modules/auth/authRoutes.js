const express = require("express");

const Router = express.Router();

const authController = require("./authController");

Router.post("/register", authController.register);
Router.post("/login", authController.login);
Router.patch("/activate/:id", authController.activateAccount);

module.exports = Router;

const express = require("express");
const bookingController = require("./bookingController");
const middlewareAuth = require("../../middleware/auth");

const Router = express.Router();

Router.post("/", bookingController.createBooking);
Router.get("/id/:id", bookingController.getBookingById);
Router.get("/user/:id", bookingController.getBookingByUserId);
Router.get("/seat", bookingController.getSeatBooking);
Router.get(
  "/dashboard",
  middlewareAuth.isAdmin,
  bookingController.getDashboardBooking
);
Router.patch(
  "/ticket/:id",
  middlewareAuth.isAdmin,
  bookingController.updateStatusBooking
);

module.exports = Router;

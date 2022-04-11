const express = require("express");
const bookingController = require("./bookingController");
const middlewareAuth = require("../../middleware/auth");

const Router = express.Router();

Router.post(
  "/",
  middlewareAuth.authentication,
  bookingController.createBooking
);
Router.post(
  "/midtrans-notification",
  bookingController.postMidtransNotification
);
Router.get(
  "/id/:id",
  middlewareAuth.authentication,
  bookingController.getBookingById
);
Router.get(
  "/user/:id",
  middlewareAuth.authentication,
  bookingController.getBookingByUserId
);
Router.get(
  "/seat",
  middlewareAuth.authentication,
  bookingController.getSeatBooking
);
Router.get(
  "/dashboard",
  middlewareAuth.authentication,
  middlewareAuth.isAdmin,
  bookingController.getDashboardBooking
);
Router.patch(
  "/ticket/:id",
  middlewareAuth.authentication,
  middlewareAuth.isAdmin,
  bookingController.updateStatusBooking
);

module.exports = Router;

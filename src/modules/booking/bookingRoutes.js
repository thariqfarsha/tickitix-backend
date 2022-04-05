const express = require("express");
const bookingController = require("./bookingController");

const Router = express.Router();

Router.post("/", bookingController.createBooking);
Router.get("/id/:id", bookingController.getBookingById);
Router.get("/user/:id", bookingController.getBookingByUserId);
Router.get("/seat", bookingController.getSeatBooking);
Router.get("/dashboard", bookingController.getDashboardBooking);
Router.patch("/ticket/:id", bookingController.updateStatusBooking);

module.exports = Router;

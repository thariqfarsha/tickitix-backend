const helperWrapper = require("../../helpers/wrapper");
const bookingModel = require("./bookingModel");

module.exports = {
  createBooking: async (req, res) => {
    try {
      const {
        scheduleId,
        dateBooking,
        timeBooking,
        paymentMethod,
        totalPayment,
        seats,
      } = req.body;

      const bookingData = {
        scheduleId,
        dateBooking,
        timeBooking,
        totalTicket: seats.length,
        paymentMethod,
        totalPayment,
        statusPayment: "success",
        statusUsed: "active",
      };

      const bookingInfo = await bookingModel.createBooking(bookingData);

      await seats.map((seat) =>
        bookingModel.createBookingSeat({ bookingId: bookingInfo.id, seat })
      );

      return helperWrapper.response(res, 200, "Success create booking", {
        ...bookingInfo,
        seats: req.body.seats,
      });
    } catch (error) {
      return helperWrapper.response(res, 400, "Bad request", null);
    }
  },
  getBookingById: async (req, res) => {
    try {
      const { id } = req.params;

      const result = await bookingModel.getBookingById(id);
      if (result.length <= 0) {
        return helperWrapper.response(
          res,
          404,
          `Data by id ${id} not found`,
          null
        );
      }
      return helperWrapper.response(
        res,
        200,
        "Success get booking by id",
        result
      );
    } catch (error) {
      return helperWrapper.response(res, 400, "Bad request", null);
    }
  },
  getSeatBooking: async (req, res) => {
    try {
      return helperWrapper.response(
        res,
        200,
        "Success get seat booking",
        "data"
      );
    } catch (error) {
      return helperWrapper.response(res, 400, "Bad request", null);
    }
  },
  getDashboardBooking: async (req, res) => {
    try {
      return helperWrapper.response(
        res,
        200,
        "Success get dashboard booking",
        "data"
      );
    } catch (error) {
      return helperWrapper.response(res, 400, "Bad request", null);
    }
  },
  updateStatusBooking: async (req, res) => {
    try {
      return helperWrapper.response(
        res,
        200,
        "Success update status booking",
        "data"
      );
    } catch (error) {
      return helperWrapper.response(res, 400, "Bad request", null);
    }
  },
};

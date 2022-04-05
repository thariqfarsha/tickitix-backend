const helperWrapper = require("../../helpers/wrapper");
const bookingModel = require("./bookingModel");

module.exports = {
  createBooking: async (req, res) => {
    try {
      const { id } = req.decodeToken;
      const {
        scheduleId,
        dateBooking,
        timeBooking,
        paymentMethod,
        totalPayment,
        seats,
      } = req.body;

      const bookingData = {
        userId: id,
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
        bookingModel.createSeatBooking({ bookingId: bookingInfo.id, seat })
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

      const bookingInfo = await bookingModel.getBookingById(id);
      if (bookingInfo.length <= 0) {
        return helperWrapper.response(
          res,
          404,
          `Data by id ${id} not found`,
          null
        );
      }

      const seatByBookingId = await bookingModel.getSeatBookingByBookingId(id);
      const result = {
        ...bookingInfo,
        seat: seatByBookingId,
      };
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
  getBookingByUserId: async (req, res) => {
    try {
      const { id: userId } = req.params;

      const bookingInfo = await bookingModel.getBookingByUserId(userId);
      if (bookingInfo.length <= 0) {
        return helperWrapper.response(
          res,
          404,
          `Data by id ${userId} not found`,
          null
        );
      }

      // eslint-disable-next-line no-restricted-syntax
      for (const data of bookingInfo) {
        // eslint-disable-next-line no-await-in-loop
        const seatByBookingId = await bookingModel.getSeatBookingByBookingId(
          data.id
        );
        data.seat = seatByBookingId;
      }

      return helperWrapper.response(res, 200, "Success get data!", bookingInfo);
    } catch (error) {
      return helperWrapper.response(res, 400, "Bad request", null);
    }
  },
  getSeatBooking: async (req, res) => {
    try {
      const { scheduleId, dateBooking, timeBooking } = req.query;
      const result = await bookingModel.getSeatBooking(
        scheduleId,
        dateBooking,
        timeBooking
      );
      return helperWrapper.response(
        res,
        200,
        "Success get seat booking",
        result
      );
    } catch (error) {
      return helperWrapper.response(res, 400, "Bad request", null);
    }
  },
  getDashboardBooking: async (req, res) => {
    try {
      const { premiere, movieId, location } = req.query;
      const filters = {
        premiere,
        movieId,
        location,
      };

      const condition = [];
      Object.entries(filters).forEach((filter) => {
        if (filter[1]) {
          condition.push(`${filter[0]} = '${filter[1]}'`);
        }
      });
      const sqlWhere =
        condition.length > 0 ? `WHERE ${condition.join(" AND ")}` : "";

      const result = await bookingModel.getDashboardBooking(sqlWhere);
      return helperWrapper.response(
        res,
        200,
        "Success get dashboard booking",
        result
      );
    } catch (error) {
      return helperWrapper.response(res, 400, "Bad request", null);
    }
  },
  updateStatusBooking: async (req, res) => {
    try {
      const { id } = req.params;
      const data = {
        statusUsed: "notActive",
        updatedAt: new Date(Date.now()),
      };
      const result = await bookingModel.updateStatusBooking(data, id);
      return helperWrapper.response(res, 200, "Success use ticket", result);
    } catch (error) {
      return helperWrapper.response(res, 400, "Bad request", null);
    }
  },
};

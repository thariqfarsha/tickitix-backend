const { v4: uuidv4 } = require("uuid");
const helperWrapper = require("../../helpers/wrapper");
const bookingModel = require("./bookingModel");
const helperMidtrans = require("../../helpers/midtrans");
const redis = require("../../config/redis");

module.exports = {
  createBooking: async (req, res) => {
    try {
      const { id: userId } = req.decodeToken;
      const {
        scheduleId,
        dateBooking,
        timeBooking,
        paymentMethod,
        totalPayment,
        seats,
      } = req.body;

      const bookingData = {
        id: uuidv4(),
        userId,
        scheduleId,
        dateBooking,
        timeBooking,
        totalTicket: seats.length,
        paymentMethod,
        totalPayment,
        statusPayment: "pending",
        statusUsed: "active",
      };

      const bookingInfo = await bookingModel.createBooking(bookingData);

      await seats.map((seat) =>
        bookingModel.createSeatBooking({ bookingId: bookingInfo.id, seat })
      );

      const setDataMidtrans = {
        orderId: bookingInfo.id,
        totalPayment,
      };
      const resultMidtrans = await helperMidtrans.post(setDataMidtrans);

      // Set redirect url to redis
      await redis.setEx(
        `redirectUrl:${bookingInfo.id}`,
        3600 * 24,
        resultMidtrans.redirect_url
      );

      return helperWrapper.response(res, 200, "Success create booking", {
        ...bookingInfo,
        seats: req.body.seats,
        redirectUrl: resultMidtrans.redirect_url,
      });
    } catch (error) {
      console.log(error);
      return helperWrapper.response(res, 400, "Bad request", null);
    }
  },
  postMidtransNotification: async (req, res) => {
    try {
      const statusResponse = await helperMidtrans.notif(req.body);

      const orderId = statusResponse.order_id;
      const transactionStatus = statusResponse.transaction_status;
      const fraudStatus = statusResponse.fraud_status;

      const setData = {
        paymentMethod: statusResponse.payment_type,
        updatedAt: new Date(Date.now()),
      };

      console.log(
        `Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`
      );

      if (transactionStatus === "capture") {
        // capture only applies to card transaction, which you need to check for the fraudStatus
        if (fraudStatus === "challenge") {
          // TODO set transaction status on your databaase to 'challenge'
          setData.statusPayment = "pending";
        } else if (fraudStatus === "accept") {
          // TODO set transaction status on your databaase to 'success'
          setData.statusPayment = "success";
        }
      } else if (transactionStatus === "settlement") {
        // TODO set transaction status on your databaase to 'success'
        setData.statusPayment = "success";
      } else if (transactionStatus === "deny") {
        // TODO you can ignore 'deny', because most of the time it allows payment retries
        // and later can become success
      } else if (
        transactionStatus === "cancel" ||
        transactionStatus === "expire"
      ) {
        // TODO set transaction status on your databaase to 'failure'
        setData.statusPayment = "failure";
      } else if (transactionStatus === "pending") {
        // TODO set transaction status on your databaase to 'pending' / waiting payment
        setData.statusPayment = "pending";
      }

      const result = await bookingModel.updateStatusBooking(setData, orderId);
      return helperWrapper.response(
        res,
        200,
        "Success update booking info",
        result
      );
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

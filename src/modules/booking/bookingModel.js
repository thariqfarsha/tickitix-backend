const connection = require("../../config/mysql");

module.exports = {
  createBooking: (data) =>
    new Promise((resolve, reject) => {
      connection.query("INSERT INTO booking SET ?", data, (error) => {
        if (!error) {
          const result = {
            ...data,
          };
          resolve(result);
        } else {
          reject(new Error(error.sqlMessage));
        }
      });
    }),
  createSeatBooking: (data) =>
    new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO bookingSeat SET ?",
        data,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  getBookingById: (bookingId) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT booking.id, scheduleId, dateBooking, timeBooking, totalTicket, 
          totalPayment, paymentMethod, statusPayment, booking.createdAt, 
          booking.updatedAt, movie.name, movie.category FROM booking 
        JOIN schedule ON booking.scheduleId = schedule.id 
        JOIN movie ON schedule.movieId = movie.id 
        WHERE booking.id = ?`,
        bookingId,
        (error, result) => {
          if (!error) {
            resolve(result[0]);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  getSeatBookingByBookingId: (bookingId) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT seat FROM bookingSeat WHERE bookingId = ?",
        bookingId,
        (error, result) => {
          if (!error) {
            // result berbentuk array of object, jadi setiap object dalam array di-map utk diambil valuenya aja
            const newResult = result.map((seatObject) => seatObject.seat);
            resolve(newResult);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  getBookingByUserId: (userId) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT booking.id, scheduleId, dateBooking, timeBooking, totalTicket, 
          totalPayment, paymentMethod, statusPayment, booking.createdAt, 
          booking.updatedAt, movie.name, movie.category, statusUsed 
        FROM booking 
        JOIN schedule ON booking.scheduleId = schedule.id 
        JOIN movie ON schedule.movieId = movie.id 
        WHERE userId = ?`,
        userId,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  getSeatBooking: (scheduleId, dateBooking, timeBooking) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT seat FROM bookingSeat 
        JOIN booking ON bookingSeat.bookingId = booking.id 
        WHERE scheduleId = ? AND dateBooking = ? AND timeBooking = ?`,
        [scheduleId, dateBooking, timeBooking],
        (error, result) => {
          if (!error) {
            const newResult = result.map((seatObject) => seatObject.seat);
            resolve(newResult);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  getDashboardBooking: (condition) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT MONTH(booking.createdAt) AS month, SUM(totalPayment) AS revenue 
        FROM booking 
        JOIN schedule ON booking.scheduleId = schedule.id 
        ${condition} 
        GROUP BY month`,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  updateStatusBooking: (data, id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE booking SET ? WHERE id = ?",
        [data, id],
        (error) => {
          if (!error) {
            resolve({ id, ...data, updatedAt: data.updatedAt });
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
};

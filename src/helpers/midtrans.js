const snap = require("../config/midtrans");

module.exports = {
  post: (data) =>
    new Promise((resolve, reject) => {
      const parameter = {
        transaction_details: {
          order_id: data.orderId,
          gross_amount: data.totalPayment,
        },
        credit_card: {
          secure: true,
        },
      };

      snap
        .createTransaction(parameter)
        .then((transaction) => {
          resolve(transaction);
        })
        .catch((error) => {
          reject(error);
        });
    }),
  notif: (data) =>
    new Promise((resolve, reject) => {
      snap.transaction
        .notification(data)
        .then((statusResponse) => {
          resolve(statusResponse);
        })
        .catch((error) => {
          reject(error);
        });
    }),
};

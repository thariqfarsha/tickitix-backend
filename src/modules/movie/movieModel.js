const connection = require("../../config/mysql");

module.exports = {
  getAllMovie: () =>
    new Promise((resolve, reject) => {
      connection.query("SELECT * FROM movie", (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(new Error(error.sqlMessage));
        }
      });
    }),
};

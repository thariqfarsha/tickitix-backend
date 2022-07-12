const connection = require("../../config/mysql");

module.exports = {
  register: (data) =>
    new Promise((resolve, reject) => {
      connection.query("INSERT INTO user SET ?", data, (error, result) => {
        if (!error) {
          const newResult = {
            id: result.insertId,
            ...data,
          };
          delete newResult.password;
          resolve(newResult);
        } else {
          reject(new Error(error.sqlMessage));
        }
      });
    }),
  getUserByEmail: (email) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM user WHERE email = ?",
        email,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            console.log(error);
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  activateAccount: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE user SET status = 'active' WHERE id = ?",
        id,
        (error) => {
          if (!error) {
            const result = {
              id,
            };
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
};

const connection = require("../../config/mysql");

module.exports = {
  getUserById: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT firstName, lastName, noTelp, role, imagePath FROM user WHERE id = ?",
        id,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  updateProfile: (id, data) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE user SET ? WHERE id = ?",
        [data, id],
        (error) => {
          if (!error) {
            const result = {
              id,
              ...data,
            };
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  getImage: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT imageName FROM user WHERE id = ?",
        id,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  updateImage: (id, data) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE user SET ? WHERE id = ?",
        [data, id],
        (error) => {
          if (!error) {
            const result = {
              id,
              ...data,
            };
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  updatePassword: (id, hash) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE user SET password = ? WHERE id = ?",
        [hash, id],
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

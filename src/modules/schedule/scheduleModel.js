const connection = require("../../config/mysql");

module.exports = {
  getCountSchedule: (movieId, searchLocation) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT COUNT(*) AS total FROM schedule WHERE movieId = ? AND location LIKE ?",
        [movieId, searchLocation],
        (error, result) => {
          if (!error) {
            resolve(result[0].total);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  getAllSchedule: (limit, offset, movieId, searchLocation, sort) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT schedule.*, movie.name, movie.category, movie.director, movie.cast, movie.releaseDate, movie.duration, movie.synopsis FROM schedule JOIN movie ON movieId = movie.id WHERE movieId = ? AND location LIKE ? ORDER BY ${sort} LIMIT ? OFFSET ?`,
        [movieId, searchLocation, limit, offset],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  getScheduleById: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT schedule.*, movie.name, movie.category, movie.director, movie.cast, movie.releaseDate, movie.duration, movie.synopsis FROM schedule JOIN movie ON movieId = movie.id WHERE schedule.id = ?",
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
  createSchedule: (data) =>
    new Promise((resolve, reject) => {
      connection.query("INSERT INTO schedule SET ?", data, (error, result) => {
        if (!error) {
          const newResult = {
            id: result.insertId,
            ...data,
          };
          resolve(newResult);
        } else {
          reject(new Error(error.sqlMessage));
        }
      });
    }),
  updateSchedule: (id, data) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE schedule SET ? WHERE id = ?",
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
  deleteSchedule: (id) =>
    new Promise((resolve, reject) => {
      connection.query("DELETE FROM schedule WHERE id = ?", id, (error) => {
        if (!error) {
          resolve({ id });
        } else {
          reject(new Error(error.sqlMessage));
        }
      });
    }),
};

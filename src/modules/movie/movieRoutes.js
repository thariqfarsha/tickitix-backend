const express = require("express");

const Router = express.Router();

const movieController = require("./movieController");
const middlewareAuth = require("../../middleware/auth");
const middlewareUpload = require("../../middleware/uploadFile");
const middlewareRedis = require("../../middleware/redis");

Router.get("/", middlewareRedis.getAllMovieRedis, movieController.getAllMovie);
Router.get(
  "/:id",
  middlewareRedis.getMovieByIdRedis,
  movieController.getMovieById
);
Router.post(
  "/",
  middlewareAuth.authentication,
  middlewareAuth.isAdmin,
  middlewareUpload.movieImage,
  movieController.createMovie
); // auth, isAdmin
Router.patch(
  "/:id",
  middlewareAuth.authentication,
  middlewareAuth.isAdmin,
  middlewareRedis.clearMovieRedis,
  middlewareUpload.movieImage,
  movieController.updateMovie
); // auth, isAdmin
Router.delete(
  "/:id",
  middlewareAuth.authentication,
  middlewareAuth.isAdmin,
  middlewareRedis.clearMovieRedis,
  middlewareUpload.movieImage,
  movieController.deleteMovie
); // auth, isAdmin

// Router.get("/hello", movieController.getHello);
// Router.get("/hello", (req, res) => {
//   res.status(200);
//   res.send("Hello World");
// });

module.exports = Router;

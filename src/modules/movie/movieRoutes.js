const express = require("express");

const Router = express.Router();

const movieController = require("./movieController");
const middlewareAuth = require("../../middleware/auth");
const middlewareUpload = require("../../middleware/uploadMovie");

Router.get("/", middlewareAuth.authentication, movieController.getAllMovie);
Router.get("/:id", movieController.getMovieById);
Router.post("/", middlewareUpload, movieController.createMovie); // auth, isAdmin
Router.patch("/:id", movieController.updateMovie); // auth, isAdmin
Router.delete("/:id", movieController.deleteMovie); // auth, isAdmin

// Router.get("/hello", movieController.getHello);
// Router.get("/hello", (req, res) => {
//   res.status(200);
//   res.send("Hello World");
// });

module.exports = Router;

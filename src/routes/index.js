const express = require("express");

const Router = express.Router();
const movieRoutes = require("../modules/movie/movieRoutes");

Router.use("/movie", movieRoutes);

// Router.get("/hello", (req, res) => {
//   res.status(200);
//   res.send("Hello World");
// });

module.exports = Router;

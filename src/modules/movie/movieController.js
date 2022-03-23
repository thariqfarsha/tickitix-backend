const helperWrapper = require("../../helpers/wrapper");
const movieModel = require("./movieModel");

module.exports = {
  getHello: async (req, res) => {
    try {
      return helperWrapper.response(
        res,
        200,
        "Success get data!",
        "Hello World"
      );
    } catch (error) {
      return helperWrapper.response(res, 400, "Bad request", null);
    }
  },
  getAllMovie: async (req, res) => {
    try {
      const result = await movieModel.getAllMovie();

      return helperWrapper.response(res, 200, "Success get data!", result);
    } catch (error) {
      return helperWrapper.response(res, 400, "Bad request", null);
    }
  },
  getMovieById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await movieModel.getMovieById(id);

      if (result.length <= 0) {
        return helperWrapper.response(
          res,
          404,
          `Data by id ${id} not found`,
          null
        );
      }

      return helperWrapper.response(
        res,
        200,
        "Success get data!",
        "Hello World"
      );
    } catch (error) {
      return helperWrapper.response(res, 400, "Bad request", null);
    }
  },
  createMovie: async (req, res) => {
    try {
      return helperWrapper.response(
        res,
        200,
        "Success get data!",
        "Hello World"
      );
    } catch (error) {
      return helperWrapper.response(res, 400, "Bad request", null);
    }
  },
  updateMovie: async (req, res) => {
    try {
      return helperWrapper.response(
        res,
        200,
        "Success get data!",
        "Hello World"
      );
    } catch (error) {
      return helperWrapper.response(res, 400, "Bad request", null);
    }
  },
  deleteMovie: async (req, res) => {
    try {
      return helperWrapper.response(
        res,
        200,
        "Success get data!",
        "Hello World"
      );
    } catch (error) {
      return helperWrapper.response(res, 400, "Bad request", null);
    }
  },
};

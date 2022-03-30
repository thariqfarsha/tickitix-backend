const redis = require("../../config/redis");
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
      let { page, limit, searchName, sort } = req.query;
      page = +page || 1;
      limit = +limit || 6;
      searchName = `%${searchName || ""}%`;
      sort = sort || "name";

      const offset = page * limit - limit;
      const totalData = await movieModel.getCountMovie(searchName);
      const totalPage = Math.ceil(totalData / limit);
      const pageInfo = {
        page,
        totalPage,
        limit,
        totalData,
      };

      const result = await movieModel.getAllMovie(
        limit,
        offset,
        searchName,
        sort
      );

      return helperWrapper.response(
        res,
        200,
        "Success get data!",
        result,
        pageInfo
      );
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

      // Proses untuk menyimpan data di redis
      redis.setEx(`getMovie:${id}`, 3600, JSON.stringify(result));

      return helperWrapper.response(res, 200, "Success get data!", result);
    } catch (error) {
      return helperWrapper.response(res, 400, "Bad request", null);
    }
  },
  createMovie: async (req, res) => {
    try {
      console.log(req.file);
      const {
        name,
        category,
        synopsis,
        releaseDate,
        cast,
        director,
        duration,
      } = req.body;
      const setData = {
        name,
        category,
        synopsis,
        releaseDate,
        cast,
        director,
        duration,
      };
      const result = await movieModel.createMovie(setData);

      return helperWrapper.response(res, 200, "Success create data!", result);
    } catch (error) {
      return helperWrapper.response(res, 400, "Bad request", null);
    }
  },
  updateMovie: async (req, res) => {
    try {
      const { id } = req.params;
      const checkId = await movieModel.getMovieById(id);
      if (checkId.length <= 0) {
        return helperWrapper.response(
          res,
          404,
          `Data by id ${id} not found`,
          null
        );
      }

      const {
        name,
        category,
        synopsis,
        releaseDate,
        cast,
        director,
        duration,
      } = req.body;
      const setData = {
        name,
        category,
        synopsis,
        releaseDate,
        cast,
        director,
        duration,
        updatedAt: new Date(Date.now()),
      };

      // kalau ada yang field yang kosong, propertynya akan dihapus dari objek
      // eslint-disable-next-line no-restricted-syntax
      for (const data in setData) {
        if (!setData[data]) {
          delete setData[data];
        }
      }

      const result = await movieModel.updateMovie(id, setData);

      return helperWrapper.response(res, 200, "Success update data!", result);
    } catch (error) {
      return helperWrapper.response(res, 400, "Bad request", null);
    }
  },
  deleteMovie: async (req, res) => {
    try {
      const { id } = req.params;
      const checkId = await movieModel.getMovieById(id);
      if (checkId.length <= 0) {
        return helperWrapper.response(
          res,
          404,
          `Data by id ${id} not found`,
          null
        );
      }

      const result = await movieModel.deleteMovie(id);

      return helperWrapper.response(res, 200, "Success delete data!", result);
    } catch (error) {
      return helperWrapper.response(res, 400, "Bad request", null);
    }
  },
};

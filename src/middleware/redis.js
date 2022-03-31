const redis = require("../config/redis");
const helperWrapper = require("../helpers/wrapper");

module.exports = {
  getMovieByIdRedis: async (req, res, next) => {
    try {
      const { id } = req.params;
      let result = await redis.get(`getMovie:${id}`);
      if (result !== null) {
        // console.log("data ada di dalam redis");
        result = JSON.parse(result);
        return helperWrapper.response(res, 200, "Success get data !", result);
      }
      //   console.log("data tidak ada di dalam redis");
      return next();
    } catch (error) {
      return helperWrapper.response(res, 400, error.message, null);
    }
  },
  getAllMovieRedis: async (req, res, next) => {
    try {
      const data = await redis.get(`getMovie:${JSON.stringify(req.query)}`);
      if (data !== null) {
        const { result, pageInfo } = JSON.parse(data);
        return helperWrapper.response(
          res,
          200,
          "Success get data!",
          result,
          pageInfo
        );
      }
      return next();
    } catch (error) {
      return helperWrapper.response(res, 400, error.message, null);
    }
  },
  clearMovieRedis: async (req, res, next) => {
    try {
      const keys = await redis.keys("getMovie:*");
      if (keys.length > 0) {
        keys.forEach(async (el) => {
          await redis.del(el);
        });
      }
      return next();
    } catch (error) {
      return helperWrapper.response(res, 400, error.message, null);
    }
  },
};

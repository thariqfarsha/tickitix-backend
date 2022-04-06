const jwt = require("jsonwebtoken");
const helperWrapper = require("../helpers/wrapper");
const redis = require("../config/redis");

module.exports = {
  authentication: async (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) {
      return helperWrapper.response(res, 403, "Please login first", null);
    }

    token = token.split(" ")[1];

    const checkTokenRedis = await redis.get(`accessToken:${token}`);
    if (checkTokenRedis) {
      return helperWrapper.response(
        res,
        403,
        "Your token is already destroyed, please login again",
        null
      );
    }

    jwt.verify(token, "RAHASIA", (error, result) => {
      if (error) {
        return helperWrapper.response(res, 403, error.message, null);
      }
      req.decodeToken = result;
    });
    return next();
  },
  isAdmin: (req, res, next) => {
    const { role } = req.decodeToken;
    if (role !== "admin") {
      return helperWrapper.response(
        res,
        401,
        "This action requires administrator privileges",
        null
      );
    }
    return next();
  },
};

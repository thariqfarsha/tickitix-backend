const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const helperWrapper = require("../../helpers/wrapper");
const authModel = require("./authModel");

module.exports = {
  register: async (req, res) => {
    try {
      const { firstName, lastName, noTelp, email, password } = req.body;

      // Email checking
      const checkUser = await authModel.getUserByEmail(email);

      if (checkUser.length > 0) {
        return helperWrapper.response(
          res,
          404,
          "Email has been registered",
          null
        );
      }

      // Password Hashing
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hash = await bcrypt.hash(password, salt);

      const setData = {
        firstName,
        lastName,
        noTelp,
        email,
        password: hash,
      };

      const result = await authModel.register(setData);
      return helperWrapper.response(res, 200, "Success register user", result);
    } catch (error) {
      return helperWrapper.response(res, 400, "Bad response", null);
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const checkUser = await authModel.getUserByEmail(email);

      // Jika email tidak ditemukan di dalam database
      if (checkUser.length < 1) {
        return helperWrapper.response(res, 404, "Email not registered", null);
      }

      // Jika password salah
      const hash = checkUser[0].password;
      const isMatched = await bcrypt.compare(password, hash);
      if (!isMatched) {
        return helperWrapper.response(res, 400, "Wrong password", null);
      }

      // Proses JWT
      const payload = checkUser[0];
      delete payload.password;

      const token = jwt.sign({ ...payload }, "RAHASIA", { expiresIn: "24h" });

      return helperWrapper.response(res, 200, "Success login", {
        id: payload.id,
        token,
      });
    } catch (error) {
      return helperWrapper.response(res, 400, "Bad response", null);
    }
  },
};

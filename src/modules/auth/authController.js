const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const helperWrapper = require("../../helpers/wrapper");
const { sendMail } = require("../../helpers/mail");
const authModel = require("./authModel");
const redis = require("../../config/redis");

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
      const setSendMail = {
        to: email,
        subject: "Email verification",
        name: firstName,
        template: "verificationEmail.html",
        id: result.id,
      };
      await sendMail(setSendMail);

      return helperWrapper.response(
        res,
        200,
        "Success register user, check your inbox to verify your email",
        result
      );
    } catch (error) {
      return helperWrapper.response(res, 400, "Bad request", null);
    }
  },
  activateAccount: async (req, res) => {
    try {
      const { id } = req.params;

      const result = await authModel.activateAccount(id);
      return helperWrapper.response(
        res,
        200,
        "Account activated successfully",
        result
      );
    } catch (error) {
      return helperWrapper.response(res, 400, "Bad request", null);
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

      const token = jwt.sign({ ...payload }, "RAHASIA", { expiresIn: "1h" });
      const refreshToken = jwt.sign({ ...payload }, "RAHASIABARU", {
        expiresIn: "24h",
      });

      return helperWrapper.response(res, 200, "Success login", {
        id: payload.id,
        token,
        refreshToken,
      });
    } catch (error) {
      return helperWrapper.response(res, 400, "Bad response", null);
    }
  },
  refresh: async (req, res) => {
    try {
      const { refreshToken } = req.body;

      const checkRefreshTokenRedis = await redis.get(
        `refreshToken:${refreshToken}`
      );
      if (checkRefreshTokenRedis) {
        return helperWrapper.response(
          res,
          403,
          "Your refresh token cannot be used",
          null
        );
      }

      jwt.verify(refreshToken, "RAHASIABARU", async (error, result) => {
        const payload = result;
        delete payload.iat;
        delete payload.exp;

        const token = jwt.sign(payload, "RAHASIA", { expiresIn: "1h" });
        const newRefreshToken = jwt.sign(payload, "RAHASIABARU", {
          expiresIn: "24h",
        });

        await redis.setEx(
          `refreshToken:${refreshToken}`,
          3600 * 48,
          refreshToken
        );

        return helperWrapper.response(res, 200, "Success refresh token", {
          id: payload.id,
          token,
          refreshToken: newRefreshToken,
        });
      });
    } catch (error) {
      return helperWrapper.response(res, 400, "Bad response", null);
    }
  },
  logout: async (req, res) => {
    try {
      let token = req.headers.authorization;
      const { refreshToken } = req.body;
      token = token.split(" ")[1];

      redis.setEx(`accessToken:${token}`, 3600 * 24, token);
      redis.setEx(`refreshToken:${refreshToken}`, 3600 * 48, refreshToken);
      return helperWrapper.response(res, 200, "Success logout", null);
    } catch (error) {
      return helperWrapper.response(res, 400, "Bad response", null);
    }
  },
};

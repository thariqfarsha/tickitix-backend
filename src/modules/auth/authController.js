const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const helperWrapper = require("../../helpers/wrapper");
const { sendMail } = require("../../helpers/mail");
const authModel = require("./authModel");
const redis = require("../../config/redis");
const userModel = require("../user/userModel");

module.exports = {
  register: async (req, res) => {
    try {
      const { firstName, lastName, noTelp, email, password } = req.body;

      // Email format validation
      const validateEmail = (checkEmail) =>
        String(checkEmail)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );

      if (!validateEmail(email)) {
        return helperWrapper.response(res, 400, "Email is invalid", null);
      }

      // Password format validation
      const validatePassword = (checkPassword) =>
        String(checkPassword).match(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-/<>]).{8,}$/
        );

      if (!validatePassword(password)) {
        return helperWrapper.response(
          res,
          400,
          "Password should be at least 8 characters and contain at least 1 capital letter, 1 number, and 1 special character",
          null
        );
      }

      // Registered email checking
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
        id: uuidv4(),
        firstName,
        lastName,
        noTelp,
        email,
        password: hash,
      };

      const result = await authModel.register(setData);
      const setSendMail = {
        to: email,
        subject: "Account activation",
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
      console.log(error);
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
      console.log(error);
      return helperWrapper.response(res, 400, "Bad request", null);
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
        try {
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
        } catch (err) {
          return helperWrapper.response(res, 400, "Bad response", null);
        }
      });
    } catch (error) {
      console.log(error);
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
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;

      // Email format validation
      const validateEmail = (checkEmail) =>
        String(checkEmail)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );

      if (!validateEmail(email)) {
        return helperWrapper.response(res, 400, "Email is invalid", null);
      }

      // Non registered email checking
      const checkUser = await authModel.getUserByEmail(email);

      if (checkUser.length === 0) {
        return helperWrapper.response(
          res,
          404,
          "Email is not registered",
          null
        );
      }

      const { id, firstName } = checkUser[0];

      const otp = Math.floor(100000 + Math.random() * 900000);

      await redis.setEx(`otp-id:${id}`, 60 * 5, otp);

      const setSendMail = {
        to: email,
        subject: "Reset Password",
        name: firstName,
        template: "resetPasswordEmail.html",
        id,
        otp,
        linkReset: process.env.RESET_PASSWORD_URL,
      };
      await sendMail(setSendMail);

      return helperWrapper.response(
        res,
        200,
        "Check your inbox to reset your password",
        { id, email }
      );
    } catch (error) {
      console.log(error);
      return helperWrapper.response(res, 400, "Bad request", null);
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { id, otp, newPassword, confirmPassword } = req.body;

      const checkOtp = await redis.get(`otp-id:${id}`);
      if (checkOtp !== otp) {
        return helperWrapper.response(res, 400, "OTP is not valid", null);
      }

      // Password format validation
      const validatePassword = (checkPassword) =>
        String(checkPassword).match(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-/<>]).{8,}$/
        );

      if (!validatePassword(newPassword)) {
        return helperWrapper.response(
          res,
          400,
          "New password should be at least 8 characters and contain at least 1 capital letter, 1 number, and 1 special character",
          null
        );
      }

      if (newPassword !== confirmPassword) {
        return helperWrapper.response(
          res,
          400,
          "Confirm password should be the same as new password",
          null
        );
      }

      // Password Hashing
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hash = await bcrypt.hash(newPassword, salt);

      const result = await userModel.updatePassword(id, hash);

      await redis.del(`otp-id:${id}`);

      return helperWrapper.response(
        res,
        200,
        "Your password is successfully updated",
        result
      );
    } catch (error) {
      return helperWrapper.response(res, 400, `Bad request: ${error}`, null);
    }
  },
};

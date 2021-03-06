const bcrypt = require("bcrypt");
const helperWrapper = require("../../helpers/wrapper");
const userModel = require("./userModel");
const cloudinary = require("../../config/cloudinary");

module.exports = {
  getUserById: async (req, res) => {
    try {
      const { id } = req.params;
      const userInfo = await userModel.getUserById(id);
      if (userInfo.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `User by id ${id} not found`,
          null
        );
      }
      return helperWrapper.response(
        res,
        200,
        `Success get user by id ${id}`,
        userInfo
      );
    } catch (error) {
      return helperWrapper.response(res, 400, "Bad request", null);
    }
  },
  updateProfile: async (req, res) => {
    try {
      const { id } = req.params;

      const userInfo = await userModel.getUserById(id);
      if (userInfo.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `User by id ${id} not found`,
          null
        );
      }

      if (id !== req.decodeToken.id) {
        return helperWrapper.response(
          res,
          401,
          "Unable to update profile with different id",
          null
        );
      }

      const { firstName, lastName, noTelp } = req.body;
      const setData = {
        firstName,
        lastName,
        noTelp,
        updatedAt: new Date(Date.now()),
      };
      // eslint-disable-next-line no-restricted-syntax
      for (const data in setData) {
        if (!setData[data]) {
          delete setData[data];
        }
      }

      const updatedProfile = await userModel.updateProfile(id, setData);
      return helperWrapper.response(
        res,
        200,
        "Profile is successfully updated",
        updatedProfile
      );
    } catch (error) {
      return helperWrapper.response(res, 400, "Bad request", null);
    }
  },
  updateImage: async (req, res) => {
    try {
      const { id } = req.params;

      const userInfo = await userModel.getUserById(id);
      if (userInfo.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `User by id ${id} not found`,
          null
        );
      }
      if (id !== req.decodeToken.id) {
        return helperWrapper.response(
          res,
          401,
          "Unable to update user image with different id",
          null
        );
      }

      // hasil invoke userModel.getImage(id) itu data berupa array of object, makanya di-destructure dulu
      const [currentImageName] = await userModel.getImage(id);
      if (currentImageName) {
        // sekarang currentImageName isinya berupa objek -> { imageName: 'blablabla' }
        cloudinary.uploader.destroy(currentImageName.imageName);
      }

      const { filename: imageName, path: imagePath } = req.file;
      const setData = {
        imageName,
        imagePath,
      };
      const result = await userModel.updateImage(id, setData);

      return helperWrapper.response(
        res,
        200,
        "Profile picture is successfully updated",
        result
      );
    } catch (error) {
      console.log(error);
      return helperWrapper.response(res, 400, "Bad request", null);
    }
  },
  deleteImage: async (req, res) => {
    try {
      const { id } = req.params;

      const checkId = await userModel.getUserById(id);
      if (checkId.length <= 0) {
        return helperWrapper.response(
          res,
          404,
          `Data with id ${id} not found`,
          null
        );
      }

      const [currentImageName] = await userModel.getImage(id);
      if (currentImageName) {
        cloudinary.uploader.destroy(currentImageName.imageName);
      }

      const result = await userModel.deleteImage(id);

      return helperWrapper.response(
        res,
        200,
        "Image deleted successfully!",
        result
      );
    } catch (error) {
      console.log(error);
      return helperWrapper.response(res, 400, "Bad request", null);
    }
  },
  updatePassword: async (req, res) => {
    try {
      const { id } = req.params;

      const userInfo = await userModel.getUserById(id);
      if (userInfo.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `User by id ${id} not found`,
          null
        );
      }

      if (id !== req.decodeToken.id) {
        return helperWrapper.response(
          res,
          401,
          "Unable to update password with different id",
          null
        );
      }

      const { newPassword, confirmPassword } = req.body;

      // Password format validation
      const validatePassword = (checkPassword) =>
        String(checkPassword).match(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-/<>]).{8,}$/
        );

      if (!validatePassword(newPassword)) {
        return helperWrapper.response(
          res,
          400,
          "Password should be at least 8 characters and contain at least 1 capital letter, 1 number, and 1 special character",
          null
        );
      }

      if (newPassword !== confirmPassword) {
        return helperWrapper.response(
          res,
          400,
          "Confirm password doesn't match",
          null
        );
      }

      // Password Hashing
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hash = await bcrypt.hash(newPassword, salt);

      const result = await userModel.updatePassword(id, hash);

      return helperWrapper.response(
        res,
        200,
        "Password is successfully updated",
        result
      );
    } catch (error) {
      return helperWrapper.response(res, 400, "Bad request", null);
    }
  },
};

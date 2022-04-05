const redis = require("../../config/redis");
const helperWrapper = require("../../helpers/wrapper");
const movieModel = require("./movieModel");
const cloudinary = require("../../config/cloudinary");

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
      // eslint-disable-next-line prefer-const
      let { page, limit, searchName, sort, searchRelease } = req.query;
      page = +page || 1;
      limit = +limit || 6;
      searchName = `%${searchName || ""}%`;
      sort = sort || "name";
      const whereCondition = searchRelease
        ? `AND MONTH(releaseDate) = ${searchRelease}`
        : "";

      const offset = page * limit - limit;
      const totalData = await movieModel.getCountMovie(
        searchName,
        whereCondition
      );
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
        sort,
        whereCondition
      );

      // Masukkan data ke redis
      redis.setEx(
        `getMovie:${JSON.stringify(req.query)}`,
        3600,
        JSON.stringify({ result, pageInfo })
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

      // image data dimasukkan ke setData kalau diupload dan ada di req.body
      if (req.file) {
        const { filename: imageName, path: imagePath } = req.file;
        Object.assign(setData, { imageName, imagePath });
      }

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

      // Hapus image lama di cloudinary jika ada
      const [currentImageName] = await movieModel.getMovieImage(id);
      if (currentImageName) {
        cloudinary.uploader.destroy(currentImageName.imageName);
      }

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

      if (req.file) {
        const { filename: imageName, path: imagePath } = req.file;
        Object.assign(setData, { imageName, imagePath });
      }

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

      const [currentImageName] = await movieModel.getMovieImage(id);
      if (currentImageName) {
        cloudinary.uploader.destroy(currentImageName.imageName);
      }

      const result = await movieModel.deleteMovie(id);

      return helperWrapper.response(res, 200, "Success delete data!", result);
    } catch (error) {
      return helperWrapper.response(res, 400, "Bad request", null);
    }
  },
};

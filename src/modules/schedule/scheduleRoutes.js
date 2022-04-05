const express = require("express");

const Router = express.Router();

const scheduleController = require("./scheduleController");
const middlewareAuth = require("../../middleware/auth");
const middlewareRedis = require("../../middleware/redis");

Router.get(
  "/",
  middlewareRedis.getAllScheduleRedis,
  scheduleController.getAllSchedule
);
Router.get(
  "/:id",
  middlewareRedis.getScheduleByIdRedis,
  scheduleController.getScheduleById
);
Router.post(
  "/",
  middlewareAuth.authentication,
  middlewareAuth.isAdmin,
  scheduleController.createSchedule
);
Router.patch(
  "/:id",
  middlewareAuth.authentication,
  middlewareAuth.isAdmin,
  middlewareRedis.clearScheduleRedis,
  scheduleController.updateSchedule
);
Router.delete(
  "/:id",
  middlewareAuth.authentication,
  middlewareAuth.isAdmin,
  middlewareRedis.clearScheduleRedis,
  scheduleController.deleteSchedule
);

module.exports = Router;

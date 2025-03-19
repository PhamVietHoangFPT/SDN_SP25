const express = require("express");
const accountIdRouter = express.Router();
const accountController = require("../Controller/profileController");

const checkRole = require("../middlewares/authMiddleware");
const { customer } = require("../constant/constant");

accountIdRouter
  .route("/", checkRole(customer))
  .get(accountController.getProfile);
accountIdRouter
  .route("/editProfile", checkRole(customer))
  .put(accountController.editProfile);
accountIdRouter
  .route("/changePassword", checkRole(customer))
  .put(accountController.editPassword);
module.exports = accountIdRouter;

const express = require("express");
const orderController = require("../Controller/orderController.js");
const { checkRole } = require("../middlewares/authMiddleware");
const manager = require("../constant/constant").manager;

const orderRouter = express.Router();
orderRouter
  .route("/")
  .get(orderController.getAllOrder)
  .post(orderController.addOrder);
orderRouter
  .route("/dashboard")
  .get(checkRole(manager), orderController.getDashboardStats);

module.exports = orderRouter;

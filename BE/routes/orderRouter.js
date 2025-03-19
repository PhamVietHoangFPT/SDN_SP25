const express = require("express");
const checkRole = require("../middlewares/authMiddleware");
const orderController = require("../Controller/orderController.js");
const orderRouter = express.Router();

const manager = require("../constant/constant").manager;
const staff = require("../constant/constant").staff;

orderRouter
  .route("/")
  .get(orderController.getAllOrder)
  .post(orderController.addOrder);

orderRouter
  .route("/:id")
  .get(checkRole(manager, staff), orderController.getOrderByID)
  .put(checkRole(manager, staff), orderController.updateOrderByID)
  .delete(checkRole(manager, staff), orderController.deleteOrder)

module.exports = orderRouter;

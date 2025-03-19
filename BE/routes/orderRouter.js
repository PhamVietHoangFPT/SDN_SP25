const express = require("express");
const checkRole = require("../middlewares/authMiddleware");
const orderController = require("../Controller/orderController.js");
const orderRouter = express.Router();

const manager = require("../constant/constant").manager;
const staff = require("../constant/constant").staff;
const customer = require("../constant/constant").customer;
orderRouter
  .route("/")
  .get(checkRole([manager, staff, customer]), orderController.getAllOrder)
  .post(orderController.addOrder);

orderRouter
  .route("/:id")
  .get(checkRole([manager, staff]), orderController.getOrderByID)
  .put(checkRole([manager, staff]), orderController.updateOrderByID)
  .delete(checkRole([manager, staff]), orderController.deleteOrder)

module.exports = orderRouter;

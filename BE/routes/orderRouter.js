const express = require("express");
const { checkRole } = require("../middlewares/authMiddleware");
const orderController = require("../Controller/orderController.js");
const orderRouter = express.Router();

orderRouter
  .route("/")
  .get(checkRole("Customer"), orderController.getAllOrder)
  .post(checkRole("Customer"), orderController.addOrder);

orderRouter
  .route("/:id")
  .get(checkRole("Customer"), orderController.getOrderByID)
  .put(checkRole("Customer"), orderController.updateOrderByID)
  .delete(checkRole("Customer"), orderController.deleteOrder);

module.exports = orderRouter;

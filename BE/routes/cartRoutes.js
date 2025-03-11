const express = require("express");
const checkRole = require("../middlewares/authMiddleware");
const cartController = require("../Controller/cartController");
const customer = require("../constant/constant").customer;

const cartRoutes = express.Router();

cartRoutes.get("/", checkRole(customer), cartController.getCart);
cartRoutes.post("/add", checkRole(customer), cartController.addToCart);
cartRoutes.put("/update", checkRole(customer), cartController.updateCart);
cartRoutes.delete(
  "/remove/:productId",
  checkRole(customer),
  cartController.removeFromCart
);
cartRoutes.delete("/clear", checkRole(customer), cartController.clearCart);

module.exports = cartRoutes;

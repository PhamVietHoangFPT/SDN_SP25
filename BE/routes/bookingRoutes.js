const express = require("express");
const bookingController = require("../Controller/bookingController");
const checkRole = require("../middlewares/authMiddleware");
const customer = require("../constant/constant").customer;

const router = express.Router();

router.post(
  "/confirm",
  checkRole(customer),
  bookingController.createOrderFromCart
);

module.exports = router;

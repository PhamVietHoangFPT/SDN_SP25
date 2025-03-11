const express = require("express");
const {
  payOrderWithVNPay,
  confirmVNPayPayment,
} = require("../Controller/paymentController");
const customer = require("../constant/constant").customer;
const checkRole = require("../middlewares/authMiddleware");
const paymentRoutes = express.Router();

paymentRoutes.post("/cart/:orderId", checkRole(customer), payOrderWithVNPay); // Tạo thanh toán từ giỏ hàng
paymentRoutes.get("/vnpay-return", checkRole(customer), confirmVNPayPayment); // Xác nhận thanh toán thành công

module.exports = paymentRoutes;

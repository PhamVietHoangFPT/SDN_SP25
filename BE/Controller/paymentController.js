const Order = require("../Models/Order");
const crypto = require("crypto");
const mongoose = require("mongoose");
const moment = require("moment");
require("dotenv").config();

const payOrderWithVNPay = async (req, res) => {
  process.env.TZ = "Asia/Ho_Chi_Minh";

  const { orderId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return res.status(400).json({ error: "Invalid order ID" });
  }

  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  if (order.status !== "Pending") {
    return res.status(400).json({ error: "Order not eligible for payment" });
  }

  const tmnCode = process.env.VNP_TMNCODE?.trim();
  const secretKey = process.env.VNP_HASHSECRET?.trim();
  const returnUrl = process.env.VNP_RETURNURL?.trim();

  if (!tmnCode || !secretKey || !returnUrl) {
    return res
      .status(500)
      .json({ success: false, message: "Missing VNPay configuration in .env" });
  }

  let date = new Date();
  let createDate = moment(date).format("YYYYMMDDHHmmss");
  let expireDate = moment(date).add(15, "minutes").format("YYYYMMDDHHmmss");
  let ipAddr = req.ip || "127.0.0.1";

  let vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Locale: "vn",
    vnp_CurrCode: "VND",
    vnp_TxnRef: orderId,
    vnp_OrderInfo: `Payment for order ${orderId}`,
    vnp_OrderType: "billpayment",
    vnp_Amount: Math.round(Number(order.total) * 100),
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
    vnp_ExpireDate: expireDate,
  };

  // Sort parameters and create signature
  const sortedParams = Object.keys(vnp_Params)
    .sort()
    .map((key) => `${key}=${vnp_Params[key]}`)
    .join("&");

  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(sortedParams, "utf-8")).digest("hex");

  vnp_Params["vnp_SecureHash"] = signed;

  // VNPay payment URL
  const vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
  const paymentUrl = `${vnpUrl}?${sortedParams}&vnp_SecureHash=${signed}`;

  console.log("✅ Sign Data:", sortedParams);
  console.log("✅ Signed Hash:", signed);
  console.log("✅ Payment URL:", paymentUrl);

  res.json({ success: true, paymentUrl: paymentUrl });
};

const confirmVNPayPayment = async (req, res) => {
  const { vnp_ResponseCode, vnp_TxnRef, vnp_SecureHash } = req.query;

  try {
    if (!vnp_ResponseCode || !vnp_TxnRef || !vnp_SecureHash) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const order = await Order.findById(vnp_TxnRef);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order ID not found" });
    }

    // Remove vnp_SecureHash from query params and sort
    const vnp_Params = { ...req.query };
    delete vnp_Params["vnp_SecureHash"];

    const sortedParams = Object.keys(vnp_Params)
      .sort()
      .map((key) => `${key}=${vnp_Params[key]}`)
      .join("&");

    // Verify signature
    const hmac = crypto.createHmac(
      "sha512",
      process.env.VNP_HASHSECRET?.trim()
    );
    const expectedHash = hmac
      .update(Buffer.from(sortedParams, "utf-8"))
      .digest("hex");

    console.log("🔍 Expected Hash:", expectedHash);
    console.log("🔍 Received Hash:", vnp_SecureHash);

    if (expectedHash !== vnp_SecureHash) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment signature" });
    }

    let redirectUrl =
      vnp_ResponseCode !== "00"
        ? "https://selling-clothes-website-five.vercel.app/failed"
        : "https://selling-clothes-website-five.vercel.app/success";

    if (vnp_ResponseCode === "00") {
      order.status = "Paid";
      await order.save();
    } else {
      await Order.findByIdAndDelete(vnp_TxnRef);
    }

    res.redirect(redirectUrl);
  } catch (error) {
    console.error("Payment confirmation error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { payOrderWithVNPay, confirmVNPayPayment };

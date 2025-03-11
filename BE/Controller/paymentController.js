const Order = require("../Models/Order");
const qs = require("qs");
const crypto = require("crypto");
const mongoose = require("mongoose");
require("dotenv").config();

const payOrderWithVNPay = async (req, res) => {
  try {
    const { orderId } = req.params;

    // 🔹 Kiểm tra ID hợp lệ
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

    // 🔹 Định dạng tổng tiền (VNPay yêu cầu VND, không có dấu thập phân)
    const total = Math.round(order.total) * 100;

    if (!total || total <= 0) {
      return res.status(400).json({ error: "Invalid total amount" });
    }

    // 🔹 Tạo thời gian giao dịch
    const createDate = new Date()
      .toISOString()
      .replace(/[^0-9]/g, "")
      .substring(0, 14);

    // 🔹 Tạo các tham số VNPay
    let vnp_Params = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: process.env.VNP_TMNCODE,
      vnp_Locale: "vn",
      vnp_CurrCode: "VND",
      vnp_TxnRef: orderId, // Sử dụng ID của Order
      vnp_OrderInfo: `Payment for order ${orderId}`,
      vnp_OrderType: "billpayment",
      vnp_Amount: total,
      vnp_ReturnUrl: process.env.VNP_RETURNURL,
      vnp_IpAddr:
        req.headers["x-forwarded-for"] || req.connection.remoteAddress, // Lấy IP khách hàng
      vnp_CreateDate: createDate,
    };

    // 🔹 Sắp xếp tham số theo thứ tự từ điển
    vnp_Params = Object.fromEntries(Object.entries(vnp_Params).sort());

    // 🔹 Tạo chữ ký bảo mật (Secure Hash)
    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", process.env.VNP_HASHSECRET);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    vnp_Params.vnp_SecureHash = signed;

    // 🔹 Tạo URL thanh toán VNPay
    const vnpUrl = `${process.env.VNP_URL}?${qs.stringify(vnp_Params, {
      encode: false,
    })}`;

    res.json({ message: "Payment URL generated", payment_url: vnpUrl });
  } catch (error) {
    console.error("VNPay Payment Error:", error);
    res.status(500).json({
      error: "Error processing VNPay payment",
      details: error.message,
    });
  }
};
const confirmVNPayPayment = async (req, res) => {
  try {
    const vnp_Params = req.query;

    // 🔹 Lấy Secure Hash từ VNPay và loại bỏ nó khỏi danh sách params
    const secureHash = vnp_Params.vnp_SecureHash;
    delete vnp_Params.vnp_SecureHash;

    // 🔹 Sắp xếp tham số theo thứ tự từ điển
    const sortedParams = Object.fromEntries(Object.entries(vnp_Params).sort());
    const signData = qs.stringify(sortedParams, { encode: false });

    // 🔹 Tạo chữ ký hash để xác minh tính toàn vẹn của dữ liệu
    const hmac = crypto.createHmac("sha512", process.env.VNP_HASHSECRET);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    // 🔹 Kiểm tra chữ ký hợp lệ không
    if (secureHash !== signed) {
      return res.status(400).json({ error: "Invalid VNPay signature" });
    }

    // 🔹 Kiểm tra trạng thái thanh toán thành công
    if (vnp_Params.vnp_ResponseCode === "00") {
      const orderId = vnp_Params.vnp_TxnRef; // Lấy orderId từ mã giao dịch

      // 🔹 Kiểm tra Order hợp lệ
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json({ error: "Invalid order ID" });
      }

      // 🔹 Cập nhật trạng thái Order thành "Delivered"
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { status: "Delivered" },
        { new: true }
      );

      if (!updatedOrder) {
        return res.status(404).json({ error: "Order not found" });
      }

      return res.json({
        message: "Payment successful",
        order: updatedOrder,
        vnp_Params,
      });
    } else {
      return res.status(400).json({ error: "Payment failed", vnp_Params });
    }
  } catch (error) {
    console.error("VNPay Confirmation Error:", error);
    res.status(500).json({
      error: "Error verifying VNPay payment",
      details: error.message,
    });
  }
};

module.exports = { payOrderWithVNPay, confirmVNPayPayment };

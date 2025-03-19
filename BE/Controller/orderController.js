const Order = require("../Models/Order");
const mongoose = require("mongoose");
const customer = require("../constant/constant").customer;
const manager = require("../constant/constant").manager;
const staff = require("../constant/constant").staff;

const getAllOrder = async (req, res) => {
  const user = req.user;
  const status = req.query.status;
  const filter = {};
  if (status) filter.status = { $regex: status, $options: "i" };
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    let orders

    if (user.role === customer) {
      orders = await Order.find({ $and: [{ account: user.id }, filter] })
        .populate("account")
        .populate("products.product");
    } else if (user.role === manager || user.role === staff) {
      orders = await Order.find(filter)
        .populate("account")
        .populate("products.product");
    }
    res.status(200).json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error retrieving orders", details: error.message });
  }
};

const getOrderByID = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    let order
    if (user.role === customer) {
      order = await Order.find({ account: user._id })
        .populate("account")
        .populate("products.product");
    } else if (user.role === manager || user.role === staff) {
      order = await Order.findById(id)
        .populate("account")
        .populate("products.product");
    }

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error retrieving order", details: error.message });
  }
};

const addOrder = async (req, res) => {
  try {
    const { account, products } = req.body;

    if (!account || !Array.isArray(products) || products.length === 0) {
      return res
        .status(400)
        .json({ error: "Account and products are required" });
    }

    const total = products.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    console.log(products.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
    })),)

    const newOrder = new Order({
      account: account,
      products: products.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      })),
      total: total,

    });

    await newOrder.save();
    res
      .status(201)
      .json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error adding order", details: error.message });
  }
};

const updateOrderByID = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, products } = req.body;

    // 🔹 Kiểm tra Order có tồn tại không
    const updatedOrder = await Order.findById(id);
    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    // 🔹 Cập nhật Status nếu có
    if (status) {
      const validStatuses = [
        "Processing",
        "Pending",
        "Delivered",
        "Cancelled",
        "Paid"
      ];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status value" });
      }
      updatedOrder.status = status;
    }

    // 🔹 Cập nhật Products nếu có
    if (products && Array.isArray(products)) {
      updatedOrder.products = products.map((p) => ({
        product: new mongoose.Types.ObjectId(p.product),
        quantity: p.quantity,
      }));

      // 🔹 Tính lại tổng tiền Order
      updatedOrder.total = products.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    }

    // 🔹 Lưu lại Order đã cập nhật
    await updatedOrder.save();

    res
      .status(200)
      .json({ message: "Order updated successfully", order: updatedOrder });
  } catch (error) {
    console.error("Error updating order:", error);
    res
      .status(500)
      .json({ error: "Error updating order", details: error.message });
  }
};
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error deleting order", details: error.message });
  }
};

module.exports = {
  getAllOrder,
  getOrderByID,
  addOrder,
  updateOrderByID,
  deleteOrder,
};

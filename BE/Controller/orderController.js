const Order = require("../Models/Order");
const mongoose = require("mongoose");

const getAllOrder = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("account")
      .populate("products.product");
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
    const order = await Order.findById(id)
      .populate("account")
      .populate("products.product");

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

    const newOrder = new Order({
      account: new mongoose.Types.ObjectId(account),
      products: products.map((p) => ({
        product: new mongoose.Types.ObjectId(p.product),
        quantity: p.quantity,
      })),
      total,
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

    const updatedOrder = await Order.findById(id);
    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (status) updatedOrder.status = status;
    if (products && Array.isArray(products)) {
      updatedOrder.products = products.map((p) => ({
        product: new mongoose.Types.ObjectId(p.product),
        quantity: p.quantity,
      }));
      updatedOrder.total = products.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    }

    await updatedOrder.save();
    res
      .status(200)
      .json({ message: "Order updated successfully", order: updatedOrder });
  } catch (error) {
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

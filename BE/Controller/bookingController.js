const Cart = require("../Models/Cart");
const Order = require("../Models/Order");

const createOrderFromCart = async (req, res) => {
  try {
    const accountId = req.user.id;
    const cart = await Cart.findOne({ account: accountId }).populate(
      "items.product"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Your cart is empty" });
    }

    const newOrder = new Order({
      account: accountId,
      items: cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      })),
      total: cart.total,
      status: "Processing",
    });

    await newOrder.save();
    cart.items = [];
    cart.total = 0;
    await cart.save();

    res
      .status(201)
      .json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error processing order", details: error.message });
  }
};

module.exports = { createOrderFromCart };

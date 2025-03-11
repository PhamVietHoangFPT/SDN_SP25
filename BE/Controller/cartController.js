const Cart = require("../Models/Cart");
const Product = require("../Models/Product");
const mongoose = require("mongoose");

//  Lấy giỏ hàng và cập nhật giá theo Product
const getCart = async (req, res) => {
  try {
    const accountId = req.user.id;
    let cart = await Cart.findOne({ account: accountId }).populate(
      "items.product",
      "name price image"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(200).json({ message: "Your cart is empty", total: 0 });
    }

    // Cập nhật giá mới từ Product
    cart.items.forEach((item) => {
      if (item.product) {
        item.price = item.product.price; // Luôn lấy giá mới nhất từ Product
      }
    });

    // Tính lại tổng giá trị giỏ hàng
    cart.total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    res.status(200).json(cart);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error retrieving cart", details: error.message });
  }
};

//  Thêm sản phẩm vào giỏ hàng với giá mới nhất từ Product
const addToCart = async (req, res) => {
  try {
    const accountId = req.user.id;
    const { productId, quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    let cart = await Cart.findOne({ account: accountId });

    if (!cart) {
      cart = new Cart({
        account: accountId,
        items: [{ product: productId, quantity, price: product.price }],
        total: product.price * quantity,
      });
    } else {
      const existingItem = cart.items.find((item) =>
        item.product.equals(productId)
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity, price: product.price });
      }
    }

    //  Cập nhật lại `price` từ `Product` trước khi lưu
    cart.items.forEach(async (item) => {
      const updatedProduct = await Product.findById(item.product);
      if (updatedProduct) {
        item.price = updatedProduct.price;
      }
    });

    //  Tính lại tổng tiền (`total`)
    cart.total = cart.items.reduce(
      (sum, item) => sum + (item.price || 0) * item.quantity,
      0
    );

    await cart.save();
    res.status(200).json({ message: "Product added to cart", cart });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error adding to cart", details: error.message });
  }
};

//  Cập nhật số lượng sản phẩm trong giỏ hàng
const updateCart = async (req, res) => {
  try {
    const accountId = req.user.id;
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ account: accountId }).populate(
      "items.product",
      "price"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(200).json({ message: "Your cart is empty", total: 0 });
    }

    const item = cart.items.find((item) => item.product.equals(productId));
    if (!item) {
      return res.status(404).json({ error: "Product not found in cart" });
    }

    item.quantity = quantity;
    item.price = item.product.price; // Cập nhật giá mới

    cart.total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    await cart.save();
    res.status(200).json({ message: "Cart updated", cart });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error updating cart", details: error.message });
  }
};

//  Xóa sản phẩm khỏi giỏ hàng
const removeFromCart = async (req, res) => {
  try {
    const accountId = req.user.id;
    const { productId } = req.params;

    let cart = await Cart.findOne({ account: accountId });

    if (!cart || cart.items.length === 0) {
      return res.status(200).json({ message: "Your cart is empty", total: 0 });
    }

    cart.items = cart.items.filter((item) => !item.product.equals(productId));
    cart.total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    await cart.save();
    res.status(200).json({ message: "Product removed from cart", cart });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error removing from cart", details: error.message });
  }
};

//  Xóa toàn bộ giỏ hàng
const clearCart = async (req, res) => {
  try {
    const accountId = req.user.id;

    let cart = await Cart.findOne({ account: accountId });

    if (!cart || cart.items.length === 0) {
      return res
        .status(200)
        .json({ message: "Your cart is already empty", total: 0 });
    }

    cart.items = [];
    cart.total = 0;
    await cart.save();

    res.status(200).json({ message: "Cart cleared", cart });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error clearing cart", details: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
  clearCart,
};

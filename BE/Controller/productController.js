const Product = require("../Models/Product");

const getAllProduct = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error when retrieving products" });
  }
};

module.exports = { getAllProduct };

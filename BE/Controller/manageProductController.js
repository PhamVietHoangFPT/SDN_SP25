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

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "No Products Found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error when retrieving products" });
  }
};

const addProduct = async (req, res) => {
  try {
    const { name, price, description, category, stock, sold } = req.body;
    if (!name || !price || !category || !stock) {
      return res
        .status(400)
        .json({ message: "Please enter complete information!" });
    }

    const newProduct = new Product({
      name,
      price,
      description,
      category,
      stock,
      sold: sold || 0,
    });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error when adding products" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedProduct)
      return res.status(404).json({ message: "No Products Found" });

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error when updating products" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct)
      return res.status(404).json({ message: "No Products Found" });

    res
      .status(200)
      .json({ message: "Successful product deletion", deletedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error when deleting a product" });
  }
};

module.exports = {
  getAllProduct,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};

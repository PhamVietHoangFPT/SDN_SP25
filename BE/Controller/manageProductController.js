const Product = require("../Models/Product");
const mongoose = require("mongoose");
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
    const { name, price, description, category, stock, sold, images } = req.body;
    if (category && !mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }
    if (!name || !price || !category || !stock || !images) {
      return res
        .status(400)
        .json({ message: "Please enter complete information!" });
    }

    const newProduct = new Product({
      name,
      price,
      description,
      category: new mongoose.Types.ObjectId(category),
      stock,
      images: images,
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
    const { category, ...updateData } = req.body;

    if (category && !mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    if (category) {
      updateData.category = new mongoose.Types.ObjectId(category);
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
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

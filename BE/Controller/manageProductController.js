const Product = require("../Models/Product");

const getAllProduct = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server khi lấy sản phẩm" });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server khi lấy sản phẩm" });
  }
};

const addProduct = async (req, res) => {
  try {
    const { name, price, description, category, stock, sold } = req.body;
    if (!name || !price || !category || !stock) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đầy đủ thông tin!" });
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
    res.status(500).json({ message: "Lỗi server khi thêm sản phẩm" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedProduct)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server khi cập nhật sản phẩm" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    res
      .status(200)
      .json({ message: "Xóa sản phẩm thành công", deletedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server khi xóa sản phẩm" });
  }
};

module.exports = {
  getAllProduct,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};

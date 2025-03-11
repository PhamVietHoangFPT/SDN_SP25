const Product = require("../Models/Product");
const ProductReview = require("../Models/ProductReview");

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

const searchProduct = async (req, res) => {
  try {
    const { query, sortBy, order = "asc" } = req.query;

    // Tạo điều kiện tìm kiếm
    let searchCondition = {};
    if (query) {
      searchCondition.name = { $regex: query, $options: "i" }; // Tìm kiếm không phân biệt hoa thường
    }

    // Xử lý sắp xếp
    let sortOption = {};
    if (sortBy) {
      const orderValue = order === "desc" ? -1 : 1;

      switch (sortBy.toLowerCase()) {
        case "name":
          sortOption.name = orderValue;
          break;
        case "price":
          sortOption.price = orderValue;
          break;
        case "sold":
          sortOption.sold = orderValue;
          break;
        case "rating":
          // Tính trung bình rating từ ProductReview
          const productsWithRating = await Product.aggregate([
            { $match: searchCondition },
            {
              $lookup: {
                from: "productreviews",
                localField: "_id",
                foreignField: "product",
                as: "reviews",
              },
            },
            {
              $project: {
                name: 1,
                price: 1,
                description: 1,
                category: 1,
                stock: 1,
                sold: 1,
                avgRating: { $avg: "$reviews.rating" },
              },
            },
            { $sort: { avgRating: orderValue || 1 } }, // Mặc định ascending nếu không có order
          ]);
          return res.status(200).json(productsWithRating);
        default:
          return res.status(400).json({ message: "Invalid sortBy parameter" });
      }
    }

    // Thực hiện tìm kiếm và sắp xếp cho các trường khác (name, price, sold)
    const products = await Product.find(searchCondition).sort(sortOption);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: "Server error when searching products",
      error: error.message,
    });
  }
};

module.exports = {
  getAllProduct,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  searchProduct,
};

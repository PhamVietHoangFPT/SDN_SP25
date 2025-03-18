const Product = require("../Models/Product");

const getAllProduct = async (req, res) => {
  const searchValue = req.query;
  const pageNumber = parseInt(searchValue.pageNumber) || 1;
  const pageSize = parseInt(searchValue.pageSize) || 12;
  const sort = searchValue.sort || "";
  const name = searchValue.name || "";
  // Xây dựng bộ lọc
  const filter = {};
  if (name) filter.name = { $regex: name, $options: "i" }; // Tìm kiếm theo tên không phân biệt hoa thường

  // Xây dựng sắp xếp
  const sortOptions = {};
  if (sort === "priceAsc") sortOptions.price = 1; // Giá tăng dần
  else if (sort === "priceDesc") sortOptions.price = -1; // Giá giảm dần
  else if (sort === "nameAsc") sortOptions.name = 1; // Tên A-Z
  else if (sort === "nameDesc") sortOptions.name = -1; // Tên Z-A
  else if (sort === "soldDesc") sortOptions.sold = -1; // Bán chạy nhất
  try {
    const products = await Product.find(filter)
      .sort(sortOptions)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    const totalCount = await Product.countDocuments(filter); // Tổng số sản phẩm

    res.json({
      products,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalCount / pageSize),
      totalItems: totalCount,
    });
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

module.exports = { getAllProduct, getProductById };

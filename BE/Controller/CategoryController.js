const Category = require('../Models/Category')
const Product = require("../Models/Product");

const getAllCategory = async (req, res) => {
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
    if (sort === "nameAsc") sortOptions.name = 1; // Tên A-Z
    else if (sort === "nameDesc") sortOptions.name = -1; // Tên Z-A
    try {
        const categories = await Category.find(filter)
            .sort(sortOptions)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize);

        const totalCount = await Category.countDocuments(filter); // Tổng số sản phẩm

        res.json({
            categories,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalCount / pageSize),
            totalItems: totalCount,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error when retrieving cateogries" });
    }
};


const addCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res
                .status(400)
                .json({ message: "Please enter complete information!" });
        }
        // Check if category with this name already exists
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res
                .status(400)
                .json({ message: "Name already exists" });
        }

        const newCategory = new Category({
            name,
        });
        const savedCategory = await newCategory.save();
        res.status(201).json(savedCategory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error when adding category" });
    }
};
const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: "No Category Found" });
        }
        res.status(200).json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error when retrieving products" });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const checkCategory = await Category.findById(id)
        if (!checkCategory) {
            return res.status(400).json({ message: "Category does not exist" })
        }
        // If name is provided in the update, check if it already exists
        if (name) {
            const existingCategory = await Category.findOne({
                name,
                _id: { $ne: id } // Exclude the current category being updated
            });
            if (existingCategory) {
                return res
                    .status(400)
                    .json({ message: "Name already exists" });
            }
        }
        const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        if (!updatedCategory)
            return res.status(404).json({ message: "No Category Found" });

        res.status(200).json(updatedCategory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error when updating products" });
    }
};
const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        // Kiểm tra xem brandId có đang được sử dụng trong Perfume không
        const productExists = await Product.findOne({ category: id });
        if (productExists) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete this brand because it is being used'
            });
        }

        // Nếu không có nước hoa nào sử dụng brand, tiến hành xóa
        const deletedCategory = await Category.findByIdAndDelete(id);
        if (!deletedCategory)
            return res.status(404).json({ message: "No Category Found" });
        res
            .status(200)
            .json({ message: "Successfully deleted category", deletedCategory });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error when deleting a category" });
    }
};
module.exports = {
    getAllCategory,
    addCategory,
    getCategoryById,
    updateCategory,
    deleteCategory
};
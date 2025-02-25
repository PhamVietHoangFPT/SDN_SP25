const Product = require("../Models/Product");

const getAllProduct = async (req, res) => {
  try {
    Product.find({}).then((products) => {
      res.status(200).json(products);
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getAllProduct };

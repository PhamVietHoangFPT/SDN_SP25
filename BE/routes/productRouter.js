const express = require("express");
const productController = require("../Controller/productController");
const productRouter = express.Router();

productRouter.route("/").get(productController.getAllProduct);

module.exports = productRouter;

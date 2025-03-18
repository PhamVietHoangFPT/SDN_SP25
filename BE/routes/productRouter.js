const express = require("express");
const productController = require("../Controller/productController");
const productRouter = express.Router();

productRouter.route("/").get(productController.getAllProduct);
productRouter.route("/:id").get(productController.getProductById);

module.exports = productRouter;

const express = require('express');
const productController = require('../Controller/productController');
const productRouter = express.Router();

productRouter.route('/')
  .get(productController.getAllProduct)
  .post(productController.addProduct)

module.exports = productRouter;
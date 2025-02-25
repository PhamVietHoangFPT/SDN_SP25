const express = require('express')
const productReviewController = require('../Controller/productReviewController.js')
const productReview = express.Router()

productReview.route('/')
  .get(productReviewController.getAllProductReview)
  .post(productReviewController.addProductReview)

module.exports = productReview;
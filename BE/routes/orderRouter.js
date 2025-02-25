const express = require('express')
const orderController = require('../Controller/orderController.js')
const orderController = express.Router()

orderController.route('/')
  .get(orderController.getAllOrder)
  .post(orderController.addOrder)
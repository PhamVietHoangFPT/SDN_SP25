const mongoose = require("mongoose")
const Schema = mongoose.Schema

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
  },
  category: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  sold: {
    type: Number,
    default: 0
  },
}, {
  timestamps: true
})

const Product = mongoose.model('Products', productSchema)
module.exports = Product
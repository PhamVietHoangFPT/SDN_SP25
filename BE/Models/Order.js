const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  account: {
    type: Schema.Types.ObjectId,
    ref: 'Accounts',
    required: true
  },
  products: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Products',
      required: true
    },
    quantity: {
      type: Number,
      required: true
    }
  }],
  status: {
    type: String,
    required: true,
    default: 'Pending'
  },
  total: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
})

const Order = mongoose.model('Orders', orderSchema)
module.exports = Order;
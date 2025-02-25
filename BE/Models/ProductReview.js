const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productReviewSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Products',
    required: true
  },
  account: {
    type: Schema.Types.ObjectId,
    ref: 'Accounts',
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
}, {
  timestamps: true
})
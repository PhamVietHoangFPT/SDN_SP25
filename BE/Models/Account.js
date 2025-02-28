const e = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const customer = require('../constant/constant').customer
const accountSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    default: customer
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true
  },
  address: {
    type: String,
  },
  gender: {
    type: Boolean,
    required: true
  }
}, {
  timestamps: true
})

const Account = mongoose.model('Accounts', accountSchema)
module.exports = Account;
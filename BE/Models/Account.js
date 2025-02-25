const e = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
    enum: ['Manager', 'Staff', 'Customer'],
    default: 'Customer'
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
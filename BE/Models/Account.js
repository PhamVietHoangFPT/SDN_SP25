const e = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const accountSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
  },
  email: {
    type: String,
  },
  role: {
    type: String,
    enum: ['Manager', 'Staff', 'Customer'],
    default: 'Customer'
  },
  phoneNumber: {
    type: String,
  },
  address: {
    type: String,
  },
  gender: {
    type: Boolean,
  }
}, {
  timestamps: true
})

const Account = mongoose.model('Accounts', accountSchema)
module.exports = Account;
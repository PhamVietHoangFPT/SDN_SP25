const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const characterSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  gender: {
    type: Boolean,
    default: true
  },
  img: {
    type: String,
    required: true
  },
}, {
  timestamps: true
});

const Character = mongoose.model('character', characterSchema);

module.exports = Character;
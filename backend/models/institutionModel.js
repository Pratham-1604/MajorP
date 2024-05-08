// models/institutionModel.js
const mongoose = require('mongoose');

const institutionSchema = new mongoose.Schema({
  institution_name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    default: ""
  },
  password: {
    type: String,
    default: ""
  },
  logo: {
    type: String,
    default: ""
  }
});

const Institution = mongoose.model('Institution', institutionSchema);

module.exports = Institution;

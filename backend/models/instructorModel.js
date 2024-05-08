const mongoose = require('mongoose');
const Institution = require('./institutionModel');

const instructorSchema = new mongoose.Schema({
  instructor_firstname: {
    type: String,
    required: true
  },
  instructor_lastname: {
    type: String,
    // required: true
  },
  email: {
    type: String,
    // required: true
  },
  education: [{
    type: String
  }],
  institution: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institution',
  }
});

const Instructor = mongoose.model('Instructor', instructorSchema);

module.exports = Instructor;

const mongoose = require('mongoose');
const Institution = require('./institutionModel');

const instructorSchema = new mongoose.Schema({
  instructor_firstname: {
    type: String,
    required: true
  },
  instructor_lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  DOB: {
    type: Date,
    default: Date.now() // Default value for Date of Birth
  },
  address: {
    type: String,
    default: "" // Default value for address
  },
  education: [{
    type: String // List of strings for education
  }],
  institution: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institution',
    required: true
  }
});

const Instructor = mongoose.model('Instructor', instructorSchema);

module.exports = Instructor;

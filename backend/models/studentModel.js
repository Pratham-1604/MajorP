const mongoose = require('mongoose');
const Course = require('./courseModel');
const Institution = require('./institutionModel');
const Credential = require('./credentialModel');

const studentSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true
  },
  student_firstname: {
    type: String,
    required: true
  },
  student_middlename: {
    type: String
  },
  student_lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  DOB: {
    type: Date,
    required: true
  },
  address: {
    type: String,
  },
  courses_enrolled: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    validate: {
      validator: mongoose.Types.ObjectId.isValid,
      message: props => `${props.value} is not a valid ObjectId`
    }
  }],
  credentials_earned: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Credential',
    validate: {
      validator: mongoose.Types.ObjectId.isValid,
      message: props => `${props.value} is not a valid ObjectId`
    }
  }],
  semester: {
    type: Number
  },
  institution: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institution',
    required: true
  },
  password: {
    type: String,
    default: ""
  },
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;

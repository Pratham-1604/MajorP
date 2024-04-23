// models/testModel.js
const mongoose = require('mongoose');
const Course = require('./courseModel');

const testSchema = new mongoose.Schema({
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  test_name: {
    type: String,
    required: true
  },
  total_marks: {
    type: Number,
    default: 100 // New field for total marks, default value is 100
  }
});

const Test = mongoose.model('Test', testSchema);

module.exports = Test;

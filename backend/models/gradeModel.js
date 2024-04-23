// models/gradeModel.js
const mongoose = require('mongoose');
const Student = require('./studentModel');
const Test = require('./testModel');

const gradeSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  test_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true
  },
  grade: {
    type: Number,
    required: true
  }
});

const Grade = mongoose.model('Grade', gradeSchema);

module.exports = Grade;

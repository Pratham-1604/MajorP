// models/gradeModel.js
const mongoose = require('mongoose');
const Student = require('./studentModel');
const Course = require('./courseModel');

const gradeSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  grade: {
    type: Number,
    required: true
  }
});

const Grade = mongoose.model('Grade', gradeSchema);

module.exports = Grade;

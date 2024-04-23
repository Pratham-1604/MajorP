const mongoose = require('mongoose');
const Instructor = require('./instructorModel');
const Subject = require('./subjectModel');
const Test = require('./testModel');
const Institution = require('./institutionModel');

const courseSchema = new mongoose.Schema({
  course_name: {
    type: String,
    required: true
  },
  course_credits: {
    type: Number,
    required: true
  },
  course_description: {
    type: String, 
    default: "" // New field for course description
  },
  instructors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Instructor'
  }],
  subjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }],
  tests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test'
  }],
  institution: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institution'
  },
  students_enrolled: {
    type: Number,
    default: 0
  }
  // Add defaults for other fields as needed
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;

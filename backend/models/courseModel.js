const mongoose = require('mongoose');
const Instructor = require('./instructorModel');
const Subject = require('./subjectModel');
const Test = require('./testModel');
const Institution = require('./institutionModel');
const Student = require('./studentModel'); // Assuming you have a Student model

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
    default: ""
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
  students_enrolled: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student' // Reference to the Student model
  }],
  imgsrc: {
    type: String,
    default: ""
  }
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;

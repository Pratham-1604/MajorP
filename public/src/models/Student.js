const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  studentId: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    sparse: true
  },
  eligibleCourses: {
    type: [String],
    enum: ['CSE', 'EXTC', 'MCA'],
    default: []
  },
  selectedCourse: {
    type: String,
    enum: ['CSE', 'EXTC', 'MCA', null],
    default: null
  },
  isAdmitted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Student', StudentSchema);
// models/credentialModel.js
const mongoose = require('mongoose');
const Student = require('./studentModel');
const Course = require('./courseModel');

const credentialSchema = new mongoose.Schema({
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  credits_earned: {
    type: Number,
    required: true
  },
  credential_hash: {
    type: String,
    required: true
  }
});

const Credential = mongoose.model('Credential', credentialSchema);

module.exports = Credential;

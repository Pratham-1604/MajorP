// models/subjectModel.js
const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  subject_name: {
    type: String,
    required: true
  }
});

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;

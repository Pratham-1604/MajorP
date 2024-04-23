//controllers/subjectController.js
const Subject = require('../models/subjectModel');

// GET all subjects
exports.getAllSubjects = async (req, res, next) => {
  try {
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (err) {
    next(err);
  }
};

// GET a specific Subject by ID
exports.getSubjectById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const subject = await Subject.findById(id);
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }
    res.json(subject);
  } catch (err) {
    next(err);
  }
};

// POST a new subject
exports.createSubject = async (req, res, next) => {
  try {
    const subject = new Subject(req.body);
    await subject.save();
    res.status(201).json(subject);
  } catch (err) {
    next(err);
  }
};

// PUT (update) a subject
exports.updateSubject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedSubject = await Subject.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedSubject) {
      return res.status(404).json({ error: 'Subject not found' });
    }
    res.json(updatedSubject);
  } catch (err) {
    next(err);
  }
};

// DELETE a course
exports.deleteSubject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedSubject = await Subject.findByIdAndDelete(id);
    if (!deletedSubject) {
      return res.status(404).json({ error: 'Subject not found' });
    }
    res.json({ message: 'Subject deleted successfully' });
  } catch (err) {
    next(err);
  }
};

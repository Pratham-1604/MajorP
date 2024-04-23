// controllers/gradeController.js
const Grade = require('../models/gradeModel');

// GET all grades
exports.getAllGrades = async (req, res, next) => {
  try {
    const grades = await Grade.find();
    res.json(grades);
  } catch (err) {
    next(err);
  }
};

// GET a specific grade by ID
exports.getGradeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const grade = await Grade.findById(id);
    if (!grade) {
      return res.status(404).json({ error: 'Grade not found' });
    }
    res.json(grade);
  } catch (err) {
    next(err);
  }
};

// POST a new grade
exports.createGrade = async (req, res, next) => {
  try {
    const grade = new Grade(req.body);
    await grade.save();
    res.status(201).json(grade);
  } catch (err) {
    next(err);
  }
};

// PUT (update) a grade
exports.updateGrade = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedGrade = await Grade.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedGrade) {
      return res.status(404).json({ error: 'Grade not found' });
    }
    res.json(updatedGrade);
  } catch (err) {
    next(err);
  }
};

// DELETE a grade
exports.deleteGrade = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedGrade = await Grade.findByIdAndDelete(id);
    if (!deletedGrade) {
      return res.status(404).json({ error: 'Grade not found' });
    }
    res.json({ message: 'Grade deleted successfully' });
  } catch (err) {
    next(err);
  }
};

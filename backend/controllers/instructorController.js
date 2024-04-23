// controllers/instructorController.js
const Instructor = require('../models/instructorModel');

// GET all instructors
exports.getAllInstructors = async (req, res, next) => {
  try {
    const instructors = await Instructor.find().populate('institution');
    res.json(instructors);
  } catch (err) {
    next(err);
  }
};

// GET a specific instructor by ID
exports.getInstructorById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const instructor = await Instructor.findById(id).populate('institution');
    if (!instructor) {
      return res.status(404).json({ error: 'Instructor not found' });
    }
    res.json(instructor);
  } catch (err) {
    next(err);
  }
};

// POST a new instructor
exports.createInstructor = async (req, res, next) => {
  try {
    const instructor = new Instructor(req.body);
    await instructor.save();
    res.status(201).json(instructor);
  } catch (err) {
    next(err);
  }
};

// PUT (update) an instructor
exports.updateInstructor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedInstructor = await Instructor.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedInstructor) {
      return res.status(404).json({ error: 'Instructor not found' });
    }
    res.json(updatedInstructor);
  } catch (err) {
    next(err);
  }
};

// DELETE an instructor
exports.deleteInstructor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedInstructor = await Instructor.findByIdAndDelete(id);
    if (!deletedInstructor) {
      return res.status(404).json({ error: 'Instructor not found' });
    }
    res.json({ message: 'Instructor deleted successfully' });
  } catch (err) {
    next(err);
  }
};

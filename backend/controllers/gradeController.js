// controllers/gradeController.js
const Grade = require('../models/gradeModel');
const Student = require('../models/studentModel'); // Adjust the path to your Student model
const Course = require('../models/courseModel');   // Adjust the path to your Course model
const axios = require('axios'); // Ensure axios is installed and imported

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


exports.assignGrade = async (req, res, next) => {
  try {
    const { student_id, course_id, grade } = req.body;
    console.log(student_id, course_id, grade);

    // Validate input
    if (!student_id || !course_id || grade === undefined) {
      return res.status(400).json({ message: 'Student ID, Course ID, and grade are required.' });
    }

    // Fetch student and course objects
    const student = await Student.findById(student_id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    const course = await Course.findById(course_id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    // Save or update grade in the database
    const updatedGrade = await Grade.findOneAndUpdate(
      { student_id, course_id }, // Search criteria
      { grade }, // Update the grade
      { new: true, upsert: true, runValidators: true } // Options: create if not exists
    );

    // // Blockchain API
    // const apiBody = {
    //     email: student.email,
    //     course_name: course.name,
    //     grades: grade,
    // };

    // await axios.post('https://example.com/api/endpoint', apiBody); // Replace with actual API URL

    // Return success response
    return res.status(200).json({
      message: 'Grade assigned successfully.',
      data: updatedGrade,
    });
  } catch (err) {
    console.error('Error assigning grade:', err);
    res.status(500).json({
      message: 'Internal server error.',
      error: err.message,
    });
  }
};


exports.searchGrade = async (req, res, next) => {
  try {
    const { student_id, course_id } = req.params;
    console.log('Searching for grade:', student_id, course_id);

    // Validate input
    if (!student_id || !course_id) {
      return res.status(400).json({ message: 'Student ID, Course ID are required.' });
    }

    // Find the grade in the database
    const foundGrade = await Grade.findOne({ student_id, course_id });

    // Check if the grade was found
    if (!foundGrade) {
      return res.status(200).json({ grade: '0' });
    }

    // Return the grade
    return res.status(200).json({
      grade: foundGrade.grade,
    });
  } catch (err) {
    console.error('Error searching for grade:', err);
    res.status(500).json({
      message: 'Internal server error.',
      error: err.message,
    });
  }
}

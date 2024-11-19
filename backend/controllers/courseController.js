const Course = require('../models/courseModel');
const Student = require('../models/studentModel');
const mongoose = require('mongoose');

// GET all courses
exports.getAllCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().populate('instructors subjects tests institution students_enrolled');
    res.json(courses);
  } catch (err) {
    next(err);
  }
};

exports.getCoursesByInstitutionId = async (req, res, next) => {
  try {
    const institutionId = req.params.institutionId; // Get the institution ID from query params
    // Check if institutionId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(institutionId)) {
      return res.status(400).json({ error: 'Invalid institution ID format.' });
    }

    // Convert the string to ObjectId
    const convertedInstitutionId = new mongoose.Types.ObjectId(institutionId);

    // Fetch courses by institution ID
    const courses = await Course.find({ institution: convertedInstitutionId }) // Filter courses by institution
      .populate('instructors subjects tests institution');
    
    res.json(courses);
    console.log(req.query);
  } catch (err) {
    next(err);
  }
};

// GET a specific course by ID
exports.getCourseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id).populate('instructors subjects tests institution students_enrolled');
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(course);
  } catch (err) {
    next(err);
  }
};

// POST a new course
exports.createCourse = async (req, res, next) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    next(err);
  }
};

// PUT (update) a course
exports.updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedCourse = await Course.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(updatedCourse);
  } catch (err) {
    next(err);
  }
};

// DELETE a course
exports.deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedCourse = await Course.findByIdAndDelete(id);
    if (!deletedCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    next(err);
  }
};

const Test = require('../models/testModel');
const Grade = require('../models/gradeModel');

// Calculate weighted sum of grades for a student in a specific course
exports.calculateWeightedSum = async (req, res, next) => {
  try {
    const { studentId, courseId } = req.params;

    // Find all tests for the student in the specified course
    const tests = await Test.find({ course_id: courseId });

    // Calculate weighted sum of grades
    let weightedSum = 0;
    for (const test of tests) {
      // Retrieve grade for the student in the current test
      const grade = await Grade.findOne({ student_id: studentId, test_id: test._id });
      if (grade) {
        // Add weighted grade to the sum (assuming each test has equal weight)
        weightedSum += (grade.grade / 100) * test.total_marks;
      }
    }

    res.json({ weightedSum });
  } catch (error) {
    next(error);
  }
};


exports.bulkFetchCourses = async (req, res, next) => {
  const { courseIds } = req.body;
  try {
    const courses = await Course.find({ _id: { $in: courseIds } });
    res.json(courses);
  } catch (error) {
    next(error);
  }
}


exports.enrollInCourse = async (req, res, next) => {
  try {
    const { studentId } = req.body;
    const { courseId } = req.params;
    console.log(studentId);
    console.log(courseId);
    // Find the course by ID
    const course = await Course.findById(courseId);
    console.log(course);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Find the student by ID
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    
    if (!course.students_enrolled.includes(studentId)) {
      course.students_enrolled.push(studentId);
      await course.save();
    }

    // Add the course to the student's enrolled courses
    if (!student.courses_enrolled.includes(courseId)) {
      student.courses_enrolled.push(courseId);
      await student.save();
    }
    

    res.status(200).json({ message: "Enrollment successful" });
  } catch (err) {
    console.error(err);
    // next(err)
  }
}
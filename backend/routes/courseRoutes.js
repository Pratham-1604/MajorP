// routes/courseRoutes.js
const express = require('express');
const courseController = require('../controllers/courseController');

const router = express.Router();

// GET all courses
router.get('/', courseController.getAllCourses);

// GET a specific course by ID
router.get('/:id', courseController.getCourseById);

// POST a new course
router.post('/', courseController.createCourse);

// PUT i.e. update/create course
router.put('/:id', courseController.updateCourse);

// DELETE a course
router.delete('/:id', courseController.deleteCourse);

// Calculate weighted sum of grades for a student in a specific course
router.get('/weightedSum/:studentId/:courseId', courseController.calculateWeightedSum);

// Filter by institution ID
router.get('/institute/:institutionId', courseController.getCoursesByInstitutionId); 
module.exports = router;

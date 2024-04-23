// routes/studentsRoutes.js
const express = require('express');
const studentController = require('../controllers/studentController');

const router = express.Router();

// GET all studentss
router.get('/', studentController.getAllStudents);

// GET a specific students by ID
router.get('/:id', studentController.getStudentById);

// POST a new students
router.post('/', studentController.createStudent);

// PUT i.e. update/create students
router.put('/:id', studentController.updateStudent);

// DELETE a students
router.delete('/:id', studentController.deleteStudent);

module.exports = router;

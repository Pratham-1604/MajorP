// routes/studentsRoutes.js
const express = require('express');
const authenticate = require('../middleware/authMiddleware');
const studentController = require('../controllers/studentController');

const router = express.Router();

// GET all students (authentication not required, unless needed)
router.get('/', authenticate, studentController.getAllStudents);

// POST for student login (authentication not required)
router.post('/login', studentController.studentLogin);

// POST for student registration (authentication not required)
router.post('/register', studentController.studentRegister);

// GET the logged-in student's profile (authentication required)
router.get('/profile', authenticate, studentController.getProfile);

// PUT to update the logged-in student's profile (authentication required)
router.put('/profile', authenticate, studentController.updateProfile);

// GET a specific student by ID
router.get('/:id', authenticate, studentController.getStudentById);

// POST a new student (authentication may not be needed for registration)
router.post('/', studentController.createStudent);

// PUT i.e. update/create student (authentication required)
router.put('/:id', authenticate, studentController.updateStudent);

// DELETE a student (authentication required)
router.delete('/:id', authenticate, studentController.deleteStudent);



module.exports = router;

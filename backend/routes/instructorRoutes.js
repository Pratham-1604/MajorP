// routes/instructorRoutes.js
const express = require('express');
const instructorController = require('../controllers/instructorController');

const router = express.Router();

// GET all instructors
router.get('/', instructorController.getAllInstructors);

// GET a specific instructor by ID
router.get('/:id', instructorController.getInstructorById);

// POST a new instructor
router.post('/', instructorController.createInstructor);

// PUT (update) an instructor
router.put('/:id', instructorController.updateInstructor);

// DELETE an instructor
router.delete('/:id', instructorController.deleteInstructor);

module.exports = router;

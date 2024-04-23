// routes/gradeRoutes.js
const express = require('express');
const gradeController = require('../controllers/gradeController');

const router = express.Router();

// GET all grades
router.get('/', gradeController.getAllGrades);

// GET a specific grade by ID
router.get('/:id', gradeController.getGradeById);

// POST a new grade
router.post('/', gradeController.createGrade);

// PUT (update) a grade
router.put('/:id', gradeController.updateGrade);

// DELETE a grade
router.delete('/:id', gradeController.deleteGrade);

module.exports = router;

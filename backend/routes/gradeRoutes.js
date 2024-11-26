// routes/gradeRoutes.js
const express = require('express');
const gradeController = require('../controllers/gradeController');

const router = express.Router();

//GET grade by course id and student id
router.get('/:student_id/:course_id', gradeController.searchGrade)

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

//Assign grades
router.post('/assign_grades', gradeController.assignGrade);



module.exports = router;

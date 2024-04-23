// routes/subjectRoutes.js
const express = require('express');
const subjectController = require('../controllers/subjectController');

const router = express.Router();

// GET all subjects
router.get('/', subjectController.getAllSubjects);

// GET a specific subject by ID
router.get('/:id', subjectController.getSubjectById);

// POST a new subject
router.post('/', subjectController.createSubject);

// PUT i.e. update/create subject
router.put('/:id', subjectController.updateSubject);

// DELETE a subject
router.delete('/:id', subjectController.deleteSubject);

module.exports = router;

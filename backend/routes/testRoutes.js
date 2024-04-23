// routes/testRoutes.js
const express = require('express');
const testController = require('../controllers/testController');

const router = express.Router();

// GET all tests
router.get('/', testController.getAllTests);

// GET a specific test by ID
router.get('/:id', testController.getTestById);

// POST a new test
router.post('/', testController.createTest);

// PUT (update) a test
router.put('/:id', testController.updateTest);

// DELETE a test
router.delete('/:id', testController.deleteTest);

module.exports = router;

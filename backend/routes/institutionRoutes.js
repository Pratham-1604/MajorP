// routes/institutionRoutes.js
const express = require('express');
const institutionController = require('../controllers/institutionController');

const router = express.Router();

// GET all institutions
router.get('/', institutionController.getAllInstitutions);

// GET a specific institution by ID
router.get('/:id', institutionController.getInstitutionById);

// POST a new institution
router.post('/', institutionController.createInstitution);

//POST for institution login
router.post('/login', institutionController.institutionLogin);

// PUT (update) an institution
router.put('/:id', institutionController.updateInstitution);

// DELETE an institution
router.delete('/:id', institutionController.deleteInstitution);

module.exports = router;

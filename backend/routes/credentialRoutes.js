// routes/credentialRoutes.js
const express = require('express');
const credentialController = require('../controllers/credentialController');

const router = express.Router();

// GET all credentials
router.get('/', credentialController.getAllCredentials);

// GET a specific credential by ID
router.get('/:id', credentialController.getCredentialById);

// POST a new credential
router.post('/', credentialController.createCredential);

// PUT (update) a credential
router.put('/:id', credentialController.updateCredential);

// DELETE a credential
router.delete('/:id', credentialController.deleteCredential);

module.exports = router;

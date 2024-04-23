// controllers/credentialController.js
const Credential = require('../models/credentialModel');

// GET all credentials
exports.getAllCredentials = async (req, res, next) => {
  try {
    const credentials = await Credential.find();
    res.json(credentials);
  } catch (err) {
    next(err);
  }
};

// GET a specific credential by ID
exports.getCredentialById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const credential = await Credential.findById(id);
    if (!credential) {
      return res.status(404).json({ error: 'Credential not found' });
    }
    res.json(credential);
  } catch (err) {
    next(err);
  }
};

// POST a new credential
exports.createCredential = async (req, res, next) => {
  try {
    const credential = new Credential(req.body);
    await credential.save();
    res.status(201).json(credential);
  } catch (err) {
    next(err);
  }
};

// PUT (update) a credential
exports.updateCredential = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedCredential = await Credential.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedCredential) {
      return res.status(404).json({ error: 'Credential not found' });
    }
    res.json(updatedCredential);
  } catch (err) {
    next(err);
  }
};

// DELETE a credential
exports.deleteCredential = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedCredential = await Credential.findByIdAndDelete(id);
    if (!deletedCredential) {
      return res.status(404).json({ error: 'Credential not found' });
    }
    res.json({ message: 'Credential deleted successfully' });
  } catch (err) {
    next(err);
  }
};

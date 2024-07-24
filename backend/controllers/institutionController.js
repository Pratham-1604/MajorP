// controllers/institutionController.js
const Institution = require('../models/institutionModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { JWT_SECRET } = require('../config/environment');
// GET all institutions
exports.getAllInstitutions = async (req, res, next) => {
  try {
    const institutions = await Institution.find();
    res.json(institutions);
  } catch (err) {
    next(err);
  }
};

// GET a specific institution by ID
exports.getInstitutionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const institution = await Institution.findById(id);
    if (!institution) {
      return res.status(404).json({ error: 'Institution not found' });
    }
    res.json(institution);
  } catch (err) {
    next(err);
  }
};

// POST a new institution
exports.createInstitution = async (req, res, next) => {
  try {
    const institution = new Institution(req.body);
    const hashedPassword = await bcrypt.hash(institution.password, +JWT_SECRET);
    institution.password = hashedPassword;
    console.log(institution);
    console.log(institution.password);
    await institution.save();
    res.status(201).json(institution);
  } catch (err) {
    next(err);
  }
};

// PUT (update) an institution
exports.updateInstitution = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedInstitution = await Institution.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedInstitution) {
      return res.status(404).json({ error: 'Institution not found' });
    }
    res.json(updatedInstitution);
  } catch (err) {
    next(err);
  }
};

// DELETE an institution
exports.deleteInstitution = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedInstitution = await Institution.findByIdAndDelete(id);
    if (!deletedInstitution) {
      return res.status(404).json({ error: 'Institution not found' });
    }
    res.json({ message: 'Institution deleted successfully' });
  } catch (err) {
    next(err);
  }
};

//POST for login
exports.institutionLogin = async (req, res, next) => {
  try {
    console.log(req.body)
    const { institution_name, password } = req.body;

    // Find the institution by name
    const institution = await Institution.findOne({ institution_name });
    if (!institution) {
      return res.status(404).json({ message: 'Institution not found' });
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, institution.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { institutionId: institution._id, institution_name: institution.institution_name },
      JWT_SECRET, // Ensure you have this environment variable set
      { expiresIn: '1h' } // Token expiration time
    );

    // Send response with token
    res.json({ token, institution: { id: institution._id, name: institution.institution_name } });
  } catch (err) {
    next(err);
  }
};
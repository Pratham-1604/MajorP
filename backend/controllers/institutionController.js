// controllers/institutionController.js
const Institution = require('../models/institutionModel');

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

// controllers/testController.js
const Test = require('../models/testModel');

// GET all tests
exports.getAllTests = async (req, res, next) => {
  try {
    const tests = await Test.find();
    res.json(tests);
  } catch (err) {
    next(err);
  }
};

// GET a specific test by ID
exports.getTestById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const test = await Test.findById(id);
    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }
    res.json(test);
  } catch (err) {
    next(err);
  }
};

// POST a new test
exports.createTest = async (req, res, next) => {
  try {
    // Create a new test instance
    const test = new Test(req.body);
    // Save the test to the database
    await test.save();
    
    // Once the test is saved, find the corresponding course and update its tests list
    const course = await Course.findById(test.course_id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    // Add the new test to the course's tests list
    course.tests.push(test._id);
    // Save the updated course
    await course.save();
    
    // Respond with the created test
    res.status(201).json(test);
  } catch (err) {
    next(err);
  }
};

// PUT (update) a test
exports.updateTest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedTest = await Test.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedTest) {
      return res.status(404).json({ error: 'Test not found' });
    }
    res.json(updatedTest);
  } catch (err) {
    next(err);
  }
};

// DELETE a test
exports.deleteTest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedTest = await Test.findByIdAndDelete(id);
    if (!deletedTest) {
      return res.status(404).json({ error: 'Test not found' });
    }
    res.json({ message: 'Test deleted successfully' });
  } catch (err) {
    next(err);
  }
};

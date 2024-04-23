// scripts/updateTestTotalMarks.js
require('dotenv').config();
const mongoose = require('mongoose');
const Test = require('../models/testModel');

mongoose.connect(process.env.MONGODB_URI, {});

mongoose.connection.once('open', async () => {
  try {
    // Find all tests
    const tests = await Test.find();
    // Update each test to set total_marks to 100
    for (const test of tests) {
      test.total_marks = 100;
      // Save updated test
      await test.save();
      console.log(`Updated test ${test._id}`);
    }
    console.log('All tests updated successfully');
  } catch (error) {
    console.error('Error updating tests:', error);
  } finally {
    // Close the connection
    mongoose.connection.close();
  }
});

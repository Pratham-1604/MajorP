require('dotenv').config();
const mongoose = require('mongoose');
const Test = require('../models/testModel');
const Course = require('../models/courseModel');

mongoose.connect(process.env.MONGODB_URI, {});

mongoose.connection.once('open', async () => {
  try {
    // Find all tests
    const tests = await Test.find();
    
    // Update each test and add it to its corresponding course
    for (const test of tests) {
      // Find the corresponding course
      const course = await Course.findById(test.course_id);
      if (!course) {
        console.log(`Course not found for test ${test._id}`);
        continue; // Skip if course not found
      }
      
      // Add the test to the course's tests array
      course.tests.push(test._id);
      // Save the updated course
      await course.save();
      
      console.log(`Test ${test._id} added to course ${course._id}`);
    }
    
    console.log('All tests updated successfully');
  } catch (error) {
    console.error('Error updating tests:', error);
  } finally {
    // Close the connection
    mongoose.connection.close();
  }
});

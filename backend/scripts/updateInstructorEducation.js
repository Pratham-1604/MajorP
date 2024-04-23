// scripts/updateInstructorEducation.js
require('dotenv').config();
const mongoose = require('mongoose');
const Instructor = require('../models/instructorModel');

mongoose.connect(process.env.MONGODB_URI, {});

mongoose.connection.once('open', async () => {
  try {
    // Find all instructors
    const instructors = await Instructor.find();
    // Update each instructor to include education
    for (const instructor of instructors) {
        instructor.education = ["Masters in Computer Science", "Bachelors in Computer Science"]; // Initialize education array
        // Save updated instructor
        await instructor.save();
        console.log(`Updated instructor ${instructor._id}`);
    }
    console.log('All instructors updated successfully');
  } catch (error) {
    console.error('Error updating instructors:', error);
  } finally {
    // Close the connection
    mongoose.connection.close();
  }
});

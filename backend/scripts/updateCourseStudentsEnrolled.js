// Import dotenv to load environment variables from .env file
require('dotenv').config();

// Import necessary modules and models
const mongoose = require('mongoose');
const Course = require('../models/courseModel');
const Student = require('../models/studentModel');

// Connect to the MongoDB database using the environment variable
mongoose.connect(process.env.MONGODB_URI, {});

// Function to update students_enrolled for a course
const updateCourseStudentsEnrolled = async () => {
  try {
    // Retrieve all courses from the database
    const courses = await Course.find();

    // Iterate through each course
    for (const course of courses) {
      // Count the number of students enrolled in this course
      const studentsEnrolled = await Student.countDocuments({ courses_enrolled: course._id });

      // Update the students_enrolled field for the course
      await Course.findByIdAndUpdate(course._id, { students_enrolled: studentsEnrolled });
    }

    console.log('Courses updated successfully.');
  } catch (error) {
    console.error('Error updating courses:', error.message);
  } finally {
    // Close the database connection
    mongoose.disconnect();
  }
};

// Call the function to update course information
updateCourseStudentsEnrolled();

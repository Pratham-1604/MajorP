const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Student = require('../models/studentModel');

(async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb+srv://dhirajmuppineti486:HlkvwJhB8VkMjL76@applications.eaxfxvs.mongodb.net/CMS", {});

    // Fetch all students
    const allStudents = await Student.find();

    if (allStudents.length === 0) {
      console.log('No students found.');
      return;
    }

    // Update each student
    for (const student of allStudents) {
      // Validate and sanitize courses_enrolled and credentials_earned
      student.courses_enrolled = Array.isArray(student.courses_enrolled)
        ? student.courses_enrolled.filter(id => mongoose.Types.ObjectId.isValid(id))
        : [];
      student.credentials_earned = Array.isArray(student.credentials_earned)
        ? student.credentials_earned.filter(id => mongoose.Types.ObjectId.isValid(id))
        : [];

      if (!student.password) { // Only update students without a password field
        const newPassword = `${student.student_firstname.toLowerCase()}@123`;
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        student.password = hashedPassword;
      }

      await student.save();
      console.log(`Student updated: ${student.uid}`);
    }

    console.log('Password addition and student updates completed for all students.');
  } catch (error) {
    console.error('Error processing students:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.disconnect();
    process.exit(0); // Ensure the script exits
  }
})();

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Institution = require('../models/institutionModel'); // Adjust the path as needed
const connectDB = require('../config/database'); // Import the database connection function

const hashPasswords = async () => {
  try {
    await connectDB(); // Connect to the database

    const institutions = await Institution.find();

    for (const institution of institutions) {
      if (institution.password) {
        const hashedPassword = await bcrypt.hash(institution.password, 10);
        institution.password = hashedPassword;
        await institution.save();
        console.log(`Password for institution ${institution.institution_name} hashed successfully.`);
      }
    }

    console.log('All passwords hashed successfully.');
    mongoose.disconnect();
  } catch (err) {
    console.error('Error hashing passwords:', err);
    mongoose.disconnect();
  }
};

hashPasswords();
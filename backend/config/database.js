const mongoose = require('mongoose');
const { MONGODB_URI } = require('./environment');

mongoose.set('debug', true);

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

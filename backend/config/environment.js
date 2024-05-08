// Your environment-specific configuration (e.g., environment variables) goes here
require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 3001,
  MONGODB_URI:
    process.env.MONGODB_URI || "mongodb://localhost:27017/mydatabase",
};

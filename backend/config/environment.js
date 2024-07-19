// Your environment-specific configuration (e.g., environment variables) goes here
require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 3001,
  MONGODB_URI:
    process.env.MONGODB_URI || "mongodb+srv://dhirajmuppineti486:HlkvwJhB8VkMjL76@applications.eaxfxvs.mongodb.net/CMS",
  JWT_SECRET: process.env.JWT_SECRET || "10",
};

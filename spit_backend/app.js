const express = require("express");
const mongoose = require("mongoose");
const studentRoutes = require("./routes/studentRoutes");
const cors = require("cors");
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

let s = "mongodb+srv://admin:admin@majorp.wxqvq.mongodb.net/";

// Database Connection
mongoose
  .connect(s, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

// Routes
app.use("/api/students", studentRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

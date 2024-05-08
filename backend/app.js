const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/database');
const cors = require('cors');

const courseRoutes = require('./routes/courseRoutes');
const studentRoutes = require('./routes/studentRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const institutionRoutes = require('./routes/institutionRoutes');
const testRoutes = require('./routes/testRoutes');
const gradeRoutes = require('./routes/gradeRoutes');
const credentialRoutes = require('./routes/credentialRoutes');
const instructorRoutes = require('./routes/instructorRoutes');

const errorMiddleware = require('./middleware/errorMiddleware');
const { PORT } = require('./config/environment');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to the database
connectDB();

// Routes
app.use('/courses', courseRoutes);
app.use('/students', studentRoutes);
app.use('/subjects', subjectRoutes);
app.use('/institutions', institutionRoutes);
app.use('/tests', testRoutes);
app.use('/grades', gradeRoutes);
app.use('/credentials', credentialRoutes);
app.use('/instructors', instructorRoutes);

// Error handling middleware
app.use(errorMiddleware);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

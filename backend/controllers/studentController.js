//controllers/studentController.js
const Student = require('../models/studentModel');

// GET all students
exports.getAllStudents = async (req, res, next) => {
  try {
    const students = await Student.find().populate('courses_enrolled institution');
    res.json(students);
  } catch (err) {
    next(err);
  }
};

// GET a specific student by ID
exports.getStudentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id).populate('courses_enrolled institution');
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(student);
  } catch (err) {
    next(err);
  }
};

// POST a new student
exports.createStudent = async (req, res, next) => {
  try {
    const student = new Student(req.body);
    await student.save();
    const course = await Course.findById(student.course_id);
    if (course) {
      course.students_enrolled = (course.students_enrolled || 0) + 1;
      await course.save();
    }
    res.status(201).json(student);
  } catch (err) {
    next(err);
  }
};


// PUT (update) a student
exports.updateStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedStudent = await Student.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(updatedStudent);
  } catch (err) {
    next(err);
  }
};

// DELETE a student
exports.deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedStudent = await Student.findByIdAndDelete(id);
    if (!deletedStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    next(err);
  }
};

//POST for login
exports.studentLogin = async (req, res, next) => {
  try {
    console.log(req.body)
    const { student_name, password } = req.body;

    // Find the institution by name
    const student = await Student.findOne({ student_name });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { studentId: student._id, student_name: student_name },
      JWT_SECRET, // Ensure you have this environment variable set
      { expiresIn: '1h' } // Token expiration time
    );

    // Send response with token
    res.json({ token, student: { id: student._id, name: student_name} });
  } catch (err) {
    next(err);
  }
};
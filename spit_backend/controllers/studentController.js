const Student = require("../models/Student");
const { coursesData } = require("../courseData");

exports.createStudent = async (req, res) => {
  try {
    const { email, batch, eligibleCourses } = req.body;

    // Validate required fields
    if (!email || !batch || !eligibleCourses) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    // Check if email already exists
    const existingStudent = await Student.findOne({
      "generalDetails.email": email,
    });

    if (existingStudent) {
      return res.status(400).json({
        message: "Student with this email already exists",
      });
    }

    // Create new student
    const newStudent = new Student({
      generalDetails: {
        email,
      },
      academicDetails: {
        batch: {
          startYear: batch.startYear,
          endYear: batch.endYear,
        },
        eligibleCourses: eligibleCourses,
      },
    });

    // Save student
    await newStudent.save();

    res.status(201).json({
      message: "Student created successfully",
      student: {
        uid: newStudent.uid,
        email: newStudent.generalDetails.email,
        batch: newStudent.academicDetails.batch,
      },
    });
  } catch (error) {
    console.error("Student creation error:", error);
    res.status(500).json({
      message: "Error creating student",
      error: error.message,
    });
  }
};

// Get total number of students
exports.getTotalStudentsCount = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();

    res.status(200).json({
      message: "Total students count retrieved successfully",
      count: totalStudents,
    });
  } catch (error) {
    console.error("Error retrieving students count:", error);
    res.status(500).json({
      message: "Error retrieving students count",
      error: error.message,
    });
  }
};

// Get student details by UID
exports.getStudentByUid = async (req, res) => {
  try {
    const { uid } = req.params;

    // Validate UID
    if (!uid) {
      return res.status(400).json({
        message: "UID is required",
      });
    }

    // Find student by UID
    const student = await Student.findOne({ uid: uid }).select("-__v");

    // Check if student exists
    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.status(200).json({
      message: "Student details retrieved successfully",
      student: {
        uid: student.uid,
        generalDetails: student.generalDetails,
        academicDetails: student.academicDetails,
        subjectDetails: student.subjectDetails,
      },
    });
  } catch (error) {
    console.error("Error retrieving student details:", error);
    res.status(500).json({
      message: "Error retrieving student details",
      error: error.message,
    });
  }
};

exports.studentLogin = async (req, res) => {
  try {
    const { uid } = req.body;

    // Validate UID input
    if (!uid) {
      return res.status(400).json({
        message: "UID is required for login",
      });
    }

    // Find student by UID
    const student = await Student.findOne({ uid: uid }).select("-__v");

    // Check if student exists
    if (!student) {
      return res.status(404).json({
        message: "Student not found",
        isAuthenticated: false,
      });
    }

    // Check if student profile is complete
    const isProfileComplete = !!(
      student.generalDetails.firstName &&
      student.generalDetails.lastName &&
      student.generalDetails.contactNumber &&
      student.academicDetails.courseEnrolled
    );

    res.status(200).json({
      message: "Student login successful",
      isAuthenticated: true,
      isProfileComplete: isProfileComplete,
      student: {
        uid: student.uid,
        email: student.generalDetails.email,
        currentSemester: student.academicDetails.currentSemester,
        eligibleCourses: student.academicDetails.eligibleCourses,
      },
    });
  } catch (error) {
    console.error("Student login error:", error);
    res.status(500).json({
      message: "Error during student login",
      error: error.message,
    });
  }
};

const addSubjectsForSemester = (student, courseEnrolled, semester) => {
  const semesterSubjects =
    coursesData[courseEnrolled].semesters.find(
      (sem) => sem.semester === semester
    )?.subjects || [];

  // Create subject entries
  const newSubjects = semesterSubjects.map((subjectName) => ({
    subjectCode: `${courseEnrolled}-${semester}-${subjectName.replace(
      /\s+/g,
      ""
    )}`,
    subjectName: subjectName,
    credits: 4,
    grade: null,
    semester: semester,
  }));

  // Add new subjects to student's subject details
  student.subjectDetails.push(...newSubjects);

  return newSubjects;
};
// Update Student Profile
exports.updateStudentProfile = async (req, res) => {
  try {
    const { uid } = req.params;
    const { firstName, lastName, contactNumber, dateOfBirth, courseEnrolled } =
      req.body;

    // Validate required fields
    if (!uid) {
      return res.status(400).json({
        message: "UID is required",
      });
    }

    // Find student by UID
    const student = await Student.findOne({ uid: uid });

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    // Update general details
    student.generalDetails.firstName = firstName;
    student.generalDetails.lastName = lastName;
    student.generalDetails.contactNumber = contactNumber;
    student.generalDetails.dateOfBirth = dateOfBirth;

    // Update academic details
    if (student.academicDetails.eligibleCourses.includes(courseEnrolled)) {
      student.academicDetails.courseEnrolled = courseEnrolled;

      // Clear existing subject details
      student.subjectDetails = [];

      // Add first semester subjects
      const addedSubjects = addSubjectsForSemester(student, courseEnrolled, 1);

      // Set current semester to 1
      student.academicDetails.currentSemester = 1;
    } else {
      return res.status(400).json({
        message: "Selected course is not in eligible courses",
        eligibleCourses: student.academicDetails.eligibleCourses,
      });
    }

    // Save updated student
    await student.save();

    res.status(200).json({
      message: "Student profile updated successfully",
      student: {
        uid: student.uid,
        generalDetails: student.generalDetails,
        academicDetails: student.academicDetails,
        subjectDetails: student.subjectDetails,
      },
    });
  } catch (error) {
    console.error("Student profile update error:", error);
    res.status(500).json({
      message: "Error updating student profile",
      error: error.message,
    });
  }
};

exports.assignStudentGrades = async (req, res) => {
  try {
    const { uid } = req.params;
    const { grades } = req.body;

    // Find student by UID
    const student = await Student.findOne({ uid: uid });

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    // Validate grades
    if (!Array.isArray(grades)) {
      return res.status(400).json({
        message: "Invalid grades format",
      });
    }

    // Update grades for specified subjects
    grades.forEach((gradeEntry) => {
      const subjectIndex = student.subjectDetails.findIndex(
        (subject) => subject.subjectCode === gradeEntry.subjectCode
      );

      if (subjectIndex !== -1) {
        student.subjectDetails[subjectIndex].grade = gradeEntry.grade;
      }
    });

    // Recalculate CGPA
    student.academicDetails.cgpa = student.calculateCGPA();

    // Save updated student
    await student.save();

    res.status(200).json({
      message: "Grades assigned successfully",
      cgpa: student.academicDetails.cgpa,
    });
  } catch (error) {
    console.error("Error assigning grades:", error);
    res.status(500).json({
      message: "Error assigning grades",
      error: error.message,
    });
  }
};

// Route to increment student semester
exports.incrementStudentSemester = async (req, res) => {
  try {
    const { uid } = req.params;

    // Find student by UID
    const student = await Student.findOne({ uid: uid });

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    // Check if all subjects for current semester have grades
    const currentSemesterSubjects = student.subjectDetails.filter(
      (subject) => subject.semester === student.academicDetails.currentSemester
    );

    const allSubjectsGraded = currentSemesterSubjects.every(
      (subject) => subject.grade !== null
    );

    if (!allSubjectsGraded) {
      return res.status(400).json({
        message: "Cannot increment semester. Not all subjects are graded.",
        ungraduatedSubjects: currentSemesterSubjects.filter(
          (subject) => subject.grade === null
        ),
      });
    }

    // Attempt to increment semester
    if (student.academicDetails.currentSemester >= 8) {
      return res.status(400).json({
        message: "Maximum semester reached",
      });
    }

    // Increment semester
    const nextSemester = student.academicDetails.currentSemester + 1;
    student.academicDetails.currentSemester = nextSemester;

    // Add new semester subjects
    const addedSubjects = addSubjectsForSemester(
      student,
      student.academicDetails.courseEnrolled,
      nextSemester
    );

    // Save updated student
    await student.save();

    res.status(200).json({
      message: "Semester incremented successfully",
      currentSemester: student.academicDetails.currentSemester,
      newSubjects: addedSubjects,
    });
  } catch (error) {
    console.error("Error incrementing semester:", error);
    res.status(500).json({
      message: "Error incrementing semester",
      error: error.message,
    });
  }
};

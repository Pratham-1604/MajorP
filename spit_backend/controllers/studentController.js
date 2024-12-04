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

exports.assignSingleSubjectGrade = async (req, res) => {
  try {
    const { email, subjectCode, grade } = req.body;
    console.log(email, subjectCode, grade);
    // Validate input
    if (!subjectCode || grade === undefined) {
      return res.status(400).json({
        message: "Subject code and grade are required",
      });
    }

    // Find student by UID
    const student = await Student.findOne({ "generalDetails.email": email });

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    // Find the subject in student's subject details
    const subjectIndex = student.subjectDetails.findIndex(
      (subject) => subject.subjectCode === subjectCode
    );

    if (subjectIndex === -1) {
      return res.status(404).json({
        message: "Subject not found for this student",
      });
    }

    // Update grade for the specific subject
    student.subjectDetails[subjectIndex].grade = grade;

    // Recalculate CGPA
    student.academicDetails.cgpa = student.calculateCGPA();

    // Save updated student
    await student.save();

    res.status(200).json({
      message: "Subject grade assigned successfully",
      subject: {
        subjectCode: subjectCode,
        grade: grade,
        newCGPA: student.academicDetails.cgpa,
      },
    });
  } catch (error) {
    console.error("Error assigning subject grade:", error);
    res.status(500).json({
      message: "Error assigning subject grade",
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
    await student.save();
    res.status(200).json({
      message: "Semester incremented successfully",
      currentSemester: student.academicDetails.currentSemester,
    });
  } catch (error) {
    console.error("Error incrementing semester:", error);
    res.status(500).json({
      message: "Error incrementing semester",
      error: error.message,
    });
  }
};

// Get available elective subjects for a student
exports.getAvailableElectiveSubjects = async (req, res) => {
  try {
    const { uid } = req.params;

    // Find student by UID
    const student = await Student.findOne({ uid: uid });

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    // Get course-specific elective subjects
    const courseElectives =
      coursesData[student.academicDetails.courseEnrolled].electiveSubjects ||
      [];

    // Filter out subjects already completed
    const completedSubjectCodes = student.subjectDetails
      .filter((subject) => subject.grade !== null)
      .map((subject) => subject.subjectCode);

    const availableElectives = courseElectives.filter((elective) => {
      // Check if subject is not already completed
      const isNotCompleted = !completedSubjectCodes.includes(
        elective.subjectCode
      );

      // Check prerequisites (if any)
      const prereqsMet =
        !elective.prerequisites ||
        elective.prerequisites.every((prereq) =>
          student.subjectDetails.some(
            (subject) =>
              subject.subjectName === prereq && subject.grade !== null
          )
        );

      return isNotCompleted && prereqsMet;
    });

    res.status(200).json({
      message: "Available elective subjects retrieved successfully",
      electiveSubjects: availableElectives,
    });
  } catch (error) {
    console.error("Error retrieving elective subjects:", error);
    res.status(500).json({
      message: "Error retrieving elective subjects",
      error: error.message,
    });
  }
};

// Add subjects for next semester
exports.addSubjectsForSemester = async (req, res) => {
  try {
    const { uid } = req.params;
    const { compulsorySubjects, electiveSubjects } = req.body;

    // Find student by UID
    const student = await Student.findOne({ uid: uid });

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    // Get course and current semester
    const course = student.academicDetails.courseEnrolled;
    const nextSemester = student.academicDetails.currentSemester;

    // Create core subject entries (mandatory)
    const coreSubjects = compulsorySubjects.map((subject) => ({
      subjectCode: `${course}-${nextSemester}-${subject.subjectName.replace(
        /\s+/g,
        ""
      )}`,
      subjectName: subject.subjectName,
      credits: subject.credits,
      grade: null,
      semester: nextSemester,
      type: "core",
    }));

    // Create elective subject entries
    const electiveSubjectEntries = electiveSubjects.map((elective) => ({
      subjectCode: elective.subjectCode,
      subjectName: elective.subjectName,
      credits: elective.credits,
      grade: null,
      semester: nextSemester,
      type: "elective",
    }));

    // Validate total credits
    const totalCredits =
      coreSubjects.reduce((sum, subject) => sum + subject.credits, 0) +
      electiveSubjectEntries.reduce((sum, subject) => sum + subject.credits, 0);

    if (totalCredits < 15 || totalCredits > 25) {
      return res.status(400).json({
        message: "Total credits must be between 15 and 25",
        currentCredits: totalCredits,
      });
    }

    // Combine and add subjects
    const newSubjects = [...coreSubjects, ...electiveSubjectEntries];

    // Remove existing subjects for this semester
    student.subjectDetails = student.subjectDetails.filter(
      (subject) => subject.semester !== nextSemester
    );

    // Add new subjects
    student.subjectDetails.push(...newSubjects);

    // Save student
    await student.save();

    res.status(200).json({
      message: "Subjects added successfully",
      addedSubjects: newSubjects,
      totalCredits: totalCredits,
    });
  } catch (error) {
    console.error("Error adding subjects:", error);
    res.status(500).json({
      message: "Error adding subjects",
      error: error.message,
    });
  }
};

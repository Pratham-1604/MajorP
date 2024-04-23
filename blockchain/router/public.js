const router = require("express").Router();

const {
  addCourse,
  createStudent,
  enrollStudent,
  issueCredits,
  getCourseDetails,
  getNumberOfStudentsEnrolled,
  getStudentDetails,
  getTotalStudents,
  getAllStudentDetails,
  addCollege,
  getNumberOfCoursesByCollege,
  getCollegeDetails,
  getNumberOfColleges,
  getStudentGrades,
} = require("../controllers/public_controller");

// Routes
router.post("/addCourse", addCourse);
router.get("/courseDetails/:courseId", getCourseDetails);
router.get("/numberOfStudentsEnrolled/:courseId", getNumberOfStudentsEnrolled);

router.post("/createStudent", createStudent);
router.post("/enrollStudent", enrollStudent);
router.get("/studentDetails/:studentId", getStudentDetails);
router.get("/getStudentGrades/:studentId", getStudentGrades);
router.get("/totalStudents", getTotalStudents);
router.get("/allStudentDetails", getAllStudentDetails);

router.post("/addCollege", addCollege);
router.post("/issueCredits", issueCredits);
router.get("/getNumberOfColleges", getNumberOfColleges);
router.get("/getCollegeDetails/:collegeId", getCollegeDetails);
router.get("/numberOfCoursesByCollege/:collegeId", getNumberOfCoursesByCollege);

module.exports = router;

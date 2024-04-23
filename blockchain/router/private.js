const router = require("express").Router();

const {
  createStudent,
  issueCredits,
  getStudentDetails,
  getGrades,
  getCurrentSemester,
  getTotalStudents,
} = require("../controllers/private_controller");

// Routes
router.post("/createStudent", createStudent);
router.post("/issueCredits", issueCredits);
router.get("/studentDetails/:studentId", getStudentDetails);
router.get("/getGrades/:studentId", getGrades);
router.get("/getCurrentSemester/:studentId", getCurrentSemester);
router.get("/totalStudents", getTotalStudents);

module.exports = router;

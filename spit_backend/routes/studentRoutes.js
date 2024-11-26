const express = require("express");
const router = express.Router();
const {
  createStudent,
  getTotalStudentsCount,
  getStudentByUid,
  studentLogin,
  updateStudentProfile,
  assignStudentGrades,
  incrementStudentSemester,
  getAvailableElectiveSubjects,
  addSubjectsForSemester,
} = require("../controllers/studentController");

// Existing routes
router.post("/create", createStudent);
router.get("/count", getTotalStudentsCount);
router.get("/:uid", getStudentByUid);

// New routes for login and profile update
router.post("/login", studentLogin);
router.put("/:uid/update", updateStudentProfile);

router.post("/:uid/assign-grades", assignStudentGrades);
router.post("/:uid/increment-semester", incrementStudentSemester);
router.get("/:uid/available-electives", getAvailableElectiveSubjects);
router.post("/:uid/add-semester-subjects", addSubjectsForSemester);

module.exports = router;

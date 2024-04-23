const ethers = require("ethers");
require("dotenv").config();

const {
  abi,
} = require("../artifacts/contracts/PublicBlockchain.sol/PublicBlockchain.json");
const contractAddress = process.env.PUBLIC_BLOCKCHAIN_ADDRESS;

const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");
const privateKey = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);
const contract = new ethers.Contract(contractAddress, abi, wallet);

async function addCourse(req, res) {
  const { collegeUid, name, credits } = req.body;
  try {
    const tx = await contract.addCourse(collegeUid, name, credits);
    const receipt = await tx.wait();
    console.log(receipt.events[0].args);
    res.status(200).json({
      txHash: receipt.transactionHash,
      courseId: receipt.events[0].args.courseUid.toString(),
    });
  } catch (error) {
    console.error("Error adding course:", error);
    res.status(500).json({ error: error.message });
  }
}

async function createStudent(req, res) {
  const { name } = req.body;
  try {
    const tx = await contract.createStudent(name);
    const receipt = await tx.wait();
    console.log(receipt.events);
    const studentId = receipt.events[0].args.studentId;
    res.status(200).json({
      message: "Student created successfully",
      studentId: studentId.toString(),
    });
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(500).json({ error: error.message });
  }
}

async function enrollStudent(req, res) {
  const { studentId, courseId } = req.body;
  try {
    await contract.enrollStudent(studentId, courseId);
    res.status(200).json({ message: "Student enrolled successfully" });
  } catch (error) {
    console.error("Error enrolling student:", error);
    res.status(500).json({ error: error.message });
  }
}

async function issueCredits(req, res) {
  const { studentId, courseName, grades } = req.body;
  try {
    await contract.issueCredits(studentId, courseName, grades);
    res.status(200).json({ message: "Credits issued successfully" });
  } catch (error) {
    console.error("Error issuing credits:", error);
    res.status(500).json({ error: error.message });
  }
}

async function getCourseDetails(req, res) {
  const courseId = req.params.courseId;
  try {
    const details = await contract.getCourseDetails(courseId);
    res.status(200).json({ details });
  } catch (error) {
    console.error("Error getting course details:", error);
    res.status(500).json({ error: error.message });
  }
}

async function getNumberOfStudentsEnrolled(req, res) {
  const courseId = req.params.courseId;
  try {
    const count = await contract.getNumberOfStudentsEnrolled(courseId);
    res.status(200).json({ count: count.toString() });
  } catch (error) {
    console.error("Error getting number of students enrolled:", error);
    res.status(500).json({ error: error.message });
  }
}

async function getStudentDetails(req, res) {
  const studentId = req.params.studentId;
  try {
    const details = await contract.getStudentDetails(studentId);
    res.status(200).json({ details });
  } catch (error) {
    console.error("Error getting student details:", error);
    res.status(500).json({ error: error.message });
  }
}

async function getTotalStudents(req, res) {
  try {
    const count = await contract.getTotalStudents();
    res.status(200).json({ count: count.toString() });
  } catch (error) {
    console.error("Error getting total number of students:", error);
    res.status(500).json({ error: error.message });
  }
}

async function getAllStudentDetails(req, res) {
  try {
    const details = await contract.getAllStudentDetails();
    res.status(200).json({ details });
  } catch (error) {
    console.error("Error getting all student details:", error);
    res.status(500).json({ error: error.message });
  }
}

async function addCollege(req, res) {
  const { name } = req.body;
  try {
    const tx = await contract.addCollege(name);
    const receipt = await tx.wait();
    console.log(receipt.events);
    const collegeUid = receipt.events[0].args.collegeUid;
    res.status(200).json({
      txHash: receipt.transactionHash,
      collegeId: collegeUid.toString(),
    });
  } catch (error) {
    console.error("Error adding college:", error);
    res.status(500).json({ error: error.message });
  }
}

async function getCollegeDetails(req, res) {
  const collegeId = req.params.collegeId;
  try {
    const details = await contract.getCollegeDetails(collegeId);
    console.log(details);
    res.status(200).json({ details });
  } catch (error) {
    console.error("Error getting college details:", error);
    res.status(500).json({ error: error.message });
  }
}

async function getNumberOfCoursesByCollege(req, res) {
  const collegeId = req.params.collegeId;
  try {
    const count = await contract.getNumberOfCoursesByCollege(collegeId);
    res.status(200).json({ count: count.toString() });
  } catch (error) {
    console.error("Error getting number of courses offered by college:", error);
    res.status(500).json({ error: error.message });
  }
}

async function getNumberOfColleges(req, res) {
  try {
    const count = await contract.getNumberOfColleges();
    res.status(200).json({ count: count.toString() });
  } catch (error) {
    console.error("Error getting number of courses offered by college:", error);
    res.status(500).json({ error: error.message });
  }
}

async function getStudentGrades(req, res) {
  const studentId = req.params.studentId;
  try {
    const [courseNames, grades] = await contract.getStudentGrades(studentId);
    // Map course names to grades
    const gradesWithNames = {};
    for (let i = 0; i < courseNames.length; i++) {
      // Convert BigNumber to decimal value
      const gradeDecimal = grades[i].toNumber();
      gradesWithNames[courseNames[i]] = gradeDecimal;
    }
    res.status(200).json({ grades: gradesWithNames });
  } catch (error) {
    console.error("Error getting student grades:", error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
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
  getCollegeDetails,
  getNumberOfCoursesByCollege,
  getNumberOfColleges,
  getStudentGrades,
};

const ethers = require("ethers");
require("dotenv").config();

const {
  abi,
} = require("../artifacts/contracts/CollegeBlockchain.sol/CollegeBlockchain.json");
const contractAddress = process.env.PRIVATE_BLOCKCHAIN_ADDRESS;

const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");
const privateKey = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);
const contract = new ethers.Contract(contractAddress, abi, wallet);

async function createStudent(req, res) {
  const { name } = req.body;
  try {
    const tx = await contract.createStudent(name);
    const receipt = await tx.wait();
    // console.log(receipt.events[0].args);
    res.status(200).json({
      studentId: receipt.events[0].args.studentId.toString(),
    });
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(500).json({ error: error.message });
  }
}

async function issueCredits(req, res) {
  const { studentId, subject, grade } = req.body;
  try {
    const tx = await contract.issueCredits(studentId, subject, grade);
    const receipt = await tx.wait();
    // console.log(receipt.events[0].args);
    res.status(200).json({
      semester: receipt.events[0].args.semester.toNumber(),
      subject: receipt.events[0].args.subject.toString(),
    });
  } catch (error) {
    console.error("Error issuing credits:", error);
    res.status(500).json({ error: error.message });
  }
}

async function getStudentDetails(req, res) {
  const { studentId } = req.params;
  try {
    const details = await contract.getStudentDetails(studentId);
    console.log(details);
    res.status(200).json({
      name: details[0],
      semester: details[1].toNumber(),
      subjectIndex: details[2].toNumber(),
    });
  } catch (error) {
    console.error("Error getting student details:", error);
    res.status(500).json({ error: error.message });
  }
}

async function getGrades(req, res) {
  const { studentId } = req.params;
  try {
    const [grades, subjects] = await contract.getGrades(studentId); // Note the order of elements in the response

    // Convert BigNumber grades to numbers
    const numericGrades = grades.map((a) => a.toNumber());

    console.log("Subjects:", subjects);
    console.log("Grades:", numericGrades);

    res.status(200).json({
      subjects: subjects,
      grades: numericGrades,
    });
  } catch (error) {
    console.error("Error fetching student grades:", error);
    res.status(500).json({ error: error.message });
  }
}

async function getCurrentSemester(req, res) {
  const { studentId } = req.params;
  try {
    const semester = await contract.getCurrentSemester(studentId);
    console.log(semester);
    res.status(200).json({ semester: semester.toNumber() });
  } catch (error) {
    console.error("Error getting current semester:", error);
    res.status(500).json({ error: error.message });
  }
}

async function getTotalStudents(req, res) {
  try {
    const total = await contract.getTotalStudents();
    console.log(total);
    res.status(200).json({ total: total.toNumber() });
  } catch (error) {
    console.error("Error getting total students:", error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  createStudent,
  issueCredits,
  getStudentDetails,
  getGrades,
  getCurrentSemester,
  getTotalStudents,
};

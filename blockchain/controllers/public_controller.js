const { ethers } = require("ethers");
const axios = require("axios");

require("dotenv").config();

const LOCAL_NODE_URL = "http://127.0.0.1:8545/";
const PRIVATE_KEY = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7b;
const CONTRACT_ADDRESS = 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9;

const provider = new ethers.providers.JsonRpcProvider(LOCAL_NODE_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

const {abi} = require("../artifacts/contracts/PublicBlockchain.sol/PublicBlockchain.json");

const collegeBlockchainContract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

const registerStudent = async (studentId, name) => {
    try {
        // Call the registerStudent function of the contract
        const tx = await collegeBlockchainContract.registerStudent(studentId, name);
        await tx.wait(); // Wait for transaction to be mined
        console.log("Student registered successfully!");
    } catch (error) {
        console.error("Error registering student:", error);
    }
};

const updateGrades = async (studentId, semester, subject, grade) => {
    try {
        // Call the updateGrades function of the contract
        const tx = await collegeBlockchainContract.updateGrades(studentId, semester, subject, grade);
        await tx.wait(); // Wait for transaction to be mined
        console.log("Grades updated successfully!");
    } catch (error) {
        console.error("Error updating grades:", error);
    }
};

const getGradesByUid = async (studentId) => {
    try {
        // Call the getGradesByUid function of the contract
        const grades = await collegeBlockchainContract.getGradesByUid(studentId);
        console.log("Grades:", grades);
    } catch (error) {
        console.error("Error getting grades:", error);
    }
};

// Example usage
// registerStudent(123, "John Doe");
// updateGrades(123, 1, "Math", 90);
// getGradesByUid(123);

module.exports = {
    registerStudent,
    updateGrades,
    getGradesByUid
};

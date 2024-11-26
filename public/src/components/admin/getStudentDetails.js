import React, { useState, useEffect } from "react";
import axios from "axios";
import { api } from "../utilities";
import { useDarkMode } from "../../context/themeContext";
import { useNavigate } from "react-router-dom"; // Add this import
import AdminNavbar from "./AdminNavbar";

const GetStudentDetails = () => {
  const [studentId, setStudentId] = useState("");
  const [studentDetails, setStudentDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { darkMode } = useDarkMode();
  const navigate = useNavigate(); // Add useNavigate hook for navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${api}/students/${studentId}`);
      setStudentDetails(response.data.student);
    } catch (error) {
      console.error("Error getting student details:", error);
      setError("Error fetching student details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminNavbar />
      <div
        className={`min-h-screen flex  ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        <div
          className={`container mx-auto mt-8 ${
            darkMode ? "text-white" : "text-black"
          }`}
        >
          <h2 className="text-2xl font-bold mb-4">Get Student Details</h2>
          <form onSubmit={handleSubmit} className="mb-4">
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="Enter student ID"
              className={`border rounded-md p-2 w-full ${
                darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
              }`}
              required
            />
            <button
              type="submit"
              className={`py-2 px-4 rounded mt-2 ${
                darkMode ? "bg-blue-500 text-white" : "bg-gray-500 text-black"
              }`}
              disabled={loading}
            >
              {loading ? "Loading..." : "Get Details"}
            </button>
          </form>
          {error && <p className="text-red-500">{error}</p>}
          {studentDetails && (
            <div
              className={`border rounded-md p-4 ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h3 className="text-lg font-semibold mb-2">Student Details</h3>
              <p>
                <strong>UID:</strong> {studentDetails.uid}
              </p>
              <p>
                <strong>Name:</strong> {studentDetails.generalDetails.firstName} {studentDetails.generalDetails.lastName}
              </p>
              <p>
                <strong>Email:</strong> {studentDetails.generalDetails.email}
              </p>
              <p>
                <strong>Contact Number:</strong> {studentDetails.generalDetails.contactNumber}
              </p>
              <p>
                <strong>Date of Birth:</strong> {new Date(studentDetails.generalDetails.dateOfBirth).toLocaleDateString()}
              </p>
              <p>
                <strong>Course Enrolled:</strong> {studentDetails.academicDetails.courseEnrolled}
              </p>
              <p>
                <strong>Batch:</strong> {studentDetails.academicDetails.batch.startYear} - {studentDetails.academicDetails.batch.endYear}
              </p>
              <p>
                <strong>Current Semester:</strong> {studentDetails.academicDetails.currentSemester}
              </p>
              <p>
                <strong>Total Credits Earned:</strong> {studentDetails.academicDetails.totalCreditsEarned}
              </p>
              <p>
                <strong>CGPA:</strong> {studentDetails.academicDetails.cgpa}
              </p>
              <h4 className="mt-4 font-semibold">Subject Details:</h4>
              {studentDetails.subjectDetails.length > 0 ? (
                <ul className="list-disc pl-5">
                  {studentDetails.subjectDetails.map((subject) => (
                    <li key={subject._id}>
                      {subject.subjectName} (Code: {subject.subjectCode}, Credits: {subject.credits}, Grade: {subject.grade !== null ? subject.grade : "Not Assigned"}, Semester: {subject.semester})
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No subjects found for this student.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default GetStudentDetails;
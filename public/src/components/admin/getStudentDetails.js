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
  const [grades, setGrades] = useState();
  const [subjects, setSubjects] = useState();
  const { darkMode } = useDarkMode();
  const navigate = useNavigate(); // Add useNavigate hook for navigation

  useEffect(() => {
    if (studentId) {
      handleFetchGrades();
    }
  }, [studentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${api}/studentDetails/${studentId}`);
      setStudentDetails(response.data);
    } catch (error) {
      console.error("Error getting student details:", error);
      setError("Error fetching student details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFetchGrades = async () => {
    try {
      const response = await axios.get(`${api}/getGrades/${studentId}`);
      setGrades(response.data.grades);
      setSubjects(response.data.subjects);
    } catch (error) {
      console.error("Error fetching student grades:", error);
      setError("Error fetching student grades. Please try again.");
    }
  };

  const handleGenerateMarksheet = (subjects, grades) => {
    console.log(studentDetails);
    let name = studentDetails["name"];
    let semester = studentDetails["semester"] - 1;
    let cgpa = [8.4];
    navigate("/generate-marksheet", {
      state: { studentId, name, subjects, grades, semester, cgpa },
    });
  };

  const renderGradesTables = () => {
    if (!grades || !subjects) return null;
    if (!studentDetails) return null;

    const semesters = Array.from(
      { length: Math.min(studentDetails.semester, 8) },
      (_, i) => i + 1
    );

    const maxSubjects = 5;

    return semesters.map((semester) => {
      const semesterSubjects = subjects.slice(
        (semester - 1) * maxSubjects,
        semester * maxSubjects
      );
      const semesterGrades = grades.slice(
        (semester - 1) * maxSubjects,
        semester * maxSubjects
      );

      const allSubjectsGenerated = semesterSubjects.every(
        (subject, index) => subject && semesterGrades[index]
      );

      return (
        <div
          key={semester}
          className={`border rounded-md p-4 mt-4 relative ${
            darkMode ? "bg-gray-900" : "bg-gray-100"
          }`}
        >
          <h3 className="text-lg font-semibold mb-2">Semester {semester}</h3>

          {/* Conditionally render the Generate Marksheet button if all subjects are available */}
          {allSubjectsGenerated && (
            <button
              onClick={() =>
                handleGenerateMarksheet(semesterSubjects, semesterGrades)
              } // Pass the specific subjects and grades for the semester
              className="absolute top-2 right-2 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Generate Marksheet
            </button>
          )}

          <table className="border-collapse border border-gray-800 w-full">
            <thead>
              <tr>
                {semesterSubjects.map((subject, i) => (
                  <th key={i} className="border border-gray-800 px-4 py-2">
                    {subject || `Subject ${i + 1}`}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {semesterGrades.map((grade, i) => (
                  <td key={i} className="border border-gray-800 px-4 py-2">
                    {grade || "NA"}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      );
    });
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
              <p>
                <strong>Name:</strong> {studentDetails.name}
              </p>
              <p>
                <strong>UID:</strong> {studentId}
              </p>
              <p>
                <strong>Semester:</strong> {studentDetails.semester}
              </p>
              <p>
                <strong>Subject Index:</strong>{" "}
                {studentDetails.subjectIndex % 5}
              </p>
              <p>
                <strong>Year:</strong>{" "}
                {parseInt(
                  studentDetails.semester / 2 + (studentDetails.semester % 2)
                )}
              </p>
              <button
                onClick={handleFetchGrades}
                className={`py-2 px-4 rounded mt-2 ${
                  darkMode ? "bg-blue-500 text-white" : "bg-gray-500 text-black"
                }`}
                disabled={!studentId || loading}
              >
                {loading ? "Loading Grades..." : "Fetch Grades"}
              </button>
            </div>
          )}
          {renderGradesTables()}
        </div>
      </div>
    </>
  );
};

export default GetStudentDetails;

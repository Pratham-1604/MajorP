import React, { useState, useEffect } from "react";
import axios from "axios";
import { api } from "./utilities";
import { useDarkMode } from "../context/themeContext"; // Import useDarkMode hook

const GetStudentDetails = () => {
  const [studentId, setStudentId] = useState("");
  const [studentDetails, setStudentDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [grades, setGrades] = useState();
  const [subjects, setSubjects] = useState();
  const { darkMode } = useDarkMode(); // Access dark mode state

  useEffect(() => {
    if (studentId) {
      handleFetchGrades();
    }
  }, [studentId]); // Fetch grades when studentId changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${api}/private/studentDetails/${studentId}`
      );
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
      const response = await axios.get(`${api}/private/getGrades/${studentId}`);
      setGrades(response.data.grades);
      setSubjects(response.data.subjects);
    } catch (error) {
      console.error("Error fetching student grades:", error);
      setError("Error fetching student grades. Please try again.");
    }
  };

  const renderGradesTables = () => {
    if (!grades || !subjects) return null;
    if (!studentDetails) return null; // Check if studentDetails is null

    const semesters = Array.from(
      { length: Math.min(studentDetails.semester, 8) },
      (_, i) => i + 1
    );

    const maxSubjects = 5;

    return semesters.map((semester) => (
      <div
        key={semester}
        className={`border rounded-md p-4 mt-4 ${
          darkMode ? "bg-gray-900" : "bg-gray-100"
        }`}
      >
        <h3 className="text-lg font-semibold mb-2">Semester {semester}</h3>
        <table className="border-collapse border border-gray-800">
          <thead>
            <tr>
              {Array.from({ length: maxSubjects }, (_, i) => i).map((index) => (
                <th key={index} className="border border-gray-800 px-4 py-2">
                  {subjects[(semester - 1) * maxSubjects + index] ||
                    `Subject ${index + 1}`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {Array.from({ length: maxSubjects }, (_, i) => i).map((index) => (
                <td key={index} className="border border-gray-800 px-4 py-2">
                  {grades[(semester - 1) * maxSubjects + index] || "NA"}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    ));
  };

  return (
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
              <strong>Subject Index:</strong> {studentDetails.subjectIndex % 5}
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
  );
};

export default GetStudentDetails;

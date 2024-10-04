import React, { useState, useEffect } from "react";
import axios from "axios";
import { api } from "./utilities";
import { useDarkMode } from "../context/themeContext"; // Import useDarkMode hook

const IssueCredits = () => {
  const [studentId, setStudentId] = useState("");
  const [studentDetails, setStudentDetails] = useState(null);
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [semester, setSemester] = useState("");
  const [issuedSubject, setIssuedSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [grades, setGrades] = useState();
  const [subjects, setSubjects] = useState();
  const { darkMode } = useDarkMode(); // Access dark mode state

  useEffect(() => {
    if (studentId) {
      fetchStudentDetails();
      fetchGrades();
    }
  }, [studentId]); // Fetch student details and grades whenever studentId changes

  const fetchStudentDetails = async () => {
    try {
      const response = await axios.get(
        `${api}/studentDetails/${studentId}`
      );
      setStudentDetails(response.data);
    } catch (error) {
      console.error("Error getting student details:", error);
      setStudentDetails(null); // Reset student details if an error occurs
    }
  };

  const fetchGrades = async () => {
    try {
      const response = await axios.get(`${api}/getGrades/${studentId}`);
      setGrades(response.data.grades);
      setSubjects(response.data.subjects);
    } catch (error) {
      console.error("Error fetching student grades:", error);
      setGrades(null); // Reset grades if an error occurs
      setSubjects(null); // Reset subjects if an error occurs
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(`${api}/issueCredits`, {
        studentId,
        subject,
        grade,
      });
      setSemester(response.data.semester);
      setIssuedSubject(response.data.subject);
      await fetchGrades(); // Fetch updated grades after issuing
    } catch (error) {
      console.error("Error issuing credits:", error);
      setError("Error issuing credits. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderGradesTables = () => {
    if (!grades || !subjects) return null;

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
      className={`min-h-screen flex ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
      }`}
    >
      <div
        className={`container mx-auto mt-8 ${
          darkMode ? "text-white" : "text-black"
        }`}
      >
        <h2 className="text-2xl font-bold mb-4">Issue Credits</h2>
        <form onSubmit={handleSubmit} className="mb-4">
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="Enter student ID"
            className={`border rounded-md p-2 w-full mb-2 ${
              darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
            }`}
            required
          />
          {studentDetails && <p>{studentDetails.name}</p>}
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter subject"
            className={`border rounded-md p-2 w-full mb-2 ${
              darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
            }`}
            required
          />
          <input
            type="text"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            placeholder="Enter grade"
            className={`border rounded-md p-2 w-full mb-2 ${
              darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
            }`}
            required
          />
          <button
            type="submit"
            className={`bg-blue-500 text-white font-bold py-2 px-4 rounded ${
              darkMode ? "hover:bg-blue-700" : "hover:bg-blue-400"
            }`}
            disabled={loading}
          >
            {loading ? "Issuing..." : "Issue"}
          </button>
        </form>
        {error && <p className="text-red-500">{error}</p>}
        {semester && issuedSubject && (
          <p className="text-green-500">
            Credits issued for {issuedSubject} in semester {semester}
          </p>
        )}
        {renderGradesTables()}
      </div>
    </div>
  );
};

export default IssueCredits;

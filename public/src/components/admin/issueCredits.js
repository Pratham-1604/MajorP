import React, { useState, useEffect } from "react";
import axios from "axios";
import { api } from "../utilities";
import { useDarkMode } from "../../context/themeContext";
import AdminNavbar from "./AdminNavbar";

const IssueCredits = () => {
  const [studentId, setStudentId] = useState("");
  const [studentDetails, setStudentDetails] = useState(null);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { darkMode } = useDarkMode();

  // Fetch student details when studentId changes
  useEffect(() => {
    if (studentId) {
      fetchStudentDetails();
    } else {
      // Reset states when studentId is cleared
      resetStates();
    }
  }, [studentId]);

  // Reset all states
  const resetStates = () => {
    setStudentDetails(null);
    setGrades([]);
    setError("");
    setLoading(false);
  };

  // Fetch student details
  const fetchStudentDetails = async () => {
    try {
      setLoading(true);
      setError(""); // Clear any previous errors
      
      const response = await axios.get(`${api}/students/${studentId}`);
      setStudentDetails(response.data.student);
      
      // Check current semester subjects
      const currentSemesterSubjects = response.data.student.subjectDetails.filter(
        subject => subject.semester === response.data.student.academicDetails.currentSemester
      );
      
      // Initialize grades for input or show existing grades
      setGrades(
        currentSemesterSubjects.map(subject => ({
          subjectCode: subject.subjectCode,
          subjectName: subject.subjectName,
          grade: subject.grade || ""
        }))
      );
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching student details:", error);
      setError(error.response?.data?.message || "Failed to fetch student details");
      resetStates();
    }
  };

  // Handle grade input change
  const handleGradeChange = (index, value) => {
    const newGrades = [...grades];
    newGrades[index].grade = value;
    setGrades(newGrades);
  };

  // Submit grades
  const handleSubmitGrades = async () => {
    try {
      setLoading(true);
      setError(""); // Clear previous errors
      
      // Validate grades - ensure all grades are filled
      if (grades.some(grade => grade.grade === "")) {
        setError("Please fill in all grades before submitting");
        return;
      }

      // Validate grades
      const validGrades = grades.map(grade => ({
        subjectCode: grade.subjectCode,
        grade: parseFloat(grade.grade)
      }));

      // Submit grades
      await axios.post(`${api}/students/${studentId}/assign-grades`, { grades: validGrades });
      
      // Refetch student details to update
      await fetchStudentDetails();
      
      alert("Grades submitted successfully!");
    } catch (error) {
      console.error("Error submitting grades:", error);
      setError(error.response?.data?.message || "Failed to submit grades");
    } finally {
      setLoading(false);
    }
  };

  // Increment semester
  const handleIncrementSemester = async () => {
    try {
      // Confirm before incrementing semester
      const confirmIncrement = window.confirm(
        "Are you sure you want to increment the semester? This action cannot be undone."
      );
      
      if (!confirmIncrement) return;

      setLoading(true);
      setError(""); // Clear previous errors
      
      await axios.post(`${api}/students/${studentId}/increment-semester`);
      
      // Refetch student details to update
      await fetchStudentDetails();
      
      alert("Semester incremented successfully!");
    } catch (error) {
      console.error("Error incrementing semester:", error);
      setError(error.response?.data?.message || "Failed to increment semester");
    } finally {
      setLoading(false);
    }
  };

  // Determine if all grades are filled
  const areAllGradesFilled = grades.every(grade => grade.grade !== "");

  // Determine if semester can be incremented (all grades filled)
  const canIncrementSemester = areAllGradesFilled;

  return (
    <>
      <AdminNavbar />
      <div 
        className={`min-h-screen p-6 ${
          darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
        }`}
      >
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-6">Issue Credits</h1>

          {/* Student ID Input */}
          <div className="mb-6">
            <input 
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="Enter Student ID"
              className={`w-full p-3 rounded ${
                darkMode 
                  ? "bg-gray-700 text-white" 
                  : "bg-gray-100 text-black"
              }`}
            />
          </div>

          {/* Error Display */}
          {error && (
            <div 
              className="mb-6 p-4 bg-red-100 text-red-600 rounded"
            >
              {error}
            </div>
          )}

          {/* Student Details */}
          {studentDetails && (
            <div 
              className={`mb-6 p-6 rounded ${
                darkMode ? "bg-gray-800" : "bg-gray-100"
              }`}
            >
              <h2 className="text-2xl font-semibold mb-4">
                Student Details
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p><strong>Name:</strong> {studentDetails.generalDetails.firstName} {studentDetails.generalDetails.lastName}</p>
                  <p><strong>UID:</strong> {studentDetails.uid}</p>
                </div>
                <div>
                  <p><strong>Course:</strong> {studentDetails.academicDetails.courseEnrolled}</p>
                  <p><strong>Current Semester:</strong> {studentDetails.academicDetails.currentSemester}</p>
                </div>
              </div>
            </div>
          )}

          {/* Grades Input */}
          {grades.length > 0 && (
            <div 
              className={`mb-6 p-6 rounded ${
                darkMode ? "bg-gray-800" : "bg-gray-100"
              }`}
            >
              <h2 className="text-2xl font-semibold mb-4">
                Enter Grades (0-10)
              </h2>
              <div className="space-y-4">
                {grades.map((subject, index) => (
                  <div 
                    key={subject.subjectCode} 
                    className="flex items-center space-x-4"
                  >
                    <label className="w-1/2">
                      {subject.subjectName || subject.subjectCode}
                    </label>
                    <input 
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={subject.grade}
                      onChange={(e) => handleGradeChange(index, e.target.value)}
                      className={`w-1/2 p-2 rounded ${
                        darkMode 
                          ? "bg-gray-700 text-white" 
                          : "bg-white text-black"
                      }`}
                      placeholder="Enter Grade"
                    />
                  </div>
                ))}
              </div>
               {/* Submit Grades Button */}
              <div className="mt-6 flex space-x-4">
                <button
                  onClick={handleSubmitGrades}
                  disabled={loading || !areAllGradesFilled}
                  className={`px-6 py-2 rounded w-full ${
                    darkMode 
                      ? "bg-blue-600 hover:bg-blue-700" 
                      : "bg-blue-500 hover:bg-blue-600"
                  } text-white ${
                    (loading || !areAllGradesFilled) 
                      ? "opacity-50 cursor-not-allowed" 
                      : ""
                  }`}
                >
                  {loading ? "Submitting..." : "Submit Grades"}
                </button>
              </div>
            </div>
          )}

          {/* Increment Semester Button */}
          <div className="mt-6">
            <button
              onClick={handleIncrementSemester}
              disabled={loading || !canIncrementSemester}
              className={`px-6 py-2 rounded w-full ${
                darkMode 
                  ? "bg-green-600 hover:bg-green-700" 
                  : "bg-green-500 hover:bg-green-600"
              } text-white ${
                (loading || !canIncrementSemester) 
                  ? "opacity-50 cursor-not-allowed" 
                  : ""
              }`}
            >
              {loading ? "Incrementing..." : "Increment Semester"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default IssueCredits;
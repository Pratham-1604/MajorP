import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { api } from "../utilities";
import { useDarkMode } from "../../context/themeContext";
import StudentNavbar from "./StudentNavbar";

const GradesDisplay = () => {
  const [studentDetails, setStudentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSemester, setActiveSemester] = useState(null);
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const uid = localStorage.getItem("studentUid");
        if (!uid) {
          throw new Error("No student UID found");
        }

        const response = await axios.get(`${api}/students/${uid}`);
        setStudentDetails(response.data.student);
        setLoading(false);
        // Set the first completed semester as active by default
        const completedSemesters = Object.keys(
          groupSubjectsBySemester(response.data.student.subjectDetails)
        ).map(Number);
        setActiveSemester(Math.max(...completedSemesters));
      } catch (error) {
        console.error("Error fetching student details:", error);
        setError("Failed to fetch student details");
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, []);

  // Group subjects by semester
  const groupSubjectsBySemester = (subjectDetails) => {
    const subjectsBySemester = {};
    subjectDetails.forEach((subject) => {
      if (subject.grade !== null) {
        if (!subjectsBySemester[subject.semester]) {
          subjectsBySemester[subject.semester] = [];
        }
        subjectsBySemester[subject.semester].push(subject);
      }
    });
    return subjectsBySemester;
  };

  const handleGenerateMarksheet = () => {
    if (studentDetails) {
      const { uid, generalDetails, subjectDetails } = studentDetails;
      const name = `${generalDetails.firstName} ${generalDetails.lastName}`;

      // Group subjects by semester
      const subjectsBySemester = groupSubjectsBySemester(subjectDetails);

      // Get subjects and grades for the active semester
      const semesterSubjects = subjectsBySemester[activeSemester] || [];
      const subjects = semesterSubjects.map((subject) => subject.subjectName);
      const grades = semesterSubjects.map((subject) => subject.grade);

      // Calculate SGPA for the active semester
      const totalCredits = semesterSubjects.reduce(
        (sum, subject) => sum + subject.credits,
        0
      );
      const totalGradePoints = semesterSubjects.reduce(
        (sum, subject) => sum + subject.grade * subject.credits,
        0
      );
      const sgpa = totalGradePoints / totalCredits;

      // Calculate CGPA up to this semester
      const cgpaArray = calculateCGPAHistory(subjectsBySemester);

      navigate("/generate-marksheet", {
        state: {
          studentId: uid,
          name,
          subjects,
          grades,
          semester: activeSemester,
          sgpa,
          cgpa: cgpaArray,
        },
      });
    }
  };

  // Calculate CGPA history
  const calculateCGPAHistory = (subjectsBySemester) => {
    const cgpaArray = [];
    let totalCredits = 0;
    let totalGradePoints = 0;

    // Iterate through semesters in order
    Object.keys(subjectsBySemester)
      .map(Number)
      .sort((a, b) => a - b)
      .forEach((semester) => {
        const semesterSubjects = subjectsBySemester[semester];

        // Calculate semester-wise credits and grade points
        const semesterCredits = semesterSubjects.reduce(
          (sum, subject) => sum + subject.credits,
          0
        );
        const semesterGradePoints = semesterSubjects.reduce(
          (sum, subject) => sum + subject.grade * subject.credits,
          0
        );

        // Update total credits and grade points
        totalCredits = semesterCredits;
        totalGradePoints = semesterGradePoints;

        // Calculate CGPA
        const cgpa = totalGradePoints / totalCredits;
        cgpaArray.push(Number(cgpa.toFixed(2)));
      });

    return cgpaArray;
  };

  // Render loading and error states (keep existing implementation)
  if (loading) {
    return (
      <div
        className={`min-h-screen ${
          darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
        }`}
      >
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen ${
          darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
        }`}
      >
        <div className="flex justify-center items-center h-full">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  // Group subjects by semester
  const subjectsBySemester = groupSubjectsBySemester(
    studentDetails.subjectDetails
  );

  return (
    <>
      <StudentNavbar />
      <div
        className={`min-h-screen ${
          darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
        }`}
      >
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-4">Your Grades</h1>

          {/* Tabs for Semesters */}
          <div className="mb-4">
            {Object.keys(subjectsBySemester)
              .map(Number)
              .sort((a, b) => a - b)
              .map((semester) => (
                <button
                  key={semester}
                  onClick={() => setActiveSemester(semester)}
                  className={`px-4 py-2 mx-1 rounded-l-md ${
                    activeSemester === semester
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300 text-black"
                  }`}
                >
                  Semester {semester}
                </button>
              ))}
          </div>

          {/* Grades Table for Active Semester */}
          <table className="w-full border-collapse border border-black text-center">
            <thead>
              <tr className={`${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                <th className="border border-black p-2">Subject Code</th>
                <th className="border border-black p-2">Subject Name</th>
                <th className="border border-black p-2">Grade</th>
              </tr>
            </thead>
            <tbody>
              {subjectsBySemester[activeSemester] &&
              subjectsBySemester[activeSemester].length > 0 ? (
                subjectsBySemester[activeSemester].map((subject, index) => (
                  <tr
                    key={index}
                    className={`${darkMode ? "bg-gray-700" : "bg-white"}`}
                  >
                    <td className="border border-black p-2">
                      {subject.subjectCode}
                    </td>
                    <td className="border border-black p-2">
                      {subject.subjectName}
                    </td>
                    <td className="border border-black p-2">
                      {subject.grade !== null ? subject.grade : "N/A"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="border border-black p-2">
                    No grades available for this semester.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Button to Generate Marksheet */}
          <div className="mt-6">
            <button
              onClick={handleGenerateMarksheet}
              className={`bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 ${
                darkMode ? "bg-purple-600" : "bg-purple-500"
              }`}
            >
              Generate Marksheet
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default GradesDisplay;

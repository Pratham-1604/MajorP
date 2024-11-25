// src/components/student/StudentHome.jsx
import React, { useState, useEffect } from "react";
import StudentNavbar from "./StudentNavbar";
import axios from "axios";
import { api } from "../utilities";
import { useDarkMode } from "../../context/themeContext";
import { coursesData } from "../courseData"; // Import course data for details

export default function StudentHome() {
  const [studentDetails, setStudentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      } catch (error) {
        console.error("Error fetching student details:", error);
        setError("Failed to fetch student details");
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, []);

  // Function to get course details
  const getCourseDetails = (courseCode) => {
    return coursesData[courseCode] || null;
  };

  // Render loading state
  if (loading) {
    return (
      <div
        className={`min-h-screen ${
          darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
        }`}
      >
        <StudentNavbar />
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div
        className={`min-h-screen ${
          darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
        }`}
      >
        <StudentNavbar />
        <div className="flex justify-center items-center h-full">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  // Get course details
  const courseDetails = getCourseDetails(
    studentDetails.academicDetails.courseEnrolled
  );

  return (
    <>
      <StudentNavbar />
      <div
        className={`min-h-screen ${
          darkMode ? "bg-gray-950 text-white" : "bg-white text-black"
        }`}
      >
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8 text-center">
            Welcome, {studentDetails.generalDetails.firstName}{" "}
            {studentDetails.generalDetails.lastName}
          </h1>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Personal Details Card */}
            <div
              className={`rounded-lg shadow-lg p-6 ${
                darkMode ? "bg-gray-800" : "bg-gray-100"
              }`}
            >
              <h2 className="text-2xl font-semibold mb-4">Personal Details</h2>
              <div className="space-y-3">
                <p>
                  <strong>UID:</strong> {studentDetails.uid}
                </p>
                <p>
                  <strong>Full Name:</strong>{" "}
                  {studentDetails.generalDetails.firstName}{" "}
                  {studentDetails.generalDetails.lastName}
                </p>
                <p>
                  <strong>Email:</strong> {studentDetails.generalDetails.email}
                </p>
                <p>
                  <strong>Contact Number:</strong>{" "}
                  {studentDetails.generalDetails.contactNumber}
                </p>
                <p>
                  <strong>Date of Birth:</strong>{" "}
                  {new Date(
                    studentDetails.generalDetails.dateOfBirth
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Academic Details Card */}
            <div
              className={`rounded-lg shadow-lg p-6 ${
                darkMode ? "bg-gray-800" : "bg-gray-100"
              }`}
            >
              <h2 className="text-2xl font-semibold mb-4">Academic Details</h2>
              <div className="space-y-3">
                <p>
                  <strong>Course:</strong>{" "}
                  {studentDetails.academicDetails.courseEnrolled}
                </p>
                <p>
                  <strong>Batch:</strong>{" "}
                  {studentDetails.academicDetails.batch.startYear} -{" "}
                  {studentDetails.academicDetails.batch.endYear}
                </p>
                <p>
                  <strong>Current Semester:</strong>{" "}
                  {studentDetails.academicDetails.currentSemester}
                </p>
                <p>
                  <strong>Eligible Courses:</strong>{" "}
                  {studentDetails.academicDetails.eligibleCourses.join(", ")}
                </p>
              </div>
            </div>
          </div>

          {/* Course Details Section */}
          {courseDetails && (
            <div
              className={`mt-8 rounded-lg shadow-lg p-6 ${
                darkMode ? "bg-gray-800" : "bg-gray-100"
              }`}
            >
              <h2 className="text-2xl font-semibold mb-4">Course Overview</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3
                    className={`text-xl font-semibold mb-3 ${
                      darkMode ? "text-blue-300" : "text-blue-600"
                    }`}
                  >
                    Course Description
                  </h3>
                  <p>{courseDetails.description}</p>
                </div>

                <div>
                  <h3
                    className={`text-xl font-semibold mb-3 ${
                      darkMode ? "text-green-300" : "text-green-600"
                    }`}
                  >
                    Career Opportunities
                  </h3>
                  <ul className="list-disc pl-5">
                    {courseDetails.careerOpportunities.map(
                      (opportunity, index) => (
                        <li key={index}>{opportunity}</li>
                      )
                    )}
                  </ul>
                </div>
              </div>

              {/* Current Semester Subjects */}
              <div className="mt-6">
                <h3
                  className={`text-xl font-semibold mb-3 ${
                    darkMode ? "text-purple-300" : "text-purple-600"
                  }`}
                >
                  Current Semester Subjects
                </h3>
                <div
                  className={`p-4 rounded-lg ${
                    darkMode ? "bg-gray-700" : "bg-white"
                  } shadow`}
                >
                  {courseDetails.semesters
                    .find(
                      (sem) =>
                        sem.semester ===
                        studentDetails.academicDetails.currentSemester
                    )
                    ?.subjects.map((subject, index) => (
                      <div
                        key={index}
                        className={`p-2 ${
                          index % 2 === 0
                            ? darkMode
                              ? "bg-gray-600"
                              : "bg-gray-100"
                            : ""
                        }`}
                      >
                        {subject}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

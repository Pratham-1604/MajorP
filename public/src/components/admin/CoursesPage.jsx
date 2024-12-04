import React, { useState } from "react";
import { useDarkMode } from "../../context/themeContext";
import AdminNavbar from "./AdminNavbar";
import {coursesData} from '../courseData';


const CoursesPage = () => {
  const { darkMode } = useDarkMode();
  const [selectedCourse, setSelectedCourse] = useState("CSE");
  const [expandedSemester, setExpandedSemester] = useState(null);

  const renderCourseDetails = () => {
    const course = coursesData[selectedCourse];

    return (
      <div
        className={`p-6 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}
      >
        <h2 className="text-2xl font-bold mb-4">{course.fullName}</h2>
        <p className="mb-4">{course.description}</p>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3
              className={`text-xl font-semibold mb-3 ${
                darkMode ? "text-blue-300" : "text-blue-600"
              }`}
            >
              Semester-wise Subjects
            </h3>
            <div className="space-y-2">
              {course.semesters.map((semesterData) => (
                <div key={semesterData.semester}>
                  <button
                    onClick={() => 
                      setExpandedSemester(
                        expandedSemester === semesterData.semester 
                        ? null 
                        : semesterData.semester
                      )
                    }
                    className={`w-full text-left p-2 rounded ${
                      darkMode 
                        ? "bg-gray-600 hover:bg-gray-500" 
                        : "bg-gray-200 hover:bg-gray-300"
                    } ${
                      expandedSemester === semesterData.semester
                        ? darkMode
                          ? "bg-blue-700"
                          : "bg-blue-500 text-white"
                        : ""
                    }`}
                  >
                    Semester {semesterData.semester}
                  </button>
                  {expandedSemester === semesterData.semester && (
                    <ul 
                      className={`pl-4 mt-2 ${
                        darkMode ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      {semesterData.subjects.map((subject, index) => (
                        <li key={index} className="mb-1 list-disc">
                          {subject}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3
              className={`text-xl font-semibold mb-3 ${
                darkMode ? "text-green-300" : "text-green-600"
              }`}
            >
              Career Opportunities
            </h3>
            <ul
              className={`list-disc pl-5 ${
                darkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              {course.careerOpportunities.map((opportunity, index) => (
                <li key={index} className="mb-2">
                  {opportunity}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <AdminNavbar />
      <div
        className={`min-h-screen ${
          darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
        }`}
      >
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8 text-center">Our Courses</h1>

          <div className="flex justify-center mb-8">
            {Object.keys(coursesData).map((course) => (
              <button
                key={course}
                onClick={() => setSelectedCourse(course)}
                className={`
                px-6 py-3 mx-2 rounded-lg transition-all duration-300
                ${
                  selectedCourse === course
                    ? darkMode
                      ? "bg-blue-700 text-white"
                      : "bg-blue-500 text-white"
                    : darkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }
                            `}
              >
                {course}
              </button>
            ))}
          </div>

          <div className="max-w-4xl mx-auto">{renderCourseDetails()}</div>
        </div>
      </div>
    </>
  );
};

export default CoursesPage;
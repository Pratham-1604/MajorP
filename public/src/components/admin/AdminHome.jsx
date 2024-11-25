import React, { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar";
import { useDarkMode } from "../../context/themeContext";
import { api } from "../utilities";
import axios from "axios";

export default function AdminHome() {
  const [students, setStudents] = useState(0);
  const { darkMode } = useDarkMode();
  const getStudentList = async () => {
    try {
      const response = await axios.get(`${api}/students/count`);
      setStudents(response.data.count);
    } catch (error) {
      console.error("Error fetching number of students", error);
    }
  };

  useEffect(() => {
    getStudentList();
  }, []);
  return (
    <>
      <AdminNavbar />
      <div
        className={`min-h-screen ${
          darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
        }`}
      >
        <div className="container mx-auto px-4 py-8">
          <div
            className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${
              darkMode ? "bg-gray-800" : "bg-gray-100"
            } p-6 rounded-lg shadow-md`}
          >
            <div
              className={`p-6 rounded-lg ${
                darkMode ? "bg-gray-700" : "bg-white"
              } shadow-md`}
            >
              <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
              <div className="space-y-4">
                <div
                  className={`p-4 rounded ${
                    darkMode ? "bg-gray-600" : "bg-gray-200"
                  }`}
                >
                  <h3 className="font-semibold">Total Students</h3>
                  <p className="text-xl">
                    {students === 0 ? (
                      <p className="mb-4">No students found.</p>
                    ) : (
                      <p className="mb-4">Number of students: {students}</p>
                    )}
                  </p>
                </div>
                <div
                  className={`p-4 rounded ${
                    darkMode ? "bg-gray-600" : "bg-gray-200"
                  }`}
                >
                  <h3 className="font-semibold">Active Courses</h3>
                  <p className="text-xl">15</p>
                </div>
              </div>
            </div>

            <div
              className={`p-6 rounded-lg ${
                darkMode ? "bg-gray-700" : "bg-white"
              } shadow-md`}
            >
              <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
              <div className="space-y-4">
                <button
                  className={`w-full py-3 rounded ${
                    darkMode
                      ? "bg-blue-700 hover:bg-blue-600 text-white"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                >
                  Create New Student
                </button>
                <button
                  className={`w-full py-3 rounded ${
                    darkMode
                      ? "bg-green-700 hover:bg-green-600 text-white"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  }`}
                >
                  Issue Grades
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

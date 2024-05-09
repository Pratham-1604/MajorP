import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { api } from "../utilities";
import { useDarkMode } from "../../context/themeContext"; // Import useDarkMode hook

const StudentList = () => {
  const [students, setStudents] = useState();
  const { darkMode } = useDarkMode(); // Access dark mode state

  const getStudentList = async () => {
    try {
      const response = await axios.get(`${api}/private/totalStudents`);
      setStudents(response.data.total);
    } catch (error) {
      console.error("Error fetching number of students", error);
    }
  };

  useEffect(() => {
    getStudentList(); // Fetch student list on component mount
  }, []); // Empty dependency array to run the effect only once on mount

  return (
    <div
      className={`min-h-screen flex ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
      }`}
    >
      <div className={`container mx-auto mt-10 }`}>
        <h2 className="text-2xl font-bold mb-4">List of Students</h2>
        <ul className="list-disc pl-4">
          {students === 0 ? (
            <p className="mb-4">No students found.</p>
          ) : (
            <p className="mb-4">Number of students: {students}</p>
          )}
        </ul>

        <Link
          to="/create-student"
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-4 inline-block ${
            darkMode ? "dark-mode-link" : "light-mode-link"
          }`}
        >
          Add Student
        </Link>
      </div>
    </div>
  );
};

export default StudentList;

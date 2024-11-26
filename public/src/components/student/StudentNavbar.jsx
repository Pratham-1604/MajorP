import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDarkMode } from "../../context/themeContext";
import { FiSun, FiMoon } from "react-icons/fi";

const StudentNavbar = () => {
  const { darkMode, toggleDarkMode } = useDarkMode(); // Access dark mode state and toggle function
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate("/");
  };
  return (
    <nav>
      <div
        className={`bg-${
          darkMode ? "gray-950" : "gray-800"
        } text-white flex justify-between items-center px-4 py-2`}
      >
        <div className="college-name text-2xl">
          <Link to="/student-home" className="px-4 py-2 rounded">
            Sardar Patel Institute of Technology
          </Link>
        </div>
        <div className="nav-links">
          <Link
            to="/grades-display"
            className="nav-button bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
          >
            Get Grades
          </Link>
          <Link
            to="/subject-selection"
            className="nav-button bg-gray-700 mx-2 px-4 py-2 rounded hover:bg-gray-600"
          >
            Select Subjects
          </Link>
          <button
            onClick={handleLogout}
            className={`nav-button bg-gray-700 mx-2 px-4 py-2 rounded hover:bg-gray-600`}
          >
            Logout
          </button>
          <button
            onClick={toggleDarkMode}
            className="ml-2 bg-gray-700 px-3 py-1 rounded hover:bg-gray-600 focus:outline-none"
          >
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default StudentNavbar;

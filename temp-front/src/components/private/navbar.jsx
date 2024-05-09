import React from "react";
import { Link } from "react-router-dom";
import { useDarkMode } from "../../context/themeContext";
import { FiSun, FiMoon } from "react-icons/fi";

const Navbar = () => {
  const { darkMode, toggleDarkMode } = useDarkMode(); // Access dark mode state and toggle function

  return (
    <nav>
      <div className={`bg-${darkMode ? "gray-900" : "gray-800"} text-white flex justify-between items-center px-4 py-2`}>
        <div className="college-name text-2xl">
          <Link to="/" className="px-4 py-2 rounded">
            Sardar Patel Institute of Technology
          </Link>
        </div>
        <div className="nav-links">
          <Link to="/create-student" className="nav-button bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">
            Create New Student
          </Link>
          <Link to="/get-student-details" className="nav-button m-2 bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">
            Get Student Details
          </Link>
          <Link to="/issue-credits" className="nav-button bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">
            Issue Grades
          </Link>
          {/* Toggle dark mode button */}
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

export default Navbar;

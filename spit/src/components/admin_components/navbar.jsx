import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDarkMode } from "../../context/themeContext";
import { FiSun, FiMoon } from "react-icons/fi";

const Navbar = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    navigate("/auth");
  };

  return (
    <nav>
      <div
        className={`bg-${
          darkMode ? "gray-900" : "gray-800"
        } text-white flex justify-between items-center px-4 py-2`}
      >
        <div className="college-name text-2xl">
          <Link to="/admin-home" className="px-4 py-2 rounded">
            Sardar Patel Institute of Technology
          </Link>
        </div>
        <div className="nav-links flex items-center">
          <Link
            to="/create-student"
            className="nav-button bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
          >
            Create New Student
          </Link>
          <Link
            to="/get-student-details"
            className="nav-button m-2 bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
          >
            Get Student Details
          </Link>
          <Link
            to="/issue-credits"
            className="nav-button bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
          >
            Issue Grades
          </Link>
          {/* Toggle dark mode button */}
          <button
            onClick={toggleDarkMode}
            className="ml-2 bg-gray-700 px-3 py-1 rounded hover:bg-gray-600 focus:outline-none"
          >
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>
          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="ml-4 bg-red-600 px-4 py-2 rounded hover:bg-red-500"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

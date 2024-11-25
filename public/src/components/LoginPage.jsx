// src/components/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../context/themeContext";
import { FiSun, FiMoon } from "react-icons/fi";
import axios from "axios";
import { api } from "./utilities";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const { darkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (role === "admin") {
      // Admin login logic
      navigate("/admin-home");
    } else {
      try {
        // Student login
        const response = await axios.post(`${api}/students/login`, {
          uid: username,
          password: password, // In a real app, use proper password hashing
        });

        // Store UID in local storage
        localStorage.setItem("studentUid", username);

        if (response.data.isAuthenticated) {
          if (!response.data.isProfileComplete) {
            // Redirect to profile completion page
            navigate("/complete-profile");
          } else {
            navigate("/student-home");
          }
        }
      } catch (error) {
        // Handle login error
        console.error("Login error:", error);
        // Show error message
      }
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center 
      ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}
    >
      {/* Dark mode toggle */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-4 right-4 p-2 rounded bg-gray-200 dark:bg-gray-700"
      >
        {darkMode ? <FiSun /> : <FiMoon />}
      </button>

      <div
        className={`w-full max-w-md p-8 space-y-6 rounded-xl shadow-md 
        ${darkMode ? "bg-gray-800" : "bg-white"}`}
      >
        <h2 className="text-3xl font-bold text-center">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={`w-full p-2 rounded 
              ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200"}`}
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full p-2 rounded 
              ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200"}`}
              required
            />
          </div>

          <div>
            <label className="block mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-2 rounded 
              ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200"}`}
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full p-2 rounded 
            ${
              darkMode
                ? "bg-blue-700 hover:bg-blue-600"
                : "bg-blue-500 hover:bg-blue-600"
            } 
            text-white`}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

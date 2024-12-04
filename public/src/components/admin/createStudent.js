import React, { useState } from "react";
import axios from "axios";
import { useDarkMode } from "../../context/themeContext";
import { api } from "../utilities";
import AdminNavbar from "./AdminNavbar";

const CreateStudent = () => {
  const [formData, setFormData] = useState({
    email: "",
    batch: {
      startYear: "",
      endYear: "",
    },
  });

  const [eligibleCourses, setEligibleCourses] = useState({
    CSE: false,
    EXTC: false,
    MCA: false,
  });

  const [studentCreated, setStudentCreated] = useState(null);
  const [error, setError] = useState(null);
  const { darkMode } = useDarkMode();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Handle nested batch fields
    if (name.startsWith("batch.")) {
      setFormData((prev) => ({
        ...prev,
        batch: {
          ...prev.batch,
          [name.split(".")[1]]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCheckboxChange = (course) => {
    setEligibleCourses((prev) => ({
      ...prev,
      [course]: !prev[course],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setStudentCreated(null);

    // Prepare eligible courses
    const selectedEligibleCourses = Object.keys(eligibleCourses).filter(
      (course) => eligibleCourses[course]
    );

    try {
      const payload = {
        ...formData,
        eligibleCourses: selectedEligibleCourses,
      };

      const response = await axios.post(`${api}/students/create`, payload);

      setStudentCreated(response.data.student);

      // Reset form
      setFormData({
        email: "",
        batch: {
          startYear: "",
          endYear: "",
        },
      });
      setEligibleCourses({
        CSE: false,
        EXTC: false,
        MCA: false,
      });
    } catch (error) {
      console.error("Error creating student:", error);
      setError(
        error.response?.data?.message ||
          "Failed to create student. Please try again."
      );
    }
  };

  return (
    <div
      className={`flex flex-col h-screen ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100"
          : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-900"
      }`}
    >
      <AdminNavbar />
      <div className="flex-grow flex items-center justify-center overflow-auto p-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6">
          <h2
            className={`text-2xl font-bold mb-6 text-center ${
              darkMode ? "text-blue-300" : "text-blue-700"
            }`}
          >
            Create Student
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Contact Details */}
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email Address"
              className={`border rounded-md p-3 w-full ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-gray-200"
                  : "bg-white border-gray-300 text-gray-800"
              }`}
              required
            />

            {/* Batch Years */}
            <div className="flex space-x-2">
              <input
                type="number"
                name="batch.startYear"
                value={formData.batch.startYear}
                onChange={handleInputChange}
                placeholder="Start Year"
                min="2000"
                max="2030"
                className={`border rounded-md p-3 w-full ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-gray-200"
                    : "bg-white border-gray-300 text-gray-800"
                }`}
                required
              />
              <input
                type="number"
                name="batch.endYear"
                value={formData.batch.endYear}
                onChange={handleInputChange}
                placeholder="End Year"
                min="2000"
                max="2030"
                className={`border rounded-md p-3 w-full ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-gray-200"
                    : "bg-white border-gray-300 text-gray-800"
                }`}
                required
              />
            </div>

            {/* Eligible Courses */}
            <div className="mb-4">
              <h3
                className={`text-lg font-semibold mb-3 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Select Eligible Courses
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {Object.keys(eligibleCourses).map((course) => (
                  <label
                    key={course}
                    className={`inline-flex items-center p-2 rounded-md cursor-pointer transition-all duration-300 ${
                      eligibleCourses[course]
                        ? darkMode
                          ? "bg-blue-800 text-blue-200"
                          : "bg-blue-100 text-blue-800"
                        : darkMode
                        ? "hover:bg-gray-700 text-gray-400"
                        : "hover:bg-gray-100 text-gray-600"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={eligibleCourses[course]}
                      onChange={() => handleCheckboxChange(course)}
                      className="form-checkbox mr-2 focus:ring-2 focus:ring-blue-500"
                    />
                    <span>{course}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-3 rounded-md font-bold uppercase tracking-wider transition-all duration-300 ${
                darkMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              Create Student
            </button>
          </form>

          {studentCreated && (
            <div
              className={`mt-4 p-4 rounded-md text-center ${
                darkMode
                  ? "bg-green-900 text-green-300"
                  : "bg-green-100 text-green-800"
              }`}
            >
              <p className="font-semibold">Student Created Successfully!</p>
              <p className="text-sm mt-1">Student ID: {studentCreated.uid}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateStudent;

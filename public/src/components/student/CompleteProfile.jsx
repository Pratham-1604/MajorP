// src/components/student/CompleteProfile.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { api } from "../utilities";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../../context/themeContext";

const CompleteProfile = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    contactNumber: "",
    dateOfBirth: "",
    courseEnrolled: ""
  });
  const [eligibleCourses, setEligibleCourses] = useState([]);
  const [error, setError] = useState(null);
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();

  // Fetch student details on component mount
  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const uid = localStorage.getItem('studentUid');
        console.log(uid);
        const response = await axios.get(`${api}/students/${uid}`);
        const { student } = response.data;
        
        setEligibleCourses(student.academicDetails.eligibleCourses);
      } catch (error) {
        console.error("Error fetching student details:", error);
        setError("Failed to fetch student details");
      }
    };

    fetchStudentDetails();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const uid = localStorage.getItem('studentUid');
      const response = await axios.put(`${api}/students/${uid}/update`, formData);
      
      // Navigate to student home after successful profile update
      navigate("/student-home");
    } catch (error) {
      console.error("Profile update error:", error);
      setError(error.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${
      darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
    }`}>
      <div className={`w-full max-w-md p-8 rounded-xl shadow-md ${
        darkMode ? "bg-gray-800" : "bg-white"
      }`}>
        <h2 className="text-2xl font-bold mb-6 text-center">Complete Your Profile</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className={`w-full p-2 rounded ${
                darkMode ? "bg-gray-700 text-white" : "bg-gray-200"
              }`}
              required
            />
          </div>

          <div>
            <label className="block mb-2">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className={`w-full p-2 rounded ${
                darkMode ? "bg-gray-700 text-white" : "bg-gray-200"
              }`}
              required
            />
          </div>

          <div>
            <label className="block mb-2">Contact Number</label>
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleInputChange}
              className={`w-full p-2 rounded ${
                darkMode ? "bg-gray-700 text-white" : "bg-gray-200"
              }`}
              required
            />
          </div>

          <div>
            <label className="block mb-2">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              className={`w-full p-2 rounded ${
                darkMode ? "bg-gray-700 text-white" : "bg-gray-200"
              }`}
              required
            />
          </div>

          <div>
            <label className="block mb-2">Select Course</label>
            <select
              name="courseEnrolled"
              value={formData.courseEnrolled}
              onChange={handleInputChange}
              className={`w-full p-2 rounded ${
                darkMode ? "bg-gray-700 text-white" : "bg-gray-200"
              }`}
              required
            >
              <option value="">Select a Course</option>
              {eligibleCourses.map(course => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className={`w-full p-2 rounded ${
              darkMode
                ? "bg-blue-700 hover:bg-blue-600"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
          >
            Complete Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;
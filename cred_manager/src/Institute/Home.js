import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StudentLogin from "../Student/Registration/StudentLogin";
import Login from "./Registration/Login";

export default function HomePage() {
  const [selectedLogin, setSelectedLogin] = useState("institute");
  const navigate = useNavigate();

  useEffect(() => {
    const login = localStorage.getItem("login");
    console.log(login === "Institute")
    if (login === "Institute") {
      navigate("/institution_home");
    } else if (login === "Student") {
      navigate("/student_home");
    }
    // If neither, stay on home
  }, [navigate]);

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-gray-100">
      {/* Toggle Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setSelectedLogin("institute")}
          className={`px-6 py-2 rounded-lg text-white ${
            selectedLogin === "institute" ? "bg-blue-600" : "bg-gray-400"
          }`}
        >
          Institute
        </button>
        <button
          onClick={() => setSelectedLogin("student")}
          className={`px-6 py-2 rounded-lg text-white ${
            selectedLogin === "student" ? "bg-blue-600" : "bg-gray-400"
          }`}
        >
          Student
        </button>
      </div>

      {/* Conditional Rendering for Login Forms */}
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        {selectedLogin === "institute" && <Login />}
        {selectedLogin === "student" && <StudentLogin />}
      </div>
    </div>
  );
}

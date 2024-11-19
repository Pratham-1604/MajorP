import React from 'react';
import StudentLogin from "../Student/Registration/StudentLogin";
import Login from "./Registration/Login"; 

export default function HomePage() {
  return (
    <div className="flex flex-row justify-between items-center gap-4 p-4 min-h-screen">
      {/* Left Side: Login (Institution login) */}
      <div className="flex-1 p-4 bg-gray-100 rounded-lg shadow-md">
        <Login /> {/* Login for institution */}
      </div>

      {/* Right Side: StudentLogin (Student login) */}
      <div className="flex-1 p-4 bg-gray-200 rounded-lg shadow-md">
        <StudentLogin /> {/* Student Login */}
      </div>
    </div>
  );
}
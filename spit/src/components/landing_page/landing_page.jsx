import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook

function LandingPage() {
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  const handleLoginRedirect = () => {
    navigate("/auth"); // Navigate to the login page
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 text-white">
      <p className="text-xl text-gray-400">Welcome to</p>
      <p className="text-3xl font-bold mb-4">Bhartiya Vidya Bhavan's</p>
      <h1 className="text-5xl font-bold mb-4">
        Sardar Patel Institute of Technology
      </h1>

      {/* Button to go to login page */}
      <button
        onClick={handleLoginRedirect}
        className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
      >
        Go to Login
      </button>
    </div>
  );
}

export default LandingPage;

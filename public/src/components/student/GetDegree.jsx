// src/components/student/GetDegree.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { api } from "../utilities";
import { useDarkMode } from "../../context/themeContext";
import StudentNavbar from "./StudentNavbar";
import ProvisionalCertificate from "./ProvisionalCertificate"; // Import the new component

const GetDegree = () => {
  const [studentDetails, setStudentDetails] = useState(null);
  const [totalCredits, setTotalCredits] = useState(0);
  const [degree, setDegree] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { darkMode } = useDarkMode();
  const [canViewCertificate, setCanViewCertificate] = useState(false); // State to control certificate visibility

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const uid = localStorage.getItem("studentUid");
        if (!uid) {
          throw new Error("No student UID found");
        }

        const response = await axios.get(`${api}/students/${uid}`);
        setStudentDetails(response.data.student);
        calculateTotalCredits(response.data.student.subjectDetails);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching student details:", error);
        setError("Failed to fetch student details");
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, []);

  const calculateTotalCredits = (subjectDetails) => {
    const credits = subjectDetails.reduce(
      (sum, subject) => sum + (subject.credits || 0),
      0
    );
    setTotalCredits(credits);
    determineDegree(credits);
    setCanViewCertificate(credits >= 20); // Set the state based on credit eligibility
  };

  const determineDegree = (credits) => {
    let degree = "";
    if (credits >= 20 && credits <= 79) {
      degree = "Diploma";
    } else if (credits >= 80 && credits <= 119) {
      degree = "BSc";
    } else if (credits >= 120 && credits <= 159) {
      degree = "MCA";
    } else if (credits === 160) {
      degree = "B.Tech";
    } else {
      degree = "Not eligible for any degree";
    }
    setDegree(degree);
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
        <StudentNavbar />
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
        <StudentNavbar />
        <div className="flex justify-center items-center h-full">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      <StudentNavbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Degree Information</h1>
        <p className="text-xl">Total Credits Earned: {totalCredits}</p>
        <p className="text-xl">Your Degree: {degree}</p>
        
        {/* Conditional rendering for the Provisional Certificate */}
        {canViewCertificate && (
          <ProvisionalCertificate 
            studentDetails={studentDetails} 
            totalCredits={totalCredits} 
            degree={degree} 
          />
        )}
      </div>
    </div>
  );
};

export default GetDegree;
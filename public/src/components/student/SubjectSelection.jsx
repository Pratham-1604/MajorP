import React, { useState, useEffect } from "react";
import axios from "axios";
import { api } from "../utilities";
import { coursesData } from "../courseData";
import { useDarkMode } from "../../context/themeContext";
import StudentNavbar from "./StudentNavbar";
import { useNavigate } from "react-router-dom";

const SubjectSelection = () => {
  const [studentDetails, setStudentDetails] = useState(null);
  const [currentSemesterSubjects, setCurrentSemesterSubjects] = useState([]);
  const [availableElectives, setAvailableElectives] = useState([]);
  const [compulsorySubjects, setCompulsorySubjects] = useState([]);
  const [selectedElectives, setSelectedElectives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentSubjects = async () => {
      try {
        const uid = localStorage.getItem("studentUid");

        // Fetch student details
        const studentResponse = await axios.get(`${api}/students/${uid}`);
        const student = studentResponse.data.student;
        setStudentDetails(student);

        // Fetch available elective subjects from API
        const electivesResponse = await axios.get(
          `${api}/students/${uid}/available-electives`
        );
        const backendElectives = electivesResponse.data.electiveSubjects.map(
          (elective) => ({
            ...elective,
            type: "elective",
          })
        );

        // Get compulsory subjects from courseData
        const { courseEnrolled, currentSemester } = student.academicDetails;

        const courseCompulsorySubjects =
          coursesData[courseEnrolled].semesters
            .find((sem) => sem.semester === currentSemester)
            ?.subjects.map((subjectName) => ({
              subjectName,
              credits: 4,
              type: "compulsory",
            })) || [];

        // Check if subjects already exist for current semester
        const existingSubjects = student.subjectDetails.filter(
          (subject) => subject.semester === currentSemester
        );

        if (existingSubjects.length > 0) {
          setCurrentSemesterSubjects(existingSubjects);
        } else {
          setCompulsorySubjects(courseCompulsorySubjects);
          setAvailableElectives(backendElectives);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching subject details:", error);
        setError("Failed to fetch subject details");
        setLoading(false);
      }
    };

    fetchStudentSubjects();
  }, []);

  // Calculate total credits
  const calculateTotalCredits = () => {
    const compulsoryCredits = compulsorySubjects.reduce(
      (sum, subject) => sum + subject.credits,
      0
    );
    const selectedElectiveCredits = selectedElectives.reduce(
      (sum, subject) => sum + subject.credits,
      0
    );
    return compulsoryCredits + selectedElectiveCredits;
  };

  // Handle elective selection
  const handleElectiveSelect = (elective) => {
    const totalCredits = calculateTotalCredits();

    // Check credit limit and prevent duplicates
    if (
      totalCredits + elective.credits <= 25 &&
      !selectedElectives.some(
        (selected) => selected.subjectCode === elective.subjectCode
      )
    ) {
      setSelectedElectives([...selectedElectives, elective]);
    } else if (totalCredits + elective.credits > 25) {
      alert("Cannot exceed 25 credits");
    }
  };

  // Remove selected elective
  const handleRemoveElective = (electiveToRemove) => {
    setSelectedElectives(
      selectedElectives.filter(
        (elective) => elective.subjectCode !== electiveToRemove.subjectCode
      )
    );
  };

  // Submit selected subjects
  const handleSubmitSubjects = async () => {
    const compulsoryCreditTotal = compulsorySubjects.reduce(
      (sum, subject) => sum + subject.credits,
      0
    );
    const electiveCreditTotal = selectedElectives.reduce(
      (sum, subject) => sum + subject.credits,
      0
    );
    const totalCredits = compulsoryCreditTotal + electiveCreditTotal;

    console.log("Compulsory Credits:", compulsoryCreditTotal);
    console.log("Elective Credits:", electiveCreditTotal);
    console.log("Total Credits:", totalCredits);

    // Precise credit validation
    if (totalCredits < 15 || totalCredits > 25) {
      console.log("here");
      alert(`Total credits must be between 15 and 25. Current total: ${totalCredits} credits
      Compulsory: ${compulsoryCreditTotal}
      Elective: ${electiveCreditTotal}`);
      return;
    }

    try {
      const uid = localStorage.getItem("studentUid");

      // Prepare subjects to submit
      const submissionData = {
        compulsorySubjects: compulsorySubjects.map((subject) => ({
          ...subject,
          semester: studentDetails.academicDetails.currentSemester,
        })),
        electiveSubjects: selectedElectives.map((elective) => ({
          ...elective,
          semester: studentDetails.academicDetails.currentSemester,
        })),
      };
      
      await axios.post(
        `${api}/students/${uid}/add-semester-subjects`,
        submissionData
      );

      alert("Subjects selected successfully!");
      navigate("/student-home");
    } catch (error) {
      console.error("Error selecting subjects:", error);
      alert(error.response?.data?.message || "Failed to select subjects");
    }
  };

  // Render subject cards
  const renderSubjectCards = (subjects, canRemove = false) => {
    return subjects.map((subject, index) => (
      <div
        key={index}
        className={`p-4 rounded flex justify-between items-center ${
          darkMode
            ? subject.type === "compulsory"
              ? "bg-blue-900"
              : "bg-gray-800"
            : subject.type === "compulsory"
            ? "bg-blue-100"
            : "bg-gray-100"
        }`}
      >
        <div>
          <p>{subject.subjectName}</p>
          <p>
            Credits: {subject.credits}
            <span className="ml-2 text-sm">
              {subject.type === "compulsory" ? "(Compulsory)" : "(Elective)"}
            </span>
          </p>
        </div>
        {canRemove && (
          <button
            onClick={() => handleRemoveElective(subject)}
            className={`ml-2 px-2 py-1 rounded ${
              darkMode
                ? "bg-red-500 hover:bg-red-600"
                : "bg-red-200 hover:bg-red-300"
            }`}
          >
            Remove
          </button>
        )}
      </div>
    ));
  };

  // Render content based on semester subject status
  const renderContent = () => {
    // If subjects already exist for current semester
    if (currentSemesterSubjects.length > 0) {
      return (
        <div className="grid md:grid-cols-3 gap-4">
          {renderSubjectCards(currentSemesterSubjects)}
        </div>
      );
    }

    // Subject selection mode
    return (
      <>
        {/* Compulsory Subjects */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Compulsory Subjects</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {renderSubjectCards(compulsorySubjects)}{" "}
          </div>
        </div>

        {/* Available Electives */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Available Electives</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {availableElectives.map((elective, index) => (
              <div
                key={index}
                className={`p-4 rounded flex justify-between items-center ${
                  darkMode ? "bg-gray-800" : "bg-gray-100"
                }`}
              >
                <div>
                  <p>{elective.subjectName}</p>
                  <p>Credits: {elective.credits}</p>
                </div>
                <button
                  onClick={() => handleElectiveSelect(elective)}
                  className={`ml-2 px-2 py-1 rounded ${
                    darkMode
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-green-200 hover:bg-green-300"
                  }`}
                >
                  Select
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Electives */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Selected Electives</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {renderSubjectCards(selectedElectives, true)}
          </div>
        </div>
        <div className="mb-6 p-4 rounded border border-gray-300">
          <h2 className="text-2xl font-semibold mb-4">Total Credits Summary</h2>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Compulsory Credits */}
            <div
              className={`p-4 rounded ${
                darkMode ? "bg-blue-900" : "bg-blue-100"
              }`}
            >
              <h3 className="font-bold">Compulsory Subjects</h3>
              <p className="text-xl">
                {compulsorySubjects.reduce(
                  (sum, subject) => sum + subject.credits,
                  0
                )}{" "}
                Credits
              </p>
            </div>

            {/* Elective Credits */}
            <div
              className={`p-4 rounded ${
                darkMode ? "bg-green-900" : "bg-green-100"
              }`}
            >
              <h3 className="font-bold">Elective Subjects</h3>
              <p className="text-xl">
                {selectedElectives.reduce(
                  (sum, subject) => sum + subject.credits,
                  0
                )}{" "}
                Credits
              </p>
            </div>

            {/* Total Credits */}
            <div
              className={`p-4 rounded ${
                calculateTotalCredits() >= 15 && calculateTotalCredits() <= 25
                  ? darkMode
                    ? "bg-green-900"
                    : "bg-green-100"
                  : darkMode
                  ? "bg-red-900"
                  : "bg-red-100"
              }`}
            >
              <h3 className="font-bold">Total Credits</h3>
              <p className="text-xl">{calculateTotalCredits()} Credits</p>
            </div>
          </div>

          {/* Credit Range Indicator */}
          <div className="mt-4">
            <p
              className={`text-center font-semibold ${
                calculateTotalCredits() >= 15 && calculateTotalCredits() <= 25
                  ? darkMode
                    ? "text-green-300"
                    : "text-green-700"
                  : darkMode
                  ? "text-red-300"
                  : "text-red-700"
              }`}
            >
              {calculateTotalCredits() < 15
                ? "Minimum 15 credits required"
                : calculateTotalCredits() > 25
                ? "Maximum 25 credits exceeded"
                : "Credits are within the acceptable range"}
            </p>
          </div>

          {/* Detailed Credit Breakdown */}
          <div className="mt-4 text-sm text-center">
            <p>Breakdown:</p>
            <p>
              Compulsory Subjects:{" "}
              {compulsorySubjects.reduce(
                (sum, subject) => sum + subject.credits,
                0
              )}{" "}
              credits
            </p>
            <p>
              Elective Subjects:{" "}
              {selectedElectives.reduce(
                (sum, subject) => sum + subject.credits,
                0
              )}{" "}
              credits
            </p>
          </div>
        </div>
        {/* Submit Button */}
        <div className="mt-6">
          <button
            onClick={handleSubmitSubjects}
            className={`px-4 py-2 rounded ${
              darkMode
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-blue-200 hover:bg-blue-300"
            }`}
          >
            Submit Selected Subjects
          </button>
        </div>
      </>
    );
  };

  // Loading and error handling
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div
      className={`p-6 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <StudentNavbar />
      <h1 className="text-3xl font-bold mb-6">
        Subject Selection for Semester{" "}
        {studentDetails?.academicDetails.currentSemester}
      </h1>
      {renderContent()}
    </div>
  );
};

export default SubjectSelection;

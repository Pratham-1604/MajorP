import React, { useRef, useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import AWS from "aws-sdk";
import { useDarkMode } from "../../context/themeContext";
import axios from "axios";
import { api } from "../utilities";
import StudentNavbar from "./StudentNavbar";
import { uploadToS3 } from "../../utils/s3Upload";

const GenerateMarksheetQR = () => {
  const { darkMode } = useDarkMode();
  const [studentDetails, setStudentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSemester, setActiveSemester] = useState(0);
  const [s3Link, setS3Link] = useState("");
  const [qrCodeLink, setQrCodeLink] = useState("");
  const fullMarksheetRef = useRef(null);
  const qrCodeRef = useRef(null);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const uid = localStorage.getItem("studentUid");
        if (!uid) {
          throw new Error("No student UID found");
        }

        const response = await axios.get(`${api}/students/${uid}`);
        const student = response.data.student;

        const semesterSubjects = groupSubjectsBySemester(
          student.subjectDetails
        );

        const semestersWithSGPA = semesterSubjects.map((semester) => {
          const totalCredits = semester.subjects.reduce(
            (sum, subject) => sum + subject.credits,
            0
          );
          const totalGradePoints = semester.subjects.reduce(
            (sum, subject) => sum + subject.grade * subject.credits,
            0
          );
          const sgpa = totalGradePoints / totalCredits;
          return { ...semester, sgpa };
        });

        const cgpaHistory = calculateCGPAHistory(semesterSubjects);

        setStudentDetails({
          ...student,
          semesters: semestersWithSGPA,
          cgpa: cgpaHistory,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching student details:", error);
        setError("Failed to fetch student details");
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, []);

  const calculateCGPAHistory = (semesterSubjects) => {
    const cgpaHistory = [];
    let totalCredits = 0;
    let totalGradePoints = 0;

    semesterSubjects.forEach((semester) => {
      const semesterCredits = semester.subjects.reduce(
        (sum, subject) => sum + subject.credits,
        0
      );
      const semesterGradePoints = semester.subjects.reduce(
        (sum, subject) => sum + subject.grade * subject.credits,
        0
      );

      totalCredits += semesterCredits;
      totalGradePoints += semesterGradePoints;

      const cgpa = totalGradePoints / totalCredits;
      cgpaHistory.push(Number(cgpa.toFixed(2)));
    });

    return cgpaHistory;
  };

  const groupSubjectsBySemester = (subjectDetails) => {
    const semesterMap = {};

    const filteredSubjects = subjectDetails.filter(
      (subject) => subject.grade !== null
    );

    filteredSubjects.forEach((subject) => {
      if (!semesterMap[subject.semester]) {
        semesterMap[subject.semester] = {
          semester: subject.semester,
          subjects: [],
        };
      }

      semesterMap[subject.semester].subjects.push({
        courseCode: subject.subjectCode,
        courseName: subject.subjectName,
        grade: subject.grade,
        credits: subject.credits,
      });
    });

    return Object.values(semesterMap).sort((a, b) => a.semester - b.semester);
  };

  const configureS3 = () => {
    const requiredVars = [
      "REACT_APP_AWS_ACCESS_KEY_ID",
      "REACT_APP_AWS_SECRET_ACCESS_KEY",
      "REACT_APP_AWS_REGION",
      "REACT_APP_AWS_S3_BUCKET_NAME",
    ];

    const missingVars = requiredVars.filter((varName) => !process.env[varName]);

    if (missingVars.length > 0) {
      throw new Error(
        `Missing environment variables: ${missingVars.join(", ")}`
      );
    }

    return new AWS.S3({
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
      region: process.env.REACT_APP_AWS_REGION,
    });
  };
  const handleUploadToS3 = async () => {
    try {
      // First, generate the PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Create a container to hold all semester marksheets temporarily
      const tempContainer = document.createElement("div");
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      document.body.appendChild(tempContainer);

      // Clone and render all semester marksheets in the temporary container
      for (let i = 0; i < studentDetails.semesters.length; i++) {
        const marksheetTemplate = document.querySelector(".marksheet-template");
        if (!marksheetTemplate) {
          console.error("Marksheet template not found");
          continue;
        }

        const clonedMarksheet = marksheetTemplate.cloneNode(true);
        const semester = studentDetails.semesters[i];

        // Update cloned marksheet details (similar to PDF generation logic)
        clonedMarksheet.querySelector(
          ".student-name"
        ).textContent = `${studentDetails.generalDetails.firstName} ${studentDetails.generalDetails.lastName}`;
        clonedMarksheet.querySelector(".student-uid").textContent =
          studentDetails.uid;
        clonedMarksheet.querySelector(".semester-number").textContent =
          semester.semester;

        // Add to temporary container
        tempContainer.appendChild(clonedMarksheet);
      }

      // Generate canvas for the full marksheet
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "white",
        allowTaint: true,
      });

      // Remove temporary container
      document.body.removeChild(tempContainer);

      // Convert canvas to blob
      const canvasBlob = await (
        await fetch(canvas.toDataURL("image/png"))
      ).blob();

      // Create file from blob
      const marksheetFile = new File(
        [canvasBlob],
        `Marksheet_${studentDetails.uid}_${Date.now()}.pdf`,
        { type: "image/png" }
      );

      // Upload to S3
      const uploadedFileUrl = await uploadToS3(marksheetFile, "marksheets");

      // Set S3 link and QR code link
      setS3Link(uploadedFileUrl);
      setQrCodeLink(uploadedFileUrl);

      // Show success message
      alert("Marksheet uploaded successfully!");
    } catch (error) {
      console.error("S3 Upload Error:", error);
      alert("Failed to upload marksheet. Please try again.");
    }
  };

  const handleDownloadFullMarksheetPDF = async () => {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    try {
      // Create a container to hold all semester marksheets temporarily
      const tempContainer = document.createElement("div");
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      document.body.appendChild(tempContainer);

      // Clone and render all semester marksheets in the temporary container
      for (let i = 0; i < studentDetails.semesters.length; i++) {
        // Clone the marksheet template
        const marksheetTemplate = document.querySelector(".marksheet-template");
        if (!marksheetTemplate) {
          console.error("Marksheet template not found");
          continue;
        }

        const clonedMarksheet = marksheetTemplate.cloneNode(true);

        // Update cloned marksheet with semester-specific data
        const semester = studentDetails.semesters[i];

        // Update header and student details
        clonedMarksheet.querySelector(
          ".student-name"
        ).textContent = `${studentDetails.generalDetails.firstName} ${studentDetails.generalDetails.lastName}`;
        clonedMarksheet.querySelector(".student-uid").textContent =
          studentDetails.uid;
        clonedMarksheet.querySelector(".semester-number").textContent =
          semester.semester;

        // Update grade table
        const tableBody = clonedMarksheet.querySelector("tbody");
        tableBody.innerHTML = semester.subjects
          .map(
            (subject) => `
          <tr>
            <td>${subject.courseCode}</td>
            <td>${subject.courseName}</td>
            <td>${subject.credits}</td>
            <td>${subject.grade}</td>
            <td>${subject.credits}</td>
            <td>${subject.grade}</td>
            <td>${(subject.credits * subject.grade).toFixed(2)}</td>
          </tr>
        `
          )
          .join("");

        // Update SGPA and CGPA
        clonedMarksheet.querySelector(".sgpa").textContent =
          semester.sgpa.toFixed(2);
        clonedMarksheet.querySelector(".cgpa").textContent =
          studentDetails.cgpa[i].toFixed(2);

        // Add to temporary container
        tempContainer.appendChild(clonedMarksheet);
      }

      // Generate PDF for each marksheet
      for (let i = 0; i < tempContainer.children.length; i++) {
        const marksheetElement = tempContainer.children[i];

        const canvas = await html2canvas(marksheetElement, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: "white",
          allowTaint: true,
        });

        // Convert canvas to image
        const imgData = canvas.toDataURL("image/png");

        // Calculate image dimensions to fit A4
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = pageWidth - 20; // Margin
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Add page for each semester
        if (i > 0) {
          pdf.addPage();
        }

        // Add image to PDF with centering
        pdf.addImage(
          imgData,
          "PNG",
          10, // X position
          10, // Y position
          imgWidth,
          imgHeight
        );
      }

      // Remove temporary container
      document.body.removeChild(tempContainer);

      // Save the PDF with all semesters
      pdf.save(`Full_Marksheet_${studentDetails.uid}.pdf`);
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <div
      className={`min-h-screen p-4 ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >
      <StudentNavbar />

      {/* Loading State */}
      {loading && (
        <div
          className={`flex justify-center items-center h-full ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Loading student details...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div
          className={`text-center p-4 rounded ${
            darkMode ? "bg-red-900 text-red-300" : "bg-red-100 text-red-700"
          }`}
        >
          {error}
        </div>
      )}

      {studentDetails && (
        <div ref={fullMarksheetRef}>
          {studentDetails.semesters.map((semester, index) => (
            <div
              key={index}
              data-semester={index}
              className={`max-w-2xl mx-auto p-6 border-2 shadow-lg rounded-lg mb-6 marksheet-template ${
                darkMode
                  ? "bg-gray-800 text-gray-100 border-purple-700"
                  : "bg-white text-gray-900 border-purple-500"
              }`}
            >
              {/* Header Section */}
              <div className="text-center mb-8">
                <h3
                  className={`text-lg font-semibold ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Bharatiya Vidya Bhavan's
                </h3>
                <h2
                  className={`text-2xl font-bold ${
                    darkMode ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  SARDAR PATEL INSTITUTE OF TECHNOLOGY
                </h2>
                <h4
                  className={`text-xl mt-2 ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Semester Grade Card
                </h4>
              </div>

              {/* Student Details */}
              <div className="flex justify-between items-start mb-6">
                <div
                  className={`flex-1 text-sm ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <p>
                    <strong>Name:</strong>{" "}
                    <span className="student-name">
                      {studentDetails.generalDetails.firstName}{" "}
                      {studentDetails.generalDetails.lastName}
                    </span>
                  </p>
                  <p>
                    <strong>Examination:</strong> April 2022 (Regular)
                  </p>
                  <p>
                    <strong>Seat Number (UID):</strong>{" "}
                    <span className="student-uid">{studentDetails.uid}</span>
                  </p>
                  <p>
                    <strong>Semester:</strong>{" "}
                    <span className="semester-number">{semester.semester}</span>
                  </p>
                  <p>
                    <strong>Program:</strong> B.Tech Computer Science and
                    Engineering
                  </p>
                </div>
              </div>

              {/* Grade Table */}
              <table
                className={`w-full mt-6 border-collapse border text-center ${
                  darkMode
                    ? "border-gray-700 text-gray-200"
                    : "border-black text-gray-900"
                }`}
              >
                <thead
                  className={`${
                    darkMode
                      ? "bg-gray-700 text-gray-300"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  <tr>
                    <th className="border">Course Code</th>
                    <th className="border">Course Name</th>
                    <th className="border">Credits</th>
                    <th className="border">Grade</th>
                    <th className="border">Credits</th>
                    <th className="border">Grade</th>
                    <th className="border">Grade Points</th>
                  </tr>
                </thead>
                <tbody>
                  {semester.subjects.map((subject, subIndex) => (
                    <tr
                      key={subIndex}
                      className={`${
                        darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                      }`}
                    >
                      <td className="border">{subject.courseCode}</td>
                      <td className="border">{subject.courseName}</td>
                      <td className="border">{subject.credits}</td>
                      <td className="border">{subject.grade}</td>
                      <td className="border">{subject.credits}</td>
                      <td className="border">{subject.grade}</td>
                      <td className="border">
                        {(subject.credits * subject.grade).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div
                className={`mt-6 text-lg font-medium ${
                  darkMode ? "text-gray-300" : "text-gray-800"
                }`}
              >
                <p>
                  <strong>SGPA:</strong>{" "}
                  <span className="sgpa">{semester.sgpa.toFixed(2)}</span>
                </p>
                <p>
                  <strong>CGPA:</strong>{" "}
                  <span className="cgpa">
                    {studentDetails.cgpa[index].toFixed(2)}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-center">
        <button
          onClick={handleDownloadFullMarksheetPDF}
          className={`mt-4 px-6 py-2 rounded-lg transition duration-300 ${
            darkMode
              ? "bg-purple-700 text-gray-100 hover:bg-purple-600"
              : "bg-purple-500 text-white hover:bg-purple-600"
          }`}
        >
          Download Full Marksheet PDF
        </button>
      </div>
      <div className="text-center">
        <button
          onClick={handleUploadToS3}
          className={`mt-4 px-6 py-2 rounded-lg transition duration-300 ${
            darkMode
              ? "bg-purple-700 text-gray-100 hover:bg-purple-600"
              : "bg-purple-500 text-white hover:bg-purple-600"
          }`}
        >
          Upload to S3
        </button>
      </div>

      {qrCodeLink && (
        <div
          ref={qrCodeRef}
          className={`mt-4 p-4 rounded-lg text-center ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h4
            className={`text-lg font-semibold mb-4 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            QR Code for Marksheet
          </h4>
          <div className="flex items-center justify-center space-x-4">
            {/* QR Code */}
            <QRCodeCanvas value={qrCodeLink} className="justify-center" />

            {/* Clickable Link */}
            <a
              href={qrCodeLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm font-medium underline ${
                darkMode
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-blue-600 hover:text-blue-500"
              }`}
            >
              Open Link
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateMarksheetQR;

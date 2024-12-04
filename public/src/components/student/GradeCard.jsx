import React, { useRef } from "react";
import { useLocation } from "react-router-dom";
import { useDarkMode } from "../../context/themeContext";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import StudentNavbar from "./StudentNavbar";

const GradeCard = () => {
  const location = useLocation();
  const { studentId, name, subjects, grades, semester, sgpa, cgpa } =
    location.state;
  const { darkMode } = useDarkMode();
  let total = 0;
  for (let i = 0; i < semester; i++) {
    total += cgpa[i];
  }
  const average = total / semester;

  const cardRef = useRef(); // Create a ref for the grade card

  // Function to handle PDF download
  const handleDownloadClick = () => {
    html2canvas(cardRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgWidth = 190;
      const pageHeight = pdf.internal.pageSize.height;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if the image height exceeds page height
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("grade_card.pdf");
    });
  };

  return (
    <>
      <StudentNavbar />
      <div
        className={`min-h-screen flex items-center justify-center pt-2 ${
          darkMode ? "bg-gray-800" : "bg-gray-100"
        }`}
      >
        <div className="absolute top-16 right-6">
          <button
            onClick={handleDownloadClick}
            className={`bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 ${
              darkMode ? "bg-purple-600" : "bg-purple-500"
            }`}
          >
            Download PDF
          </button>
        </div>

        <div
          className={`max-w-2xl mx-auto p-6 border-2 border-purple-500 shadow-lg rounded-lg ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
          ref={cardRef} // Attach the ref to the grade card container
        >
          {/* Header Section */}
          <div className="text-center mb-8">
            <h3 className="text-lg font-semibold">Bharatiya Vidya Bhavan's</h3>
            <h2 className="text-2xl font-bold">
              SARDAR PATEL INSTITUTE OF TECHNOLOGY
            </h2>
            <h4 className="text-xl mt-2">Semester Grade Card</h4>
          </div>

          {/* Details and QR code inline */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1 text-sm">
              <p>
                <strong>Name:</strong> {name}{" "}
              </p>
              <p>
                <strong>Examination:</strong> April 2022 (Regular)
              </p>
              <p>
                <strong>Seat Number (UID):</strong> {studentId}{" "}
              </p>
              <p>
                <strong>Semester:</strong> {semester}
              </p>
              <p>
                <strong>Program:</strong> B.Tech Computer Science and
                Engineering
              </p>
            </div>
          </div>

          {/* Grade Table */}
          <table className="w-full mt-6 border-collapse border border-black text-center">
            <thead>
              <tr className={`${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                <th className="border border-black p-2">Course Code</th>
                <th className="border border-black p-2">Course Name</th>
                <th className="border border-black p-2">Course Credits</th>
                <th className="border border-black p-2">Grade</th>
                <th className="border border-black p-2">Credits Earned</th>
                <th className="border border-black p-2">Grade Points</th>
                <th className="border border-black p-2">CGP</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((score, index) => {
                const courseCode = index + 1;
                const courseName = subjects[index];
                const courseCredits = 4;
                const creditsEarned = courseCredits;
                const gradePoints = score;
                const cGp = courseCredits * gradePoints;

                return (
                  <tr
                    key={index}
                    className={`${darkMode ? "bg-gray-700" : "bg-white"}`}
                  >
                    <td className="border border-black p-2">{courseCode}</td>
                    <td className="border border-black p-2">{courseName}</td>
                    <td className="border border-black p-2">{courseCredits}</td>
                    <td className="border border-black p-2">{score}</td>
                    <td className="border border-black p-2">{creditsEarned}</td>
                    <td className="border border-black p-2">{gradePoints}</td>
                    <td className="border border-black p-2">{cGp}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="mt-6 text-lg font-medium">
            <p>
              <strong>SGPA:</strong> {sgpa.toFixed(2)}
            </p>
            <p>
              <strong>CGPA:</strong> {average}
            </p>
          </div>

          {/* Performance boxes */}
          <div
            className={`mt-6 p-4 border-2 border-purple-500 text-center ${
              darkMode ? "bg-gray-700" : "bg-gray-100"
            }`}
          >
            <h4 className="text-xl font-semibold mb-4">
              Semester Performance (SGPA)
            </h4>
            <div className="grid grid-cols-4 gap-4">
              {cgpa.map((value, index) =>
                index < semester ? (
                  <div
                    key={index}
                    className={`border p-2 ${
                      darkMode
                        ? "border-gray-400 bg-gray-800"
                        : "border-black bg-white"
                    }`}
                  >
                    <span className="block font-bold">{index + 1}</span>
                    <p className="text-lg">{value || "--"}</p>
                  </div>
                ) : (
                  <></>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GradeCard;

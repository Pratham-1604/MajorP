// src/components/student/ProvisionalCertificate.jsx

import React from "react";
import jsPDF from "jspdf";

const ProvisionalCertificate = ({ studentDetails, totalCredits, degree }) => {
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(22);
    doc.setTextColor(0, 0, 128); // Dark blue color
    doc.text("Provisional Certificate", 105, 30, { align: "center" });
    
    // Add a border
    doc.setLineWidth(5);
    doc.setDrawColor(0, 0, 128);
    doc.rect(10, 10, 190, 270); // x, y, width, height

    // Add subtitle
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text("This is to certify that", 105, 70, { align: "center" });

    // Student name
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(`${studentDetails?.generalDetails?.firstName} ${studentDetails?.generalDetails?.lastName}`, 105, 90, { align: "center" });

    // UID
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`UID: ${studentDetails?.uid}`, 105, 110, { align: "center" });

    // Course
    doc.text(`Course: ${studentDetails?.academicDetails?.courseEnrolled}`, 105, 130, { align: "center" });

    // Total Credits Earned
    doc.text(`Total Credits Earned: ${totalCredits}`, 105, 150, { align: "center" });

    // Degree
    doc.text(`Degree: ${degree}`, 105, 170, { align: "center" });

    // Award statement
    doc.setFontSize(14);
    doc.text("is hereby awarded this Provisional Certificate.", 105, 200, { align: "center" });

    // Footer
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Date: " + new Date().toLocaleDateString(), 105, 240, { align: "center" });
    
    // Save the PDF
    doc.save("provisional_certificate.pdf");
  };

  return (
    <div
      className="w-full max-w-2xl mx-auto p-6 border border-gray-300 rounded-lg shadow-lg text-center"
    >
      <h1 className="text-3xl font-bold mb-4">Provisional Certificate</h1>
      <h2 className="text-xl font-semibold mb-2">This is to certify that</h2>
      <h3 className="text-2xl font-bold mb-4">
        {studentDetails?.generalDetails?.firstName} {studentDetails?.generalDetails?.lastName}
      </h3>
      <p className="mb-2">UID: <strong>{studentDetails?.uid}</strong></p>
      <p className="mb-2">Course: <strong>{studentDetails?.academicDetails?.courseEnrolled}</strong></p>
      <p className="mb-2">Total Credits Earned: <strong>{totalCredits}</strong></p>
      <p className="mb-4">Degree: <strong>{degree}</strong></p>
      <p className="mb-6">is hereby awarded this Provisional Certificate.</p>
      <button
        onClick={handleDownloadPDF}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Download Certificate as PDF
      </button>
    </div>
  );
};

export default ProvisionalCertificate;
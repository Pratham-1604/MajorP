import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

const StudentCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const studentId = localStorage.getItem("id");

    if (!token || !studentId) {
      navigate("/login");
      return;
    }

    const fetchStudentCertificates = async () => {
      try {
        // Fetch student data to get certificates (assumed to be an array of certificates)
        const studentResponse = await axios.get(
          `http://localhost:3001/students/${studentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const studentCertificates = studentResponse.data.certificates || [];
        setCertificates(studentCertificates); // Set the fetched certificate data
      } catch (err) {
        setError(
          "Error fetching certificates: " +
            (err.response?.data?.message || "Unknown error")
        );
        console.error("Error fetching certificates:", err);
      }
    };

    fetchStudentCertificates();
  }, [navigate]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6 text-center">Your Certificates</h1>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.length > 0 ? (
          certificates.map((certificate, index) => (
            <li
              key={index}
              className="border border-gray-200 rounded-lg shadow-lg p-4 transition duration-300 hover:shadow-xl"
            >
              <div className="block">
                <h3 className="text-2xl font-bold mb-2">
                  Certificate: {certificate.title || "N/A"}
                </h3>
                <p className="text-gray-700 mb-2">
                  <strong>Issued By:</strong> {certificate.issuedBy || "N/A"}
                </p>
                <p className="text-gray-500 mb-2">
                  <strong>Issued On:</strong> {certificate.issuedOn || "N/A"}
                </p>
                <Link
                  to={certificate.link || "#"}
                  target="_blank"
                  className="text-blue-500 underline"
                >
                  View Certificate
                </Link>
              </div>
            </li>
          ))
        ) : (
          <p className="text-center text-gray-600">
            You do not have any certificates yet.
          </p>
        )}
      </ul>
    </div>
  );
};

export default StudentCertificates;

import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import StudentNavbar from "./StudentNavbar"; // Ensure this is the correct import for your Navbar component

const StudentProfile = () => {
  const [student, setStudent] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [studentData, setStudentData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:3001/students/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudent(response.data);
        setStudentData(response.data);
      } catch (err) {
        setError("Error fetching profile: " + (err.response?.data?.message || "Unknown error"));
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleEdit = () => setIsEditing(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentData({ ...studentData, [name]: value });
  };

  const handleSave = async () => {
    const token = localStorage.getItem("authToken");
    try {
      await axios.put("http://localhost:3001/students/profile", studentData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsEditing(false);
      alert("Profile updated successfully");
    } catch (err) {
      setError("Error updating profile: " + (err.response?.data?.message || "Unknown error"));
    }
  };

  if (error) return <div>{error}</div>;

  if (!student) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <StudentNavbar /> {/* Add the StudentNavbar here */}

      <div className="container mx-auto p-6 mt-10 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6">Student Profile</h1>
        {error && <p className="text-red-500">{error}</p>}

        <div className="space-y-4">
          <div>
            <label className="block text-lg font-medium">UID</label>
            <p>{student.uid}</p>
          </div>
          <div>
            <label className="block text-lg font-medium">First Name</label>
            <input
              type="text"
              name="student_firstname"
              value={studentData.student_firstname}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full p-2 border rounded-md ${isEditing ? "bg-gray-100" : "bg-gray-200"}`}
            />
          </div>
          <div>
            <label className="block text-lg font-medium">Last Name</label>
            <input
              type="text"
              name="student_lastname"
              value={studentData.student_lastname}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full p-2 border rounded-md ${isEditing ? "bg-gray-100" : "bg-gray-200"}`}
            />
          </div>
          <div>
            <label className="block text-lg font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={studentData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full p-2 border rounded-md ${isEditing ? "bg-gray-100" : "bg-gray-200"}`}
            />
          </div>
          <div>
            <label className="block text-lg font-medium">DOB</label>
            <input
              type="date"
              name="DOB"
              value={new Date(studentData.DOB).toISOString().split('T')[0]}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full p-2 border rounded-md ${isEditing ? "bg-gray-100" : "bg-gray-200"}`}
            />
          </div>
          <div>
            <label className="block text-lg font-medium">Address</label>
            <input
              type="text"
              name="address"
              value={studentData.address}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full p-2 border rounded-md ${isEditing ? "bg-gray-100" : "bg-gray-200"}`}
            />
          </div>
          <div>
            <label className="block text-lg font-medium">Institution</label>
            <input
              type="text"
              name="institution"
              value={studentData.institution.institution_name}
              onChange={handleInputChange}
              disabled
              className="w-full p-2 border rounded-md bg-gray-200"
            />
          </div>
          
          <div className="mt-4 flex gap-4">
            {isEditing ? (
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            ) : (
              <button
                onClick={handleEdit}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;

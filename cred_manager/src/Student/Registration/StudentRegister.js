import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const StudentRegistration = () => {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState({
    uid: "",
    student_firstname: "",
    student_lastname: "",
    email: "",
    DOB: "",
    address: "",
    password: "",
    institution: "",
  });
  const [institutions, setInstitutions] = useState([]);
  const [error, setError] = useState(null);

  // Fetch list of institutions on component mount
  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const response = await axios.get("http://localhost:3001/institutions"); // Adjust this URL to match your backend
        console.log(response.data)
        setInstitutions(response.data); // Assuming the response contains an array of institutions
      } catch (err) {
        setError("Error fetching institutions: " + (err.response?.data?.message || "Unknown error"));
      }
    };
    fetchInstitutions();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentData({ ...studentData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/students/register", studentData);
      alert("Registration successful!");
      navigate("/");
    } catch (err) {
      setError("Error registering student: " + (err.response?.data?.message || "Unknown error"));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <form
        onSubmit={handleSubmit}
        className="bg-darkbg border border-white rounded-xl flex flex-col justify-center items-center text-white py-8 px-16"
      >
        <h1 className="cursor-default text-3xl my-3 px-6 font-bold">Student Registration</h1>
        {error && <p className="text-red-500">{error}</p>}

        <div className="m-2 w-full border-b-2 border-gray-500">
          <label htmlFor="uid">UID : </label>
          <input
            onChange={handleInputChange}
            type="text"
            name="uid"
            value={studentData.uid}
            placeholder="Student ID"
            className="bg-darkbg outline-none text mx-2"
          />
        </div>

        <div className="m-2 w-full border-b-2 border-gray-500">
          <label htmlFor="student_firstname">First Name : </label>
          <input
            onChange={handleInputChange}
            type="text"
            name="student_firstname"
            value={studentData.student_firstname}
            placeholder="First Name"
            required
            className="bg-darkbg outline-none text mx-2"
          />
        </div>

        <div className="m-2 w-full border-b-2 border-gray-500">
          <label htmlFor="student_lastname">Last Name : </label>
          <input
            onChange={handleInputChange}
            type="text"
            name="student_lastname"
            value={studentData.student_lastname}
            placeholder="Last Name"
            required
            className="bg-darkbg outline-none text mx-2"
          />
        </div>

        <div className="m-2 w-full border-b-2 border-gray-500">
          <label htmlFor="email">Email : </label>
          <input
            onChange={handleInputChange}
            type="email"
            name="email"
            value={studentData.email}
            placeholder="Email"
            required
            className="bg-darkbg outline-none text mx-2"
          />
        </div>

        <div className="m-2 w-full border-b-2 border-gray-500">
          <label htmlFor="DOB">Date of Birth : </label>
          <input
            onChange={handleInputChange}
            type="date"
            name="DOB"
            value={studentData.DOB}
            required
            className="bg-darkbg outline-none text mx-2"
          />
        </div>

        <div className="m-2 w-full border-b-2 border-gray-500">
          <label htmlFor="address">Address : </label>
          <input
            onChange={handleInputChange}
            type="text"
            name="address"
            value={studentData.address}
            placeholder="Address"
            className="bg-darkbg outline-none text mx-2"
          />
        </div>

        <div className="m-2 w-full border-b-2 border-gray-500">
          <label htmlFor="password">Password : </label>
          <input
            onChange={handleInputChange}
            type="password"
            name="password"
            value={studentData.password}
            placeholder="Password"
            required
            className="bg-darkbg outline-none text mx-2"
          />
        </div>

        <div className="m-2 w-full border-b-2 border-gray-500">
          <label htmlFor="institution">Institution : </label>
          <select
            onChange={handleInputChange}
            name="institution"
            value={studentData.institution}
            required
            className="bg-darkbg outline-none text mx-2"
          >
            <option value="">Select an Institution</option>
            {institutions.map((institution) => (
              <option key={institution._id} value={institution._id}>
                {institution.institution_name} {/* Assuming institutions have 'id' and 'name' */}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="text-white rounded-lg mx-6 py-3 px-5 cursor-pointer shadow-2xl hover:shadow-none border-lightbg hover:border-gray-100 bg-lightbg transition-all duration-250 ease-in-out w-max"
        >
          Register
        </button>
        <Link
          to="/"
          className="text-white text-center mx-6 py-3 px-5 cursor-pointer shadow-2xl hover:shadow-none border-lightbg hover:border-gray-100 bg-lightbg transition-all duration-250 ease-in-out w-max mt-4"
        >
          Already have an account? Login here
        </Link>
      </form>
    </div>
  );
};

export default StudentRegistration;

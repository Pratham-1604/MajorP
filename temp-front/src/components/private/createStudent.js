import React, { useState } from "react";
import axios from "axios";
import { useDarkMode } from "../../context/themeContext"; // Import useDarkMode hook
import { api } from "../utilities";

const CreateStudent = () => {
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const { darkMode } = useDarkMode();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${api}/private/createStudent`, {
        name,
      });
      setStudentId(response.data.studentId);
    } catch (error) {
      console.error("Error creating student:", error);
    }
  };

  return (
    <div
      className={`min-h-screen flex ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
      }`}
    >
      <div className="container mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-4">Create Student</h2>
        <form onSubmit={handleSubmit} className="mb-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter student name"
            className="border rounded-md p-2 w-full"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-2"
          >
            Create
          </button>
        </form>
        {studentId && <p>Student ID: {studentId}</p>}
      </div>
    </div>
  );
};

export default CreateStudent;

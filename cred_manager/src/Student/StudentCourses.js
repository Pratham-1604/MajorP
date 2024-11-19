import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

const StudentCourses = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const studentId = localStorage.getItem("id");

    if (!token || !studentId) {
      navigate("/login");
      return;
    }

    const fetchStudentCourses = async () => {
      try {
        // Fetch student data to get the courses_enrolled field
        const studentResponse = await axios.get(
          `http://localhost:3001/students/${studentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const coursesEnrolled = studentResponse.data.courses_enrolled;
        const institutionId = studentResponse.data.institutionId; // Assuming you have the institutionId in the student model

        // Fetch all courses in the institution
        const coursesResponse = await axios.get(
          `http://localhost:3001/courses/institute/${institutionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Filter courses based on courses_enrolled array
        const enrolledCourses = coursesResponse.data.filter((course) =>
          coursesEnrolled.includes(course._id)
        );
        setCourses(enrolledCourses); // Set the fetched course data
      } catch (err) {
        setError(
          "Error fetching enrolled courses: " +
            (err.response?.data?.message || "Unknown error")
        );
        console.error("Error fetching enrolled courses:", err);
      }
    };

    fetchStudentCourses();
  }, [navigate]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Your Enrolled Courses
      </h1>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length > 0 ? (
          courses.map((course) => (
            <li
              key={course._id}
              className="border border-gray-200 rounded-lg shadow-lg p-4 transition duration-300 hover:shadow-xl"
            >
              <Link to={`/courses/${course._id}`} className="block">
                <h3 className="text-2xl font-bold mb-2">{course.course_name}</h3>
                <p className="text-gray-700 mb-2">
                  {course.course_description}
                </p>
                <p className="text-gray-500">
                  <strong>Credits:</strong> {course.course_credits}
                </p>
              </Link>
            </li>
          ))
        ) : (
          <p className="text-center text-gray-600">
            You are not enrolled in any courses.
          </p>
        )}
      </ul>
    </div>
  );
};

export default StudentCourses;

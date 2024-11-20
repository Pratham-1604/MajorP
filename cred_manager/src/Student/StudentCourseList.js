import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import StudentNavbar from './StudentNavbar';

const StudentCourseList = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    // Check for authentication
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch all courses
    const fetchAllCourses = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/courses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCourses(response.data);
      } catch (err) {
        setError('Error fetching courses: ' + (err.response?.data?.message || 'Unknown error'));
        console.error('Error fetching courses:', err);
      }
    };

    fetchAllCourses();
  }, [navigate]);

  return (
    <div>
      <div className="fixed w-full">
        <StudentNavbar />
      </div>
      <div className="container mx-auto p-4 pt-[120px]"> {/* Added padding-top to content */}
        <h1 className="text-4xl font-bold mb-6 text-center">Available Courses</h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.length > 0 ? (
            courses.map((course) => (
              <li key={course._id} className="border border-gray-200 rounded-lg shadow-lg p-4 transition duration-300 hover:shadow-xl">
                <Link to={`/student_course_details/${course._id}`} className="block">
                  <h3 className="text-2xl font-bold mb-2">{course.course_name}</h3>
                  <p className="text-gray-700 mb-2">{course.course_description}</p>
                  <p className="text-gray-500"><strong>Credits:</strong> {course.course_credits}</p>
                  <p className="text-gray-500"><strong>Institution:</strong> {course.institution_name}</p>
                </Link>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-600">No courses available at the moment.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default StudentCourseList;

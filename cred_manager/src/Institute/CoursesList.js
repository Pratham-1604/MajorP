import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CoursesList = () => {
  const [courses, setCourses] = useState([]);
  const [institution, setInstitution] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const institutionId = localStorage.getItem('institutionId');

    // Check for authentication
    if (!token || !institutionId) {
      navigate('/login');
      return;
    }

    // Fetch institution data
    const fetchInstitutionData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/institutions/${institutionId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setInstitution(response.data);
      } catch (err) {
        setError('Error fetching institution data: ' + (err.response?.data?.message || 'Unknown error'));
        console.error('Error fetching institution data:', err);
      }
    };

    const fetchCourses = async () => {
    try {
        const response = await axios.get(`http://localhost:3001/courses/institute/${institutionId}`);
        setCourses(response.data);
    } catch (err) {
        setError('Error fetching courses: ' + (err.response?.data?.message || err));
        console.error('Error fetching courses:', err);
    }
    };


    fetchInstitutionData();
    fetchCourses();
  }, [navigate]);

  return (
    

<div className="container mx-auto p-4">
    <h1 className="text-4xl font-bold mb-6 text-center">All Courses</h1>
    {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length > 0 ? (
            courses.map((course) => (
                <li key={course._id} className="border border-gray-200 rounded-lg shadow-lg p-4 transition duration-300 hover:shadow-xl">
                    <Link to={`/courses/${course._id}`} className="block">
                        <h3 className="text-2xl font-bold mb-2">{course.course_name}</h3>
                        <p className="text-gray-700 mb-2">{course.course_description}</p>
                        <p className="text-gray-500"><strong>Credits:</strong> {course.course_credits}</p>
                    </Link>
                </li>
            ))
        ) : (
            <p className="text-center text-gray-600">No courses available for this institution.</p>
        )}
    </ul>
</div>


  );
};

// Exporting the component
export default CoursesList;

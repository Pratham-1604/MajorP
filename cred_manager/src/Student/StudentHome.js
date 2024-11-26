import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import StudentNavbar from './StudentNavbar';

export default function HomePage() {
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStudent = async () => {
            const token = localStorage.getItem('authToken');
            const studentId = localStorage.getItem('id');
            if (!token || !studentId) {
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:3001/students/${studentId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setStudent(response.data);

                // Fetch the courses that the student is enrolled in
                const courseResponse = await axios.get(`http://localhost:3001/courses`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCourses(courseResponse.data);
            } 
            catch (err) {
                if (err.response?.status === 400) { // Check if the error is due to an invalid token
                    console.error('Invalid token, redirecting to /');
                    // Clear token logic (if token is stored in localStorage or cookies)
                    localStorage.clear(); // Adjust based on where you store the token
                    // Redirect to login or home page
                    window.location.href = '/';
                } else {
                    setError('Error fetching student data or courses: ' + (err.response?.data?.message || 'Unknown error'));
                    console.error('Error:', err);
                }
            }
        };

        fetchStudent();
    }, [navigate]);

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    if (!student) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <div className="fixed w-full">
                <StudentNavbar />
            </div>
            <div className="container mx-auto p-4 pt-[120px]">
                <h1 className="text-4xl font-bold mb-6 text-center">All Courses</h1>
                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.length > 0 ? (
                        courses.map((course) => (
                            <li key={course._id} className="border border-gray-200 rounded-lg shadow-lg p-4 transition duration-300 hover:shadow-xl">
                                <Link to={`/student_course_details/${course._id}`} className="block">
                                    <h3 className="text-2xl font-bold mb-2">{course.course_name}</h3>
                                    <p className="text-gray-700 mb-2">{course.course_description}</p>
                                    <p className="text-gray-500"><strong>Credits:</strong> {course.course_credits}</p>
                                </Link>
                            </li>
                        ))
                    ) : (
                        <p className="text-center text-gray-600">No courses available for this student.</p>
                    )}
                </ul>
            </div>
        </div>
    );
}

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import StudentNavbar from "./StudentNavbar";

const CourseDetails = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [error, setError] = useState(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        const studentId = localStorage.getItem("id"); // Assuming studentId is saved in localStorage

        // Check for authentication
        if (!token) {
            navigate("/login");
            return;
        }

        // Fetch course details
        const fetchCourseDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/courses/${courseId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCourse(response.data);
            } catch (err) {
                setError(
                    "Error fetching course details: " + (err.response?.data?.message || "Unknown error")
                );
                console.error("Error fetching course details:", err);
            }
        };

        // Fetch the student's enrolled courses to check if the course is already in the list
        const fetchStudentEnrollmentStatus = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/students/${studentId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const enrolledCourses = response.data.courses_enrolled;
                console.log(courseId);
                console.log(enrolledCourses); // Assuming `courses_enrolled` is an array of course IDs
                const isAlreadyEnrolled = enrolledCourses.some(course => course._id.toString() === courseId);
                setIsEnrolled(isAlreadyEnrolled);
            } catch (err) {
                console.error("Error fetching student data:", err);
            }
        };

        fetchCourseDetails();
        fetchStudentEnrollmentStatus();
    }, [courseId, navigate]);

    const handleEnroll = async () => {
        const token = localStorage.getItem("authToken");
        const studentId = localStorage.getItem("id"); // Assuming studentId is saved in localStorage

        try {
            await axios.post(
                `http://localhost:3001/courses/enroll/${courseId}`,
                { studentId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setIsEnrolled(true);
            alert("You have successfully enrolled in the course!");
        } catch (err) {
            setError("Error enrolling in course: " + (err.response?.data?.message || "Unknown error"));
        }
    };

    if (error) {
        return (
            <div>
                <div className="fixed w-full">
                    <StudentNavbar />
                </div>
                <div className="container mx-auto p-4 pt-[120px]">
                    <p className="text-red-500 text-center">{error}</p>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div>
                <div className="fixed w-full">
                    <StudentNavbar />
                </div>
                <div className="container mx-auto p-4 pt-[120px]">
                    <p className="text-center text-gray-600">Loading course details...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="fixed w-full">
                <StudentNavbar />
            </div>
            <div className="container mx-auto p-6 flex flex-col lg:flex-row gap-6 pt-[120px]">
                {/* Left Section */}
                <div className="flex-1">
                    <h1 className="text-4xl font-bold mb-4">{course.course_name}</h1>
                    <h2 className="text-lg text-gray-700 mb-4">{course.course_description}</h2>
                    <p className="text-gray-600 mb-2">
                        <strong>Credits:</strong> {course.course_credits}
                    </p>
                    <p className="text-gray-600">
                        <strong>Enrolled Students:</strong> {course.students_enrolled.length || 0}
                    </p>
                    <button
                        onClick={handleEnroll}
                        className={`mt-4 px-6 py-2 ${isEnrolled ? 'bg-green-600 cursor-not-allowed' : 'bg-blue-600'} text-white rounded-lg ${isEnrolled ? '' : 'hover:bg-blue-700'}`}
                        disabled={isEnrolled}
                    >
                        {isEnrolled ? 'Enrolled' : 'Enroll Now'}
                    </button>
                </div>

                {/* Right Section */}
                <div className="flex-1 flex justify-center items-center">
                    <img
                        src={course.imgsrc}
                        alt={course.course_name}
                        className="rounded-lg shadow-lg w-full lg:w-3/4"
                    />
                </div>
            </div>
        </div>
    );
};

export default CourseDetails;

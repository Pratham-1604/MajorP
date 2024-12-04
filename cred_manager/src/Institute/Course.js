import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Link
} from "react-router-dom";
import axios from 'axios';
import { server_url } from '../Utilities';
import Navbar from './Navbar';


const Course = () => {

    const navigate = useNavigate();

    // Course Credentials
    const { courseId } = useParams();
    const [courseData, setCourseData] = useState("");
    const [Course_name, setCourse_name] = useState("");
    const [Course_credit, setCourse_credit] = useState("");
    const [img_add, setimg_add] = useState("");
    const [grades, setGrades] = useState({}); // Track grades for each student


    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await axios.get(`${server_url}/courses/${courseId}`);
                setCourseData(response.data);
            } catch (error) {
                console.error('Error fetching course:', error);
            }
        };

        fetchCourse();
    }, [courseId]);

    const [tabbutton, settabbutton] = useState(0);
    const [stud_hover, setStud_hover] = useState(-1);

    // Instructor Credentials
    const [InstructorName, setInstructorName] = useState("");
    const [InstructorLastName, setInstructorLastName] = useState("");
    const [InstructorEmail, setInstructorEmail] = useState("");

    // Handle grade input change
    const handleGradeChange = (studentId, value) => {

        setGrades((prev) => ({
            ...prev,
            [studentId]: value, // Update grade for the specific student
        }));
    };

    const handleCourseButtonClick = () => {
        settabbutton(3);
        if (courseData) {
            setCourse_name(courseData.course_name);
            setCourse_credit(courseData.course_credits);
            setimg_add(courseData.imgsrc);
        }
    };
    const handleInstButtonClick = () => {
        settabbutton(4);
        if (courseData) {
            setCourse_name(courseData.course_name);
            setCourse_credit(courseData.course_credits);
            setimg_add(courseData.imgsrc);
        }
        if (courseData && courseData.instructors && courseData.instructors?.length > 0) {
            setInstructorName(courseData.instructors[0].instructor_firstname);
            setInstructorLastName(courseData.instructors[0].instructor_lastname);
            setInstructorEmail(courseData.instructors[0].email);
        }
    };

    const Coursesubmit = async (e) => {
        e.preventDefault();
        const updateCourseData = {
            course_name: Course_name,
            course_credits: Course_credit,
            imgsrc: img_add,
        }
        try {
            await axios.put(`${server_url}/courses/${courseId}`, updateCourseData);
        } catch (error) {
            console.error('Error updating course:', error);
        }
        settabbutton(0);
    };

    const Instsubmit = async (e) => {
        e.preventDefault();
        const updateCourseData = {
            course_name: Course_name,
            course_credits: Course_credit,
            imgsrc: img_add,
        }
        const updateInstData = {
            instructor_firstname: InstructorName,
            instructor_lastname: InstructorLastName,
            email: InstructorEmail,
        }
        if (courseData.instructors[0]) {
            try {
                await axios.put(`${server_url}/instructors/${courseData.instructors[0]._id}`, updateInstData);
            } catch (error) {
                console.error('Error updating course:', error);
            }
        } else {
            try {
                const response = await axios.post(`${server_url}/instructors/`, updateInstData);
                // alert(response.data._id);
                updateCourseData.instructors = [response.data._id];
            } catch (error) {
                console.error('Error updating course:', error);
                alert();
            }
        }

        try {
            await axios.put(`${server_url}/courses/${courseId}`, updateCourseData);
        } catch (error) {
            console.error('Error updating course:', error);
        }
        settabbutton(0);
        navigate(`/courses/${courseId}`)
    };

    const handleStudentClick = async () => {
        courseData.students_enrolled.map(async (stud) => {
            const res = await axios.get(`${server_url}/grades/${stud._id}/${courseId}`);
            console.log(res.data);
            handleGradeChange(stud._id, res.data.grade);
        });
    }

    // Handle grade assignment
    const handleAssignGrades = async (studentId) => {
        console.log(studentId, courseId);
        const grade = grades[studentId]; // Get the grade for the specific student
        if (!grade) {
            alert('Please enter a grade before assigning.');
            return;
        }

        try {
            const token = localStorage.getItem('authToken'); // Replace with appropriate token retrieval logic
            const response = await axios.post(
                `http://localhost:3001/grades/assign_grades`,
                {
                    student_id: studentId,
                    course_id: courseId,
                    grade,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert(`Grade ${grade} assigned successfully for Student ID: ${studentId}`);
        } catch (err) {
            console.error('Error assigning grade:', err);
            alert(`Error assigning grade: ${err.response?.data?.message || 'Unknown error'}`);
        }
    };



    if (!courseData) {
        return <div>Course not found</div>;
    } else {
        return (
            <div>
                <div className="fixed w-full">
                    <Navbar />
                </div>

                <div className="bg-darkbg text-white px-10 py-3 pt-[105px] flex flex-row w-full h-[100vh]">
                    <div className='flex flex-col items-center justify-center w-[30vw] gap-5' >

                        <div className='bg-[#323253] p-4 px-16 rounded-2xl h-[30%] w-[95%] flex flex-col' >
                            <h1 className='font-bold text-2xl m-1'>Course Details</h1>
                            <h2 className='font-bold text-xl m-1'>Students Enrolled: {courseData.students_enrolled?.length}</h2>
                            <h2 className='font-bold text-xl m-1'>Course Credits: {courseData.course_credits}</h2>
                        </div>

                        <div className='bg-[#323253] p-10 px-16 rounded-2xl h-[60%] w-[95%] flex flex-col gap-3' >

                            <Link className={tabbutton === 0 ? "cursor-pointer border bg-lightbg rounded-lg px-3 py-2 font-bold text-xl transform scale-[1.05] translate-x-[7px]" : "cursor-pointer border hover:bg-lightbg hover:transform hover:scale-[1.05] hover:translate-x-[7px] rounded-lg px-3 py-2 font-bold text-xl transition-all duration-250 ease-in-out"} onClick={() => settabbutton(0)}>Course</Link>

                            <Link className={tabbutton === 1 ? "cursor-pointer border bg-lightbg rounded-lg px-3 py-2 font-bold text-xl transform scale-[1.05] translate-x-[7px]" : "cursor-pointer border hover:bg-lightbg hover:transform hover:scale-[1.05] hover:translate-x-[7px] rounded-lg px-3 py-2 font-bold text-xl transition-all duration-250 ease-in-out"} onClick={() => settabbutton(1)}>Instructor Profile</Link>

                            <Link className={tabbutton === 2 ? "cursor-pointer border bg-lightbg rounded-lg px-3 py-2 font-bold text-xl transform scale-[1.05] translate-x-[7px]" : "cursor-pointer border hover:bg-lightbg hover:transform hover:scale-[1.05] hover:translate-x-[7px] rounded-lg px-3 py-2 font-bold text-xl transition-all duration-250 ease-in-out"} onClick={() => {handleStudentClick(); settabbutton(2);}}>Students List</Link>

                            <Link className={tabbutton === 3 ? "cursor-pointer border bg-lightbg rounded-lg px-3 py-2 font-bold text-xl transform scale-[1.05] translate-x-[7px]" : "cursor-pointer border hover:bg-lightbg hover:transform hover:scale-[1.05] hover:translate-x-[7px] rounded-lg px-3 py-2 font-bold text-xl transition-all duration-250 ease-in-out"} onClick={handleCourseButtonClick} >Edit Course</Link>

                            <Link className={tabbutton === 4 ? "cursor-pointer border bg-lightbg rounded-lg px-3 py-2 font-bold text-xl transform scale-[1.05] translate-x-[7px]" : "cursor-pointer border hover:bg-lightbg hover:transform hover:scale-[1.05] hover:translate-x-[7px] rounded-lg px-3 py-2 font-bold text-xl transition-all duration-250 ease-in-out"} onClick={handleInstButtonClick} >Edit Instructor</Link>

                        </div>

                    </div>

                    <div className='flex flex-col items-center justify-center w-[70vw] gap-5' >

                        <div className=" bg-[#323253] p-4 px-16 rounded-2xl h-[20%] w-[98%] flex items-center gap-5">

                            <div className=" h-24 w-24 rounded-full bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url(${courseData.institution.logo})` }} />

                            <div className='w-[85%]'>
                                <h1 className='font-bold text-2xl m-1' >{courseData.course_name + ", " + courseData.institution.institution_name}</h1>

                                {courseData.instructors.map((instructor, index) => (
                                    <h1 className='font-bold text-xl m-1' key={index}>Prof. {instructor.instructor_firstname} {instructor.instructor_lastname}</h1>
                                ))}

                            </div>

                        </div>

                        <div className='h-[70%] w-[98%]'>

                            {/* Course Image */}
                            <div className={tabbutton === 0 ? "h-[100%] w-[100%] rounded-xl bg-cover bg-center bg-no-repeat" : "hidden"} style={{ backgroundImage: `url(${courseData.imgsrc})` }} >
                            </div>

                            {/* Instructor's Profile part */}
                            <div className={tabbutton === 1 ? "h-[100%] w-[100%] bg-[#323253] flex flex-col p-4 px-16 rounded-xl overflow-y-auto" : "hidden"} >

                                <div className='flex flex-row items-center'>
                                    <i class="ri-user-fill text-9xl"></i>

                                    <div>
                                        {courseData.instructors.map((instructor, index) => (
                                            <h1 className='font-bold text-xl m-1' key={index}>{instructor.instructor_firstname} {instructor.instructor_lastname}</h1>
                                        ))}

                                        {courseData.instructors.map((instructor, index) => (
                                            <h1 className='font-bold text-xl m-1' key={index}>{instructor.email}</h1>
                                        ))}

                                        {courseData.instructors.map((instructor, index) => (
                                            <h1 className='font-bold text-xl m-1' key={index}>{instructor.DOB}</h1>
                                        ))}
                                    </div>

                                </div>

                                <h1 className='font-bold text-2xl m-1' >Institute: {courseData.institution.institution_name}</h1>
                                <h1 className='font-bold text-2xl m-1' >Address: {courseData.institution.address}</h1>
                                <h1 className='font-bold text-2xl m-1' >Education:</h1>

                                {courseData.instructors.map((instructor, index) => (
                                    instructor.education.map((edu, ind) => (
                                        <div className="flex flex-row ml-8 text-xl">
                                            <i class="ri-graduation-cap-fill m-1"></i>
                                            <h1 className='font-bold m-1' >{edu}</h1>
                                        </div>
                                    ))
                                ))}

                            </div>

                            {/* Students List */}
                            <div className={tabbutton === 2 ? "h-[100%] w-[100%] bg-[#323253] flex flex-col gap-3 rounded-xl p-4 overflow-y-auto" : "hidden"} 
                        >
                                {courseData.students_enrolled.map((stud) => (
                                    <div
                                        key={stud._id}
                                        onMouseEnter={() => setStud_hover(stud._id)}
                                        onMouseLeave={() => setStud_hover(-1)}
                                        className="text-white w-[90%] flex gap-4 bg-lightbg items-center text-center rounded-lg cursor-pointer mx-4 py-5 pl-2 pr-5 transition-all duration-250 ease-in-out hover:text-black hover:relative hover:bg-white hover:font-bold hover:transform hover:scale-[1.2] hover:translate-x-[40px] hover:translate-y-[-5px]"
                                    >
                                        <h1 className='w-[50%]' >{stud.student_firstname.concat(" ", stud.student_lastname)}</h1>
                                        <h1 className="transition-all duration-100 ease-in-out">
                                            Credits Earned: {((Number(grades[stud._id]) / 10) * Number(courseData.course_credits)).toFixed(0)}
                                            /{courseData.course_credits}
                                        </h1>

                                        {/* Input for Grades */}
                                        <input
                                            type="number"
                                            min="0"
                                            max="10"
                                            placeholder="Grade"
                                            value={grades[stud._id] || '0'}
                                            onChange={(e) => handleGradeChange(stud._id, e.target.value)}
                                            className="w-20 px-2 py-1 border rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />

                                        {/* Assign Grades Button */}
                                        <button
                                            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200"
                                            onClick={() => handleAssignGrades(stud._id)}
                                        >
                                            Assign Grades
                                        </button>
                                    </div>
                                ))}
                            </div>




                            {/* Edit Course */}
                            <div className={tabbutton === 3 ? "h-[100%] w-[100%] bg-[#323253] flex flex-col gap-3 rounded-xl p-4 overflow-y-auto" : "hidden"}>
                                <form onSubmit={Coursesubmit}
                                    className='border border-white rounded-xl flex flex-col justify-center items-center py-2 px-8' >
                                    <h1 className='cursor-default text-2xl my-1 font-bold' >Edit Course</h1>

                                    <div className="m-2 w-[70%] border-b-2 border-gray-500">
                                        <label className='font-bold' htmlFor="course_name">Course Name : </label>
                                        <input onChange={(e) => setCourse_name(e.target.value)} type="text"
                                            value={Course_name} autoComplete="on" className="bg-[#323253] outline-none mx-2 w-[70%]" />
                                    </div>

                                    <div className="m-2 w-[70%] border-b-2 border-gray-500">
                                        <label className='font-bold' htmlFor="course_credit">Course Credit : </label>
                                        <input onChange={(e) => setCourse_credit(e.target.value)} type="number"
                                            value={Course_credit} autoComplete="on" className="bg-[#323253] outline-none mx-2 no-spinner" />
                                    </div>

                                    <div className="m-2 w-[70%] border-b-2 border-gray-500">
                                        <label className='font-bold' htmlFor="course_name">Course Thumbnail : </label>
                                        <input onChange={(e) => setimg_add(e.target.value)} type="text"
                                            value={img_add} autoComplete="on" className="bg-[#323253] outline-none mx-2 w-[70%]" />
                                    </div>

                                    <button className="text-white rounded-lg mx-6 py-2 px-5 cursor-pointer border border-[#323253] hover:border hover:border-white hover:bg-lightbg transition-all duration-250 ease-in-out w-max" type="submit">
                                        Submit
                                    </button>

                                </form>
                            </div>

                            {/* Edit instructor */}
                            <div className={tabbutton === 4 ? "h-[100%] w-[100%] bg-[#323253] flex flex-col gap-3 rounded-xl p-4 overflow-y-auto" : "hidden"}>
                                <form onSubmit={Instsubmit}
                                    className='border border-white rounded-xl flex flex-col justify-center items-center py-2 px-8' >

                                    <h1 className='cursor-default text-2xl my-1 font-bold' >Edit Instructor Details</h1>

                                    <div className="m-2 w-[70%] border-b-2 border-gray-500">
                                        <label className='font-bold' htmlFor="firstname">Instructor's Firstname : </label>
                                        <input onChange={(e) => setInstructorName(e.target.value)} type="text"
                                            value={InstructorName} autoComplete="on" className="bg-[#323253] outline-none mx-2" />
                                    </div>

                                    <div className="m-2 w-[70%] border-b-2 border-gray-500">
                                        <label className='font-bold' htmlFor="lastname">Instructor's Lastname : </label>
                                        <input onChange={(e) => setInstructorLastName(e.target.value)} type="text"
                                            value={InstructorLastName} autoComplete="on" className="bg-[#323253] outline-none mx-2" />
                                    </div>

                                    <div className="m-2 w-[70%] border-b-2 border-gray-500">
                                        <label className='font-bold' htmlFor="email">Email : </label>
                                        <input onChange={(e) => setInstructorEmail(e.target.value)} type="text"
                                            value={InstructorEmail} autoComplete="on" className="bg-[#323253] outline-none mx-2 w-[70%]" />
                                    </div>

                                    <button className="text-white rounded-lg mx-6 py-2 px-5 cursor-pointer border border-[#323253] hover:border hover:border-white hover:bg-lightbg transition-all duration-250 ease-in-out w-max" type="submit">
                                        Submit
                                    </button>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export default Course;

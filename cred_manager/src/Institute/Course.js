import React, {useState} from 'react';
import { useParams } from 'react-router-dom';
import {
    Link
  } from "react-router-dom";

const courseData = [
    {
        C_id: "0",
        instructor_name: "John Doe",
        imgsrc:
            "https://prod-discovery.edx-cdn.org/cdn-cgi/image/width=378,height=auto,quality=85,format=webp/media/course/image/49da3125-a471-4615-b9fe-693f045f8d38-aa7ff35be196.png",
        title: "Fundamentals of Data Structure",
        students_enrolled: "5",
        credits: 3,
    },
    {
        C_id: "1",
        instructor_name: "Jane Smith",
        imgsrc:
            "https://www.digitalvidya.com/blog/wp-content/uploads/2017/05/Data_Analytics_Applications.webp",
        title: "Data Analytics For Business Applications",
        students_enrolled: "5",
        credits: 4,
    },
];

const studentData = [
    {
        Student_id: "0",
        Name: "Prathamesh Mundada",
        imgsrc:
            "https://prod-discovery.edx-cdn.org/cdn-cgi/image/width=378,height=auto,quality=85,format=webp/media/course/image/49da3125-a471-4615-b9fe-693f045f8d38-aa7ff35be196.png",
        Email: "prathamesh.mundada@spit.ac.in",
        DOB: "2003-04-16",
        Institute: "Sardar Patel Institute of Technology",
    },
    {
        Student_id: "1",
        Name: "Dheeraj Muppineti",
        imgsrc:
            "https://prod-discovery.edx-cdn.org/cdn-cgi/image/width=378,height=auto,quality=85,format=webp/media/course/image/49da3125-a471-4615-b9fe-693f045f8d38-aa7ff35be196.png",
        Email: "dhiraj.muppineti@spit.ac.in",
        DOB: "2003-10-10",
        Institute: "Sardar Patel Institute of Technology",
    },
    {
        Student_id: "2",
        Name: "Rishit trivedi",
        imgsrc:
            "https://prod-discovery.edx-cdn.org/cdn-cgi/image/width=378,height=auto,quality=85,format=webp/media/course/image/49da3125-a471-4615-b9fe-693f045f8d38-aa7ff35be196.png",
        Email: "dhiraj.muppineti@spit.ac.in",
        DOB: "2003-01-01",
        Institute: "Sardar Patel Institute of Technology",
    },
    {
        Student_id: "3",
        Name: "Shubham Rathod",
        imgsrc:
            "https://prod-discovery.edx-cdn.org/cdn-cgi/image/width=378,height=auto,quality=85,format=webp/media/course/image/49da3125-a471-4615-b9fe-693f045f8d38-aa7ff35be196.png",
        Email: "shubham.rathod@spit.ac.in",
        DOB: "2003-03-03",
        Institute: "Sardar Patel Institute of Technology",
    },
    {
        Student_id: "4",
        Name: "Chirag Mehta",
        imgsrc:
            "https://prod-discovery.edx-cdn.org/cdn-cgi/image/width=378,height=auto,quality=85,format=webp/media/course/image/49da3125-a471-4615-b9fe-693f045f8d38-aa7ff35be196.png",
        Email: "Chirag.mehta@spit.ac.in",
        DOB: "2003-06-23",
        Institute: "Sardar Patel Institute of Technology",
    },
];

const Course = () => {
    const { courseId } = useParams();
    const course = courseData.find(c => c.C_id === courseId);
    const [tabbutton, settabbutton] = useState(0);

    if (!course) {
        return <div>Course not found</div>;
    } else {
        return (
            <div className="bg-darkbg text-white px-10 py-3 pt-[105px] flex flex-row w-full h-[100vh]">
                <div className='flex flex-col items-center justify-center w-[30vw] gap-5' >
                    <div className='bg-[#323253] p-4 px-16 rounded-2xl h-[30%] w-[95%] flex flex-col' >
                        <h1 className='font-bold text-2xl m-1'>Course Details</h1>
                        <h2 className='font-bold text-xl m-1'>Students Enrolled: {course.students_enrolled}</h2>
                        <h2 className='font-bold text-xl m-1'>Course Credits: {course.credits}</h2>
                    </div>
                    <div className='bg-[#323253] p-10 px-16 rounded-2xl h-[60%] w-[95%] flex flex-col gap-3' >
                        <Link className={tabbutton === 0 ? "cursor-pointer border bg-lightbg shadow-white rounded-lg px-3 py-2 font-bold text-xl" : "cursor-pointer border hover:bg-lightbg hover:shadow-white rounded-lg px-3 py-2 font-bold text-xl transition-all duration-250 ease-in-out"} onClick={() => settabbutton(0)}>Course</Link>

                        <Link className={tabbutton === 1 ? "cursor-pointer border bg-lightbg shadow-white rounded-lg px-3 py-2 font-bold text-xl" : "cursor-pointer border hover:bg-lightbg hover:shadow-white rounded-lg px-3 py-2 font-bold text-xl transition-all duration-250 ease-in-out"} onClick={() => settabbutton(1)}>Instructor Profile</Link>

                        <Link className={tabbutton === 2 ? "cursor-pointer border bg-lightbg shadow-white rounded-lg px-3 py-2 font-bold text-xl" : "cursor-pointer border hover:bg-lightbg hover:shadow-white rounded-lg px-3 py-2 font-bold text-xl transition-all duration-250 ease-in-out"} onClick={() => settabbutton(2)}>Students List</Link>
                    </div>
                </div>
                <div className='flex flex-col items-center justify-center w-[70vw] gap-5' >
                    <div className=" bg-[#323253] p-4 px-16 rounded-2xl h-[20%] w-[98%] flex items-center gap-5">
                        <div className=" h-24 w-24 rounded-full bg-contain bg-center bg-no-repeat" style={{ backgroundImage: "url('https://upload.wikimedia.org/wikipedia/en/1/1d/Indian_Institute_of_Technology_Bombay_Logo.svg')" }} />
                        <div>
                            <h1 className=' font-bold text-2xl m-1' >{course.title + ", IIT Bombay"}</h1>
                            <h2 className=' font-bold text-xl m-1' >{"Prof. " + course.instructor_name}</h2>
                        </div>
                    </div>
                    <div className='h-[70%] w-[98%]'>
                        {/* Course Image */}
                        <div className={tabbutton === 0 ? "h-[100%] w-[100%] rounded-xl bg-cover bg-center bg-no-repeat":"hidden"} style={{ backgroundImage: `url(${course.imgsrc})`}} >
                        </div>

                        {/* Instructor's Profile part */}
                        <div className={tabbutton === 1 ? "h-[100%] w-[100%] bg-[#323253] flex flex-col p-4 px-16 rounded-xl overflow-y-auto":"hidden"} >
                            <div className='flex flex-row items-center'>
                                <i class="ri-user-fill text-9xl"></i>
                                <div>
                                    <h1 className='font-bold text-2xl m-1' >{course.instructor_name}</h1>
                                    <h1 className='font-bold text-xl m-1' >Email: john.doe@example.com</h1>
                                    <h1 className='font-bold text-xl m-1' >DOB: 1985-05-15</h1>
                                </div>
                            </div>
                            <h1 className='font-bold text-2xl m-1' >Institute: IIT Bombay</h1>
                            <h1 className='font-bold text-2xl m-1' >Address: Adi Shankaracharya Marg , Powai, Mumbai, Maharashtra</h1>
                            <h1 className='font-bold text-2xl m-1' >Country: India</h1>
                            <h1 className='font-bold text-2xl m-1' >Education:</h1>
                            <div className="flex flex-row ml-8 text-xl">
                                <i class="ri-graduation-cap-fill m-1"></i>
                                <h1 className='font-bold m-1' >Master in Computer Science</h1>
                            </div>
                            <div className="flex flex-row ml-8 text-xl">
                                <i class="ri-graduation-cap-fill m-1"></i>
                                <h1 className='font-bold m-1' >PHD in Computer Science</h1>
                            </div>
                        </div>

                        {/* Students List */}
                        <div className={tabbutton === 2 ? "h-[100%] w-[100%] bg-[#323253] flex flex-col gap-3 rounded-xl p-4 overflow-y-auto":"hidden"} >
                            {studentData.map((stud, key) => (
                                <Link className="text-white w-[60%] flex gap-4 bg-lightbg items-center text-center rounded-lg cursor-pointer mx-4 py-5 px-5 transition-all duration-250 ease-in-out hover:text-black hover:relative hover:bg-white hover:font-bold hover:transform hover:scale-[1.2] hover:translate-x-[40px] hover:translate-y-[-5px]">
                                    {/* <i class="ri-user-fill"></i> */}
                                    <h1>{stud.Student_id}. {stud.Name}</h1>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export default Course;

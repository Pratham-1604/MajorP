import React, { useState } from "react";
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

export default function AddCourse() {
    const [coursebutton, setcoursebutton] = useState(false);
    const submit = (e) => {
        e.preventDefault();
        setcoursebutton(false);
    }

    return (
        <div className="bg-darkbg text-white pt-24 min-h-[100vh]">
            <div className="flex flex-col p-10">
                <h1 className="cursor-default text-3xl px-6 font-bold">Courses</h1>
                <ul className="flex flex-row flex-wrap gap-x-24 gap-y-0">
                    {courseData.map((val, key) => (
                        <Link
                            key={val.C_id}
                            className="text-white w-[500px] flex bg-lightbg items-center text-center rounded-lg cursor-pointer m-4 py-5 px-5 transition-all duration-250 ease-in-out hover:text-black hover:relative hover:bg-white hover:font-bold hover:transform hover:scale-[1.2] hover:translate-x-[40px] hover:translate-y-[-5px]"
                            to={`/${val.C_id}`}>
                            <div className="h-20 w-20 rounded-lg bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${val.imgsrc})` }} />
                            <span className="text-lg my-0.5 mx-3.5">{val.title}</span>
                            <span className="hidden">{val.students_enrolled}</span>
                        </Link>
                    ))}
                </ul>

                <div
                    onClick={() => setcoursebutton(!coursebutton)}
                    className="rounded-lg mx-8 py-3 px-5 cursor-pointer shadow-white hover:shadow-none border-lightbg hover:border-gray-100 bg-lightbg transition-all duration-250 ease-in-out w-max"
                >Add Course</div>

                <form className={coursebutton ? "bg-white absolute rounded-xl flex flex-col justify-center text-black py-8 px-16 top-[150px] left-[470px] z-20" : "hidden"} onSubmit={submit}>
                    <h1 className="cursor-default text-3xl my-3 px-6 font-bold" >Add Course</h1>
                    <div className="m-4">
                        <label htmlFor="title">Course Title : </label>
                        <input type="text" placeholder="Title" autoComplete="off" className="outline-none text mx-2 border-b-2 border-gray-500" id="task" />
                    </div>

                    <div className="m-4">
                        <label htmlFor="description">Instrutor Name : </label>
                        <input placeholder="Name" type="text" autoComplete="off" className="outline-none text mx-2 border-b-2 border-gray-500" id="desc" />
                    </div>

                    <div className="m-4">
                        <label>Upload an Image : </label>
                        <input className="mx-2" type="file" name="image" accept="image/*" />
                    </div>

                    <button type="submit" className="text-white rounded-lg mx-6 py-3 px-5 cursor-pointer shadow-2xl hover:shadow-none border-lightbg hover:border-gray-100 bg-lightbg transition-all duration-250 ease-in-out w-max">
                        <p>Add Course</p>
                    </button>
                </form>
                {coursebutton === true ? (<>
                    <div onClick={() => setcoursebutton(false)} className="fixed top-0 left-0 h-screen w-screen bg-[rgba(0,0,0,0.3)] z-10"></div>
                </>) : 
                <></>}
            </div>
        </div>
    );
}
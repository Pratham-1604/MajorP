import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { server_url } from "../Utilities";
import Navbar from "./Navbar";

export default function AddCourse() {
  const navigate = useNavigate();

  const [institution, setInstitution] = useState(null);
  const [error, setError] = useState("");

  const [courseData, setCourseData] = useState([
    {
      _id: "0",
      course_name: "Fundamentals of Data Structure",
      students_enrolled: "5",
      course_credits: 3,
    },
  ]);

  const [courseButton, setCourseButton] = useState(false);
  const [Course_name, setCourse_name] = useState("");
  const [Course_credit, setCourse_credit] = useState("");
  const [img_add, setimg_add] = useState("");
  const [course_hover, setcourse_hover] = useState(-1);

  // useEffect(() => {
  //   const fetchCourses = async () => {
  //     try {
  //       const response = await axios.get(`${server_url}/courses`);

  //       setCourseData(response.data);
  //     } catch (error) {
  //       console.error('Error fetching courses:', error);
  //       setCourseData([]);
  //     }
  //   };

  //   fetchCourses();
  // }, []);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const institutionId = localStorage.getItem("id");

    // Check for authentication
    if (!token || !institutionId) {
      navigate("/login");
      return;
    }

    // Fetch institution data
    const fetchInstitutionData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/institutions/${institutionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setInstitution(response.data);
      } catch (err) {
        setError(
          "Error fetching institution data: " +
            (err.response?.data?.message || "Unknown error")
        );
        console.error("Error fetching institution data:", err);
      }
    };

    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/courses/institute/${institutionId}`
        );
        setCourseData(response.data);
      } catch (err) {
        setError(
          "Error fetching courses: " + (err.response?.data?.message || err)
        );
        console.error("Error fetching courses:", err);
      }
    };

    fetchInstitutionData();
    fetchCourses();
  }, [navigate]);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setimg_add(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: false,
  });

  const submit = (e) => {
    e.preventDefault();

    const sendData = {
      course_name: Course_name,
      course_credits: parseInt(Course_credit),
      imgsrc: img_add,
      institution: institution._id,
    };

    axios
      .post(`${server_url}/courses`, sendData)
      .then((response) => {
        console.log("Course added:", response.data);
        setCourseData([...courseData, response.data]);
        setCourse_name("");
        setCourse_credit("");
        setimg_add("");
      })
      .catch((error) => {
        console.error("Error adding course:", error);
      });
    setCourseButton(false);
  };

  const deleteCourse = (courseId) => {
    axios
      .delete(`${server_url}/courses/${courseId}`)
      .then((response) => {
        navigate("/");
        console.log("Course deleted:", response.data);
        setCourseData((prevData) =>
          prevData.filter((val) => val._id !== courseId)
        );
      })
      .catch((error) => {
        console.error("Error deleting course:", error);
      });
  };

  return (
    <>
      <Navbar />
      <div className="bg-darkbg text-white pt-24 min-h-[100vh]">
        <div className="flex flex-col p-10">
          <h1 className="cursor-default text-3xl px-6 font-bold">Courses</h1>
          <ul className="flex flex-row flex-wrap gap-x-24 gap-y-0">
            {courseData.map((val) => (
              <Link
                key={val._id}
                onMouseEnter={() => setcourse_hover(val._id)}
                onMouseLeave={() => setcourse_hover(-1)}
                className="text-white w-[520px] flex bg-lightbg items-center rounded-lg cursor-pointer mx-8 my-4 py-4 px-4 transition-all duration-250 ease-in-out hover:text-black hover:relative hover:bg-white hover:font-bold hover:transform hover:scale-[1.2] hover:translate-x-[40px] hover:translate-y-[0px]"
                to={`/courses/${val._id}`}
              >
                <div
                  className="h-20 w-32 rounded-lg bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${val.imgsrc})` }}
                />
                <span className="text-lg font-semibold text-wrap w-[40%] my-0.5 mx-3.5">
                  {val.course_name}
                </span>
                <span
                  className={
                    course_hover === val._id
                      ? "w-[16%] text-md text-wrap my-0.5 mx-3 opacity-100 transition-all duration-100 ease-in-out"
                      : "opacity-0 transition-all duration-100 ease-in-out"
                  }
                >
                  Credits: {val.course_credits}
                </span>

                <i
                  onClick={() => deleteCourse(val._id)}
                  className={
                    course_hover === val._id
                      ? "ri-delete-bin-2-fill hover:transform hover:scale-[1.4] text-2xl opacity-100 transition-all duration-100 ease-in-out"
                      : "ri-delete-bin-2-fill text-2xl opacity-0 transition-all duration-100 ease-in-out"
                  }
                ></i>
              </Link>
            ))}
          </ul>

          <div
            onClick={() => setCourseButton(!courseButton)}
            className="w-max rounded-lg px-4 py-4 cursor-pointer border border-darkbg hover:border hover:border-gray-200 hover:bg-lightbg transition-all duration-250 ease-in-out"
          >
            Add Course
          </div>

          <form
            className={
              courseButton
                ? "bg-darkbg border border-white absolute rounded-xl flex flex-col justify-center text-white py-8 px-16 top-[150px] left-[470px] z-20"
                : "hidden"
            }
            onSubmit={submit}
          >
            <h1 className="cursor-default text-3xl my-3 px-6 font-bold">
              Add Course
            </h1>
            <div className="m-2">
              <label htmlFor="title">Course Title: </label>
              <input
                type="text"
                onChange={(e) => setCourse_name(e.target.value)}
                value={Course_name}
                placeholder="Title"
                autoComplete="off"
                className="bg-darkbg outline-none text mx-2 border-b-2 border-gray-500"
              />
            </div>

            <div className="m-2">
              <label htmlFor="credits">Course Credits: </label>
              <input
                placeholder="credits"
                type="number"
                onChange={(e) => setCourse_credit(e.target.value)}
                value={Course_credit}
                autoComplete="off"
                className="bg-darkbg outline-none text mx-2 border-b-2 border-gray-500 no-spinner"
              />
            </div>

            <div className="m-2">
              <label htmlFor="title">Course Img: </label>
              <input
                type="text"
                onChange={(e) => setimg_add(e.target.value)}
                value={img_add}
                placeholder="Add"
                autoComplete="off"
                className="bg-darkbg outline-none text mx-2 border-b-2 border-gray-500"
              />
            </div>

            {/* <div {...getRootProps()} className="m-2 border-2 border-dashed border-white p-5 text-center">
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the file here...</p>
              ) : (
                <p>Drag & drop an image here, or click to select a file</p>
                )}
                </div> */}

            <button
              type="submit"
              className="text-white rounded-lg mx-6 py-3 px-5 cursor-pointer shadow-2xl hover:shadow-none border-lightbg hover:border-gray-100 bg-lightbg transition-all duration-250 ease-in-out w-max"
            >
              Add Course
            </button>
          </form>

          {courseButton ? (
            <div
              onClick={() => setCourseButton(false)}
              className="fixed top-0 left-0 h-screen w-screen bg-[rgba(0,0,0,0.66)] z-10"
            ></div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
}

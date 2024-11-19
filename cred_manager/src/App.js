import Navbar from "./Institute/Navbar";
// import Home from "./Institute/Home";
import AddCourse from "./Institute/AddCourse";
import InstProfile from "./Institute/InstProfile";
import Course from "./Institute/Course";
import AboutUs from "./Institute/AboutUs";
import Login from "./Institute/Registration/Login";
import Logout from "./Institute/Registration/Logout";
import Register from "./Institute/Registration/Register";
import CoursesList from "./Institute/CoursesList";
import StudentHome from "./Student/StudentHome";
import StudentCertificates from "./Student/StudentCertificates";
import StudentCourses from "./Student/StudentCourses";
import StudentLogin from "./Student/Registration/StudentLogin";
import StudentRegister from "./Student/Registration/StudentRegister";
import InstitutionHome from "./Institute/InstitutionHome";

import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  
  return (
    <>
      <Router>
        <div className="fixed w-full">
          <Navbar />
        </div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Logout />} /> 
          <Route path="/" element={<Home />} />
          <Route path="/institution_home" element={<InstitutionHome />} />
          <Route exact path="/add_course" element={<AddCourse />} />
          <Route path="/institute_profile" element={<InstProfile />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/courses/:courseId" element={<Course />} />
          <Route path="/courses" element={<CoursesList />} />
          <Route path="/student_home" element={<StudentHome />} />
          <Route path="/student_courses" element={<StudentCourses />} />
          <Route path="/student_certificates" element={<StudentCertificates />} />
          <Route path="/student_login" element={<StudentLogin />} />
          <Route path="/student_register" element={<StudentRegister />} />


        </Routes>
      </Router>
    </>
  );
}

export default App;

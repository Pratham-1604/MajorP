import Navbar from "./Institute/Navbar";
import AddCourse from "./Institute/AddCourse";
import InstProfile from "./Institute/InstProfile";
import Course from "./Institute/Course";
import AboutUs from "./Institute/AboutUs";
import Login from "./Institute/Registration/Login";
import Register from "./Institute/Registration/Register";
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
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route exact path="/add_course" element={<AddCourse />} />
          <Route path="/institute_profile" element={<InstProfile />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/:courseId" element={<Course />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

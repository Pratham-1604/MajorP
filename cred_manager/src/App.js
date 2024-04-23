import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './Institute/Navbar';
import AddCourse from './Institute/AddCourse';
import InstProfile from './Institute/InstProfile';
import Course from './Institute/Course';

function App() {
  return (
    <>
      <Router>
        <div className='fixed w-full h-full'>
          <Navbar />
        </div>
        <Routes>
          <Route exact path='/' element={<AddCourse />} />
          <Route exact path='/institute_profile' element={<InstProfile />} />
          <Route exact path='/course/:courseId' element={<Course />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

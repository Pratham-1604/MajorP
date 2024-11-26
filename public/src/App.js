import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import CreateStudent from "./components/admin/createStudent";
import IssueCredits from "./components/admin/issueCredits";
import GetStudentDetails from "./components/admin/getStudentDetails";
import { DarkModeProvider } from "./context/themeContext";
import AdminHome from "./components/admin/AdminHome.jsx";
import LoginPage from "./components/LoginPage.jsx";
import StudentHome from "./components/student/StudentHome.jsx";
import CoursesPage from "./components/admin/CoursesPage.jsx";
import CompleteProfile from "./components/student/CompleteProfile.jsx";
import GradeCard from './components/student/GradeCard.jsx'
import GradesDisplay from "./components/student/GradesDisplay.jsx";
import SubjectSelection from "./components/student/SubjectSelection.jsx";

const App = () => {
  return (
    <DarkModeProvider>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/admin-home" element={<AdminHome />} />
            <Route path="/student-home" element={<StudentHome />} />
            <Route path="/admin-courses" element={<CoursesPage />} />
            <Route path="/create-student" element={<CreateStudent />} />
            <Route path="/issue-credits" element={<IssueCredits />} />
            <Route path="/complete-profile" element={<CompleteProfile />} />
            <Route path="/subject-selection" element={<SubjectSelection />} />
            <Route
              path="/get-student-details/"
              element={<GetStudentDetails />}
            />
            <Route path="/generate-marksheet" element={<GradeCard />} /> {/* Route for GradeCard */}
            <Route path="/grades-display" element={<GradesDisplay />} />
          </Routes>
        </div>
      </Router>
    </DarkModeProvider>
  );
};

export default App;

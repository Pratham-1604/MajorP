import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateStudent from "./components/admin_components/createStudent";
import GetStudentDetails from "./components/admin_components/getStudentDetails";
import IssueCredits from "./components/admin_components/issueCredits";
import AdminHome from "./components/admin_components/admin_home";
import StudentHome from "./components/student_components/student_home";
import LoginPage from "./components/auth_screen/auth_screen";
import { DarkModeProvider } from "./context/themeContext";
import GradeCard from "./components/admin_components/grade_card";

const App = () => {
  return (
    <DarkModeProvider>
      <Router>
        <Routes>
          <Route path="/auth" element={<LoginPage />} />
          <Route path="/create-student" element={<CreateStudent />} />
          <Route path="/get-student-details" element={<GetStudentDetails />} />
          <Route path="/issue-credits" element={<IssueCredits />} />
          <Route path="/student-home" element={<StudentHome />} />
          <Route path="/admin-home" element={<AdminHome />} />
          <Route path="/generate-marksheet" element={<GradeCard />} />
        </Routes>
      </Router>
    </DarkModeProvider>
  );
};

export default App;

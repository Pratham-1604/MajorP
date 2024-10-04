import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import CreateStudent from "./components/createStudent";
import IssueCredits from "./components/issueCredits";
import GetStudentDetails from "./components/getStudentDetails";
import Navbar from "./components/navbar";
import StudentList from "./components/studentList";
import { DarkModeProvider } from "./context/themeContext";

const App = () => {
  return (
    <DarkModeProvider>
      <Router>
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<StudentList />} />
            <Route path="/create-student" element={<CreateStudent />} />
            <Route path="/issue-credits" element={<IssueCredits />} />
            <Route
              path="/get-student-details/"
              element={<GetStudentDetails />}
            />
          </Routes>
        </div>
      </Router>
    </DarkModeProvider>
  );
};

export default App;

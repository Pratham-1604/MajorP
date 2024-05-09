import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import CreateStudent from "./components/private/createStudent";
import IssueCredits from "./components/private/issueCredits";
import GetStudentDetails from "./components/private/getStudentDetails";
import Navbar from "./components/private/navbar";
import StudentList from "./components/private/studentList";
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

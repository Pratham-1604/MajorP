import React from "react";
import Navbar from "./navbar";
import StudentList from "./studentList";
import GradeCard from "./grade_card";

const AdminHome = () => {
  return (
    <>
      <Navbar />
      <StudentList />
      {/* <GradeCard /> */}
    </>
  );
};

export default AdminHome;

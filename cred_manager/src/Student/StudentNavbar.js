import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const StudentNavbar = () => {
  const [selectTab, setselectTab] = useState(0);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Redirect to the login page
    navigate("/logout");
  };

  return (
    <div className="flex flex-col bg-darkbg text-white">
      <nav className="flex flex-row justify-between shadow-lg">

        <div className="bg-darkbg top-0 flex gap-4 items-center p-5">
          <Link onClick={() => setselectTab(0)} to="/student_home" className="font-bold text-4xl m-2 cursor-pointer">in-Credible</Link>

          <Link onClick={() => setselectTab(0)} to="/student_home" className={selectTab === 0 ? "rounded-lg px-4 py-2 cursor-pointer border border-gray-200 bg-lightbg transition-all duration-250 ease-in-out" : "rounded-lg px-4 py-2 cursor-pointer border border-darkbg hover:border hover:border-gray-200 hover:bg-lightbg transition-all duration-250 ease-in-out"}>Home</Link>

          <Link onClick={() => setselectTab(1)} to="/student_courses" className={selectTab === 1 ? "rounded-lg px-4 py-2 cursor-pointer border border-gray-200 bg-lightbg transition-all duration-250 ease-in-out" : "rounded-lg px-4 py-2 cursor-pointer border border-darkbg hover:border hover:border-gray-200 hover:bg-lightbg transition-all duration-250 ease-in-out"}>Your Courses</Link>

          <Link onClick={() => setselectTab(2)} to="/student_certificates" className={selectTab === 2 ? "rounded-lg px-4 py-2 cursor-pointer border border-gray-200 bg-lightbg transition-all duration-250 ease-in-out" : "rounded-lg px-4 py-2 cursor-pointer border border-darkbg hover:border hover:border-gray-200 hover:bg-lightbg transition-all duration-250 ease-in-out"}>Your Certificates</Link>

          <Link onClick={() => setselectTab(3)} to="/student_profile" className={selectTab === 3 ? "rounded-lg px-4 py-2 cursor-pointer border border-gray-200 bg-lightbg transition-all duration-250 ease-in-out" : "rounded-lg px-4 py-2 cursor-pointer border border-darkbg hover:border hover:border-gray-200 hover:bg-lightbg transition-all duration-250 ease-in-out"}>Your Profile</Link>
        </div>

        <div className="bg-darkbg top-0 flex gap-4 items-center shadow-lg p-5">
          <button className="rounded-lg px-4 py-2 cursor-pointer border border-darkbg hover:border hover:border-gray-200 hover:bg-lightbg transition-all duration-250 ease-in-out" onClick={handleLogout}>Logout</button>
        </div>
      </nav>
    </div>
  );
};

export default StudentNavbar;

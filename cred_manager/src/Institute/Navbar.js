import React from "react";
import {
  Link
} from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col bg-darkbg text-white">
      <nav className="bg-darkbg top-0 flex gap-4 items-center shadow-lg p-5">

        <h1 className="font-bold text-4xl m-2 cursor-pointer" >Credible</h1>

        <Link to="/" className="rounded-lg px-4 py-2 cursor-pointer border border-darkbg hover:shadow-white hover:border hover:border-gray-200 hover:bg-lightbg transition-all duration-250 ease-in-out" >Home</Link>

        <Link to="/institute_profile" className="rounded-lg px-4 py-2 cursor-pointer border border-darkbg hover:shadow-white hover:border hover:border-gray-200 hover:bg-lightbg transition-all duration-250 ease-in-out" >Institute Profile</Link>

        <Link className="rounded-lg px-4 py-2 cursor-pointer border border-darkbg hover:shadow-white hover:border hover:border-gray-200 hover:bg-lightbg transition-all duration-250 ease-in-out" >About Us</Link>

      </nav>
    </div>
  );
};

export default Home;

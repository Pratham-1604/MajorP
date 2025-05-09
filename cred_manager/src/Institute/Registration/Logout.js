import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear the JWT token from local storage
    localStorage.clear();
    // Redirect to the login page
    navigate("/");
  }, [navigate]);

  return null; // This component doesn't render anything
};

export default Logout;

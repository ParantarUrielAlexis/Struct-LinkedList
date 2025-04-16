import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="bg-gradient-to-r from-teal-400 to-teal-600 text-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Game Name */}
        <h1 className="text-2xl font-bold tracking-wide">Type Test</h1>

        {/* Back Arrow */}
        <div
          className="cursor-pointer"
          onClick={() => navigate("/module")} // Navigate back to Module.jsx
        >
          <FaArrowLeft size={24} /> {/* React back arrow icon */}
        </div>
      </div>
    </header>
  );
};

export default Header;

import React from "react";
import { Link } from "react-router-dom";
import { FaGamepad, FaBook, FaMedal } from "react-icons/fa";

const Sidebar = () => {
  return (
    <aside className="w-14 h-screen bg-teal-400 flex flex-col items-center pt-24 space-y-4">
      {/* Navigation Links */}
      <nav className="flex flex-col items-center space-y-4">
        {/* Lessons Icon */}
        <Link
          to="/module"
          className="w-10 h-10 bg-teal-300 hover:bg-teal-500 rounded-lg flex items-center justify-center"
        >
          <FaBook className="text-white text-lg" />
        </Link>

        {/* Game Icon */}
        <Link
          to="/games"
          className="w-10 h-10 bg-teal-300 hover:bg-teal-500 rounded-lg flex items-center justify-center"
        >
          <FaGamepad className="text-white text-lg" />
        </Link>

        {/* Badges Icon */}
        <Link
          to="/badges"
          className="w-10 h-10 bg-teal-300 hover:bg-teal-500 rounded-lg flex items-center justify-center"
        >
          <FaMedal className="text-white text-lg" />
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;

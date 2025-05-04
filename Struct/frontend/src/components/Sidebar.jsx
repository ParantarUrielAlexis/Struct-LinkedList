import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  FaGamepad,
  FaBook,
  FaMedal,
  FaChalkboardTeacher,
} from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside className="w-14 h-screen fixed top-0 left-0 bg-blue-100 flex flex-col items-center pt-24 space-y-4 border-r border-blue-200">
      {/* Navigation Links */}
      <nav className="flex flex-col items-center space-y-4">
        {/* Lessons Icon */}
        <Link
          to="/module"
          className="w-10 h-10 bg-blue-200 hover:bg-blue-400 rounded-lg flex items-center justify-center transition-colors duration-200"
        >
          <FaBook className="text-blue-700 text-lg" />
        </Link>

        {/* Game Icon */}
        <Link
          to="/games"
          className="w-10 h-10 bg-blue-200 hover:bg-blue-400 rounded-lg flex items-center justify-center transition-colors duration-200"
        >
          <FaGamepad className="text-blue-700 text-lg" />
        </Link>

        {/* Teacher Dashboard Icon (Visible only for teachers) */}
        {user?.userType === "teacher" && (
          <Link
            to="/teacher-dashboard"
            className="w-10 h-10 bg-blue-200 hover:bg-blue-400 rounded-lg flex items-center justify-center transition-colors duration-200"
          >
            <FaChalkboardTeacher className="text-blue-700 text-lg" />
          </Link>
        )}

        {/* Badges Icon */}
        {/* <Link
          to="/badges"
          className="w-10 h-10 bg-blue-200 hover:bg-blue-400 rounded-lg flex items-center justify-center transition-colors duration-200"
        >
          <FaMedal className="text-blue-700 text-lg" />
        </Link> */}
      </nav>
    </aside>
  );
};

const AppLayout = ({ children }) => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-14">{children}</div>
    </div>
  );
};

// Add PropTypes validation for children
AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Sidebar;

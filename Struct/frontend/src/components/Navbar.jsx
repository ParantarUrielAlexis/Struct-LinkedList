import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaSignOutAlt,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import logo from "../assets/logo.png";
import { useAuth } from "../contexts/AuthContext";
import JoinClassModal from "./JoinClassModal";
import CreateClassModal from "./CreateClassModal";
import ClassSelector from "./ClassSelector";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to toggle menu visibility

  const handleLogout = () => {
    logout();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <nav className="w-full bg-white shadow px-4 py-3 flex items-center justify-between fixed top-0 left-0 z-50">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="h-8 w-auto" />
            <h2 className="text-xl font-bold text-gray-800">
              STRUCT | ACADEMY
            </h2>
          </Link>
        </div>

        {/* Hamburger Menu Button */}
        <button
          onClick={toggleMenu}
          className="lg:hidden text-gray-700 text-2xl focus:outline-none"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Menu Section */}
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } lg:flex lg:items-center lg:gap-4 absolute lg:static top-16 left-0 w-full lg:w-auto bg-white lg:bg-transparent shadow-lg lg:shadow-none px-4 lg:px-0`}
        >
          {isAuthenticated ? (
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <ClassSelector
                onJoinClick={() => setIsJoinModalOpen(true)}
                onCreateClick={() => setIsCreateModalOpen(true)}
              />

              <div className="flex items-center gap-2 text-sm text-gray-700">
                {user?.userType === "teacher" ? (
                  <FaChalkboardTeacher className="text-teal-600" />
                ) : (
                  <FaUserGraduate className="text-teal-600" />
                )}
                <span className="font-medium">{user?.username}</span>
                <span className="text-gray-400">|</span>
                <span className="capitalize text-teal-600">
                  {user?.userType}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-md text-sm transition"
              >
                Logout
                <FaSignOutAlt />
              </button>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row lg:items-center gap-3">
              <Link
                to="/login"
                className="text-sm text-teal-600 font-medium py-2 px-4 border border-teal-600 rounded-md hover:bg-teal-50 transition"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="text-sm bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </nav>

      <JoinClassModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />
      <CreateClassModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
};

export default Navbar;

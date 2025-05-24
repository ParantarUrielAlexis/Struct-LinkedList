import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaSignOutAlt,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaBars,
  FaTimes,
  FaUser,
  FaUserCog,
  FaCaretDown
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  // Close the user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className="w-full bg-white shadow-sm px-4 py-3 flex items-center justify-between fixed top-0 left-0 z-50 border-b border-teal-100">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="h-8 w-auto" />
            <h2 className="text-xl font-bold text-teal-700">
              STRUCT | ACADEMY
            </h2>
          </Link>
        </div>

        {/* Hamburger Menu Button */}
        <button
          onClick={toggleMenu}
          className="lg:hidden text-teal-600 text-2xl focus:outline-none"
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

              {/* Username with dropdown menu */}
              <div className="relative" ref={userMenuRef}>
                <button 
                  onClick={toggleUserMenu}
                  className="flex items-center gap-2 text-sm text-gray-700 hover:text-teal-600 transition-colors focus:outline-none"
                >
                  {user?.userType === "teacher" ? (
                    <FaChalkboardTeacher className="text-teal-600" />
                  ) : (
                    <FaUserGraduate className="text-teal-600" />
                  )}
                  <span className="font-medium">
                    {user?.username}
                  </span>
                  <span className="text-gray-400">|</span>
                  <span className="capitalize text-teal-600">
                    {user?.userType}
                  </span>
                  <FaCaretDown className={`text-teal-600 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Dropdown menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link 
                      to="/profile" 
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-600"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <FaUserCog />
                      Manage Account
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-600 w-full text-left"
                    >
                      <FaSignOutAlt />
                      Logout
                    </button>
                  </div>
                )}
              </div>
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
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FaSignOutAlt,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaBars,
  FaTimes,
  FaUser,
  FaUserCog,
  FaCaretDown,
  FaHeart,
} from "react-icons/fa";
import logo from "../../assets/logo.png";
import { useAuth } from "../../contexts/AuthContext";
import JoinClassModal from "../ClassManagement/JoinClassModal";
import CreateClassModal from "../ClassManagement/CreateClassModal";
import ClassSelector from "../ClassManagement/ClassSelector";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Add heart state variables
  const [hearts, setHearts] = useState(0);
  const [maxHearts, setMaxHearts] = useState(5);
  const [nextHeartIn, setNextHeartIn] = useState(null);
  const [heartIntervalId, setHeartIntervalId] = useState(null);

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

  // Function to format remaining time
  const formatTimeRemaining = (milliseconds) => {
    if (!milliseconds) return null;

    const minutes = Math.floor(milliseconds / (60 * 1000));
    const seconds = Math.floor((milliseconds % (60 * 1000)) / 1000);

    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins}m`;
    }

    return `${minutes}m ${seconds < 10 ? "0" : ""}${seconds}s`;
  };

  // Function to fetch heart data
  const fetchHeartData = async () => {
    if (!isAuthenticated) return;

    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const API_BASE_URL = "http://localhost:8000";
      const response = await axios.get(`${API_BASE_URL}/api/user/hearts/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      const { hearts: userHearts, max_hearts, next_heart_in } = response.data;

      setHearts(userHearts);
      setMaxHearts(max_hearts || 5);
      setNextHeartIn(next_heart_in);
    } catch (error) {
      console.error("Error fetching heart data:", error);
    }
  };

  // Fetch heart data on component mount and when authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchHeartData();

      // Set up interval to update the countdown every minute
      const intervalId = setInterval(() => {
        if (nextHeartIn !== null && nextHeartIn > 0) {
          const newNextHeartIn = nextHeartIn - 60 * 1000; // Subtract one minute

          if (newNextHeartIn <= 0) {
            // Time to regenerate a heart
            fetchHeartData();
          } else {
            setNextHeartIn(newNextHeartIn);
          }
        }
      }, 60 * 1000);

      setHeartIntervalId(intervalId);

      // Clear interval on component unmount
      return () => {
        if (intervalId) {
          clearInterval(intervalId);
        }
      };
    }
  }, [isAuthenticated]);

  // Update countdown timer every second
  useEffect(() => {
    if (isAuthenticated && nextHeartIn !== null && nextHeartIn > 0) {
      const countdownInterval = setInterval(() => {
        setNextHeartIn((prev) => {
          if (prev <= 1000) {
            // If we're below 1 second, fetch new data
            fetchHeartData();
            return null;
          }
          return prev - 1000;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [nextHeartIn, isAuthenticated]);

  // Also update this to refresh every second when hearts are regenerating
  useEffect(() => {
    if (isAuthenticated) {
      fetchHeartData();

      // Set up interval to update the countdown timer
      const intervalId = setInterval(() => {
        fetchHeartData();
      }, 60 * 1000); // Refresh every minute

      setHeartIntervalId(intervalId);

      // Clear interval on component unmount
      return () => {
        if (intervalId) {
          clearInterval(intervalId);
        }
      };
    }
  }, [isAuthenticated]);

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

              {/* Heart counter and countdown */}
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center">
                  <span className="text-sm font-medium">{hearts}</span>
                  <FaHeart className="text-[11px] text-red-500 ml-1" />
                  <span className="text-[10px] text-gray-500 ml-1">
                    /{maxHearts}
                  </span>
                </div>

                {nextHeartIn && hearts < maxHearts && (
                  <div className="text-[10px] text-gray-600 bg-gray-100 px-2 py-1 rounded-md mt-1">
                    {formatTimeRemaining(nextHeartIn)}
                  </div>
                )}
              </div>

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
                  <span className="font-medium">{user?.username}</span>
                  <span className="text-gray-400">|</span>
                  <span className="capitalize text-teal-600">
                    {user?.userType}
                  </span>
                  <FaCaretDown
                    className={`text-teal-600 transition-transform ${
                      isUserMenuOpen ? "rotate-180" : ""
                    }`}
                  />
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

import React from "react";
import { Link } from "react-router-dom";
import { FaSignOutAlt, FaUser } from "react-icons/fa";
import logo from "../assets/logo.png";
import "./Navbar.css";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    // Navigate to home or login page happens automatically due to protected routes
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        {/* Link the logo to the landing page */}
        <Link to="/" className="logo-link">
          <img src={logo} alt="Struct Academy Logo" className="logo-img" />
        </Link>
        <h2 className="logo-text">
          <Link to="/">STRUCT | ACADEMY</Link>
        </h2>
      </div>

      <div className="nav-right">
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <FaUser className="text-teal-600 mr-2" />
              <span className="text-gray-700">
                <span className="font-medium">{user.username}</span>
                <span className="mx-2">|</span>
                <span className="text-teal-600 capitalize">
                  {user.userType}
                </span>
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-md transition-colors duration-300"
            >
              Logout
              <FaSignOutAlt />
            </button>
          </div>
        ) : (
          <>
            <Link to="/login" className="login-btn">
              Log in
            </Link>
            <Link to="/signup" className="signup-btn">
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

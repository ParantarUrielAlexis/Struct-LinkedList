import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-left">
        {/* Link the logo to the landing page */}
        <Link to="/" className="logo-link">
          <img src={logo} alt="Struct Academy Logo" className="logo-img" />
        </Link>
        <h2 className="logo-text">
          <Link to="/">STRUCT | ACADEMY</Link> {/* Link the text as well */}
        </h2>
      </div>

      <div className="nav-right">
        <Link to="/login" className="login-btn">
          Log in
        </Link>
        <Link to="/signup" className="signup-btn">
          Sign up
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;

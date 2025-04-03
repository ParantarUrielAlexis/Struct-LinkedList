import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Add styling here

const Navbar = () => {
  return (
    <nav className="navbar">
      <h2 className="logo">MyApp</h2>
      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/sort">Sort Rush</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
        <li>
          <Link to="/users">Users</Link>
        </li>
        <li>
          <Link to="/type-test">Type Test</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

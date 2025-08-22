import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide header on Galist Game
  if (location.pathname.startsWith("/galist-game")) {
    return null;
  }

  // Map routes to game names
  // Use a function or check for a prefix for dynamic routes
  const getGameName = (pathname) => {
    if (pathname.startsWith("/type-test")) {
      return "Typing Test";
    }
    if (pathname.startsWith("/sortshift")) {
      // You can add more specific sortshift names here if needed,
      // otherwise, it will default to "Sort Shift"
      if (pathname === "/sortshiftselection") return "Sort Shift Selection";
      if (pathname === "/sortshiftbubble") return "Sort Shift Bubble";
      if (pathname === "/sortshiftinsertion") return "Sort Shift Insertion";
      return "Sort Shift";
    }
    if (pathname === "/snake-game") {
      return "Snake Game";
    }
    return "Game"; // Default name if no match
  };

  const gameName = getGameName(location.pathname);

  // Check if current route is a sortshift route for dynamic background
  const isSortShiftRoute = location.pathname.includes("sortshift");

  const handleBackNavigation = () => {
    if (
      location.pathname.startsWith("/type-test") &&
      location.pathname !== "/type-test/levels"
    ) {
      navigate("/type-test/levels");
    } else if (location.pathname === "/type-test/levels") {
      navigate("/games"); // Navigate to GameShowcase if on TypeTestLevels
    } else {
      navigate(-1); // Navigate to the previous page for all other cases
    }
  };

  return (
    <header
      className={`${
        isSortShiftRoute ? "bg-transparent" : "bg-blue-600"
      } text-white p-4 shadow-md flex items-center justify-between`}
    >
      {/* Game Name */}
      <h1 className="text-2xl font-bold">{gameName}</h1>
      {/* Back Button */}
      <button
        onClick={handleBackNavigation}
        className="text-white hover:text-gray-200"
      >
        <FaArrowLeft size={20} />
      </button>
    </header>
  );
};

export default Header;

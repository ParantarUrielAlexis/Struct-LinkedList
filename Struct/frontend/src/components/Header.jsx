import React from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import useLocation and useNavigate
import { FaArrowLeft } from "react-icons/fa"; // Importing the back arrow icon

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize the navigate function

  // Map routes to game names
  const gameNames = {
    "/type-test": "Typing Test",
    "/sortshift": "Sort Shift",
    "/sortshiftselection": "Sort Shift Selection",
    "/sortshiftbubble": "Sort Shift Bubble",
    "/sortshiftinsertion": "Sort Shift Insertion",
    "/snake-game": "Snake Game",
  };

  // Get the game name based on the current route
  const gameName = gameNames[location.pathname] || "Game";

  return (
    <header className="bg-teal-600 text-white p-4 shadow-md flex items-center justify-between">
      {/* Game Name */}
      <h1 className="text-2xl font-bold">{gameName}</h1>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)} // Navigate to the previous page
        className="text-white hover:text-gray-200"
      >
        <FaArrowLeft size={20} />
      </button>
    </header>
  );
};

export default Header;

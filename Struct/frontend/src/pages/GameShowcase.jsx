import React from "react";
import { useNavigate } from "react-router-dom";
import { FaKeyboard, FaGamepad, FaSort } from "react-icons/fa";
import { motion } from "framer-motion";

const GameShowcase = () => {
  const navigate = useNavigate();

  const games = [
   
    {
      id: 1,
      name: "Galist Game",
      description: "Test your skills with the Galist game!",
      route: "/galist-game",
      icon: <FaGamepad className="text-6xl text-purple-500 drop-shadow-md" />,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-teal-50 via-emerald-50 to-teal-100 text-gray-800 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute top-0 left-0 w-full h-full bg-stars opacity-20 z-0" />

      <motion.div
        className="text-center mb-12 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl font-extrabold text-teal-600 mb-3 tracking-wide drop-shadow-sm">
          🎮 Game Arena
        </h1>
        <p className="text-lg text-teal-800">
          Enjoy these fun games while learning about arrays!
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 z-10"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 },
          },
        }}
      >
        {games.map((game) => (
          <motion.div
            key={game.id}
            className="bg-white border border-teal-200 rounded-2xl py-10 px-4 flex flex-col items-center text-center transform transition duration-300 hover:scale-105 hover:border-teal-400 hover:shadow-lg"
            whileHover={{ scale: 1.07 }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <div className="mb-4">{game.icon}</div>
            <h2 className="text-2xl font-bold text-teal-700 mb-2 tracking-wide">
              {game.name}
            </h2>
            <p className="text-gray-600 text-sm mb-4">{game.description}</p>
            <div className="mt-auto">
              {/* Use game.route for navigation */}
              <button
                onClick={() => navigate(game.route)}
                className="bg-gradient-to-r from-teal-400 to-emerald-500 hover:from-amber-400 hover:to-amber-300 text-white font-bold py-2 px-5 rounded-full transition-all duration-300 hover:scale-105"
              >
                ▶ Play Now
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default GameShowcase;

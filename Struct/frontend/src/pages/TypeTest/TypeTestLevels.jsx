import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaLock,
  FaStar,
  FaTrophy,
  FaPlayCircle,
  FaBolt,
  FaFire,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { levels } from "./TypeTestLevelsData";

const TypeTestLevels = () => {
  const navigate = useNavigate();
  const [userProgress, setUserProgress] = useState({
    currentLevel: 2, // User has completed levels 0 and 1
    stars: {
      0: 3, // 3 stars on level 0
      1: 3, // 2 stars on level 1
    },
  });

  const [currentPage, setCurrentPage] = useState(0);
  const levelsPerPage = 3;

  const handleLevelSelect = (levelIndex) => {
    if (levelIndex <= userProgress.currentLevel) {
      navigate(`/type-test/${levelIndex}`);
    }
  };

  const getLevelStatus = (index) => {
    if (index < userProgress.currentLevel) return "completed";
    if (index === userProgress.currentLevel) return "current";
    return "locked";
  };

  // Calculate levels for the current page
  const indexOfLastLevelOnPage = (currentPage + 1) * levelsPerPage;
  const indexOfFirstLevelOnPage = indexOfLastLevelOnPage - levelsPerPage;
  const currentLevelsToDisplay = levels.slice(
    indexOfFirstLevelOnPage,
    indexOfLastLevelOnPage
  );
  const totalPages = Math.ceil(levels.length / levelsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-8 px-4 bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900 text-gray-100 relative overflow-hidden">
      {/* Level Selection Grid - Now paginated */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl"
        key={currentPage} // Add key to re-trigger animations on page change if desired
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.1, // Reduced delay for quicker appearance
            },
          },
        }}
      >
        {currentLevelsToDisplay.map((level, pageIndex) => {
          const originalIndex = indexOfFirstLevelOnPage + pageIndex; // Get original index from the main levels array
          const status = getLevelStatus(originalIndex);

          return (
            <motion.div
              key={originalIndex} // Use originalIndex or level.name for a stable key
              className={`relative rounded-xl p-5 flex flex-col items-center cursor-pointer
                ${
                  status === "locked"
                    ? "bg-gray-800 opacity-80"
                    : status === "completed"
                    ? "bg-gradient-to-br from-purple-900 to-blue-900 border-2 border-blue-400"
                    : "bg-gradient-to-br from-purple-600 to-blue-700 border-2 border-yellow-400 shadow-lg shadow-blue-500/20"
                }`}
              whileHover={status !== "locked" ? { scale: 1.03, y: -5 } : {}}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              onClick={() => handleLevelSelect(originalIndex)}
            >
              {/* Level number badge */}
              <div
                className="absolute -top-3 -left-3 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"
                style={{
                  background:
                    status === "locked"
                      ? "#374151"
                      : status === "completed"
                      ? "linear-gradient(to bottom right, #8B5CF6, #3B82F6)"
                      : "linear-gradient(to bottom right, #FBBF24, #F59E0B)",
                }}
              >
                {originalIndex + 1} {/* Display original level number */}
              </div>

              {/* Level icon */}
              <div className="mb-4 text-4xl">
                {status === "locked" ? (
                  <FaLock className="text-gray-500" />
                ) : status === "completed" ? (
                  <FaTrophy className="text-yellow-400" />
                ) : (
                  <FaFire className="text-orange-500" />
                )}
              </div>

              {/* Level title */}
              <h2 className="text-xl font-bold mb-2 tracking-wide text-center">
                {level.name}
              </h2>

              {/* Stars for completed levels */}
              {status === "completed" && (
                <div className="flex justify-center mb-3">
                  {[...Array(3)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`mx-1 text-xl ${
                        i < (userProgress.stars[originalIndex] || 0) // Use originalIndex for stars
                          ? "text-yellow-400"
                          : "text-gray-600"
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Play button */}
              <motion.div
                className={`mt-2 flex items-center justify-center rounded-full w-12 h-12
                  ${
                    status === "locked"
                      ? "bg-gray-700"
                      : status === "current"
                      ? "bg-gradient-to-r from-green-500 to-blue-500"
                      : "bg-gradient-to-r from-purple-500 to-blue-500"
                  }`}
                whileHover={
                  status !== "locked" ? { scale: 1.2, rotate: 10 } : {}
                }
              >
                <FaPlayCircle
                  className={`text-2xl ${
                    status === "locked" ? "text-gray-500" : "text-white"
                  }`}
                />
              </motion.div>

              {/* Locked overlay */}
              {status === "locked" && (
                <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black bg-opacity-40">
                  <div className="text-center px-4">
                    <FaLock className="text-3xl text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-300">
                      Complete previous level to unlock
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 gap-4">
          <motion.button
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className="p-3 bg-gray-700 rounded-full disabled:opacity-50 hover:bg-gray-600 transition-opacity"
            whileTap={{ scale: 0.9 }}
          >
            <FaChevronLeft className="text-white text-lg" />
          </motion.button>
          <span className="text-gray-300 text-lg">
            Page {currentPage + 1} of {totalPages}
          </span>
          <motion.button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages - 1}
            className="p-3 bg-gray-700 rounded-full disabled:opacity-50 hover:bg-gray-600 transition-opacity"
            whileTap={{ scale: 0.9 }}
          >
            <FaChevronRight className="text-white text-lg" />
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default TypeTestLevels;

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
  FaHeart, // Add this import
} from "react-icons/fa";
import { levels } from "./TypeTestLevelsData";
import { useAuth } from "../../contexts/AuthContext";

const TypeTestLevels = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Add hearts state
  const [hearts, setHearts] = useState(0);

  // Define level unlock requirements - each index corresponds to level,
  // value is stars needed from previous level
  const levelRequirements = [
    0, // Level 0: Always unlocked (first level)
    1, // Level 1: Requires 1 star from Level 0
    1, // Level 2: Requires 1 star from Level 1
    2, // Level 3: Requires 2 stars from Level 2
    2, // Level 4: Requires 2 stars from Level 3
    3, // Level 5: Requires 3 stars from Level 4
    // Add more as needed for additional levels
  ];

  // State for user progress
  const [userProgress, setUserProgress] = useState({
    unlockedLevels: [0], // Default: only first level unlocked
    stars: {}, // Stores { level_index: stars_earned }
    scores: {},
    wpm: {},
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const levelsPerPage = 3;

  // Add this useEffect to update hearts when user data changes
  useEffect(() => {
    if (isAuthenticated && user) {
      setHearts(user.hearts || 0);
    }
  }, [isAuthenticated, user]);

  // Fetch user progress from backend
  useEffect(() => {
    const fetchUserProgress = async () => {
      if (!isAuthenticated) {
        setUserProgress({ unlockedLevels: [0], stars: {} });
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:8000/api/progress/me/best/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${localStorage.getItem("authToken")}`,
            },
          }
        );

        if (!response.ok) {
          console.error(
            "Failed to fetch user progress:",
            await response.text() // Using text() for better error handling
          );
          setUserProgress({ unlockedLevels: [0], stars: {} });
          return;
        }

        const data = await response.json();

        // Calculate unlocked levels based on star requirements
        const unlockedLevels = [0]; // First level is always unlocked
        const fetchedStars = {};
        const fetchedScores = {};
        const fetchedWPM = {};

        // Process star data from API
        data.forEach((record) => {
          const levelIdx = record.level_index;
          fetchedStars[record.level_index] = record.stars_earned;

          // Also store score and WPM for display
          if (
            !fetchedScores[levelIdx] ||
            record.score > fetchedScores[levelIdx]
          ) {
            fetchedScores[levelIdx] = record.score;
          }

          if (!fetchedWPM[levelIdx] || record.wpm > fetchedWPM[levelIdx]) {
            fetchedWPM[levelIdx] = record.wpm;
          }
        });

        // Check each level to see if it should be unlocked
        for (let i = 1; i < levels.length; i++) {
          const previousLevelIndex = i - 1;
          const starsEarnedInPreviousLevel =
            fetchedStars[previousLevelIndex] || 0;
          const starsRequiredForThisLevel = levelRequirements[i] || 1;

          if (starsEarnedInPreviousLevel >= starsRequiredForThisLevel) {
            unlockedLevels.push(i);
          }
        }

        setUserProgress({
          unlockedLevels,
          stars: fetchedStars,
          scores: fetchedScores,
          wpm: fetchedWPM,
        });
      } catch (error) {
        console.error("Error fetching user progress:", error);
        setUserProgress({ unlockedLevels: [0], stars: {} });
      }
    };

    fetchUserProgress();
  }, [isAuthenticated]);

  // Handle level selection - Add heart check
  const handleLevelSelect = (levelIndex) => {
    if (userProgress.unlockedLevels.includes(levelIndex)) {
      // Check if user has hearts before allowing play
      if (hearts <= 0) {
        alert("You need at least 1 heart to play! Hearts regenerate over time.");
        return;
      }
      navigate(`/type-test/${levelIndex}`);
    }
  };

  // Determine level status (locked, current, completed)
  const getLevelStatus = (index) => {
    if (userProgress.unlockedLevels.includes(index)) {
      return userProgress.stars[index] > 0 ? "completed" : "current";
    }
    return "locked";
  };

  // Helper function to get progress toward unlocking a level
  const getProgressTowardUnlock = (levelIndex) => {
    if (levelIndex === 0) return { current: 0, required: 0 };

    const prevLevelIndex = levelIndex - 1;
    const starsEarned = userProgress.stars[prevLevelIndex] || 0;
    const starsRequired = levelRequirements[levelIndex] || 1;

    return {
      current: starsEarned,
      required: starsRequired,
      percent: Math.min(100, (starsEarned / starsRequired) * 100),
    };
  };

  // Calculate levels for the current page
  const indexOfLastLevelOnPage = (currentPage + 1) * levelsPerPage;
  const indexOfFirstLevelOnPage = indexOfLastLevelOnPage - levelsPerPage;
  const currentLevelsToDisplay = levels.slice(
    indexOfFirstLevelOnPage,
    indexOfLastLevelOnPage
  );
  const totalPages = Math.ceil(levels.length / levelsPerPage);

  // Pagination handlers
  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-8 px-4 bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900 text-gray-100 relative overflow-hidden">
      {/* Header with explanation and heart counter */}
      <div className="mb-8 text-center relative w-full">
        {/* Heart counter - positioned in top right */}
        {isAuthenticated && (
          <div className="absolute top-0 right-4 flex items-center bg-gray-800 px-4 py-2 rounded-lg shadow-lg border border-gray-600">
            <FaHeart className="text-red-500 mr-2 text-lg" />
            <span className="text-white font-bold text-lg">{hearts}</span>
          </div>
        )}
        
        <h1 className="text-3xl font-bold text-blue-300 mb-3">
          Typing Challenge Levels
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Complete each level with speed and accuracy to earn stars. Earn stars
          to unlock new challenges and test your skills!
        </p>
        
        {/* Heart warning message */}
        {isAuthenticated && hearts <= 0 && (
          <div className="mt-4 mx-auto max-w-md bg-red-900 border border-red-600 rounded-lg p-3">
            <div className="flex items-center justify-center text-red-200">
              <FaHeart className="text-red-400 mr-2" />
              <span className="text-sm font-medium">
                You need hearts to play levels! Hearts regenerate over time.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Level Selection Grid - Now paginated */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl"
        key={currentPage}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.1,
            },
          },
        }}
      >
        {currentLevelsToDisplay.map((level, pageIndex) => {
          const originalIndex = indexOfFirstLevelOnPage + pageIndex;
          const status = getLevelStatus(originalIndex);
          const starsForLevel = userProgress.stars[originalIndex] || 0;
          const unlockProgress = getProgressTowardUnlock(originalIndex);
          
          // Check if level should be disabled due to no hearts
          const isDisabledDueToHearts = isAuthenticated && hearts <= 0 && status !== "locked";

          return (
            <motion.div
              key={originalIndex}
              className={`relative rounded-xl p-5 flex flex-col items-center cursor-pointer
                ${
                  status === "locked" || isDisabledDueToHearts
                    ? "bg-gray-800 opacity-80"
                    : status === "completed"
                    ? "bg-gradient-to-br from-purple-900 to-blue-900 border-2 border-blue-400"
                    : "bg-gradient-to-br from-purple-600 to-blue-700 border-2 border-yellow-400 shadow-lg shadow-blue-500/20"
                }`}
              whileHover={status !== "locked" && !isDisabledDueToHearts ? { scale: 1.03, y: -5 } : {}}
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
                    status === "locked" || isDisabledDueToHearts
                      ? "#1F2937" // Darker gray that blends with the locked overlay
                      : status === "completed"
                      ? "linear-gradient(to bottom right, #8B5CF6, #3B82F6)"
                      : "linear-gradient(to bottom right, #FBBF24, #F59E0B)",
                  zIndex: status === "locked" || isDisabledDueToHearts ? 50 : 10,
                }}
              >
                {originalIndex + 1}
              </div>

              {/* Level icon */}
              <div className="mb-4 text-4xl">
                {status === "locked" || isDisabledDueToHearts ? (
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

              {/* Level description */}
              <p className="text-gray-300 text-sm text-center mb-4">
                {status === "completed" ? (
                  <span className="flex flex-col items-center">
                    <span className="font-medium text-blue-300 mb-1">
                      Your Best Results:
                    </span>
                    <span className="flex items-center gap-2 justify-center">
                      <span className="bg-gray-700 px-2 py-1 rounded">
                        <span className="text-green-300 font-bold">
                          {userProgress.scores?.[originalIndex] || 0}
                        </span>{" "}
                        Score
                      </span>
                      <span className="bg-gray-700 px-2 py-1 rounded">
                        <span className="text-yellow-300 font-bold">
                          {userProgress.wpm?.[originalIndex] || 0}
                        </span>{" "}
                        WPM
                      </span>
                    </span>
                  </span>
                ) : (
                  level.description ||
                  `Master the art of ${level.name.toLowerCase()} syntax.`
                )}
              </p>

              {/* Stars for completed or current levels */}
              {(status === "completed" || status === "current") && (
                <div className="flex justify-center mb-3">
                  {[...Array(3)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`mx-1 text-xl ${
                        i < starsForLevel ? "text-yellow-400" : "text-gray-600"
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Play button */}
              <motion.div
                className={`mt-2 flex items-center justify-center rounded-full w-12 h-12
                  ${
                    status === "locked" || isDisabledDueToHearts
                      ? "bg-gray-700"
                      : status === "current"
                      ? "bg-gradient-to-r from-green-500 to-blue-500"
                      : "bg-gradient-to-r from-purple-500 to-blue-500"
                  }`}
                whileHover={
                  status !== "locked" && !isDisabledDueToHearts ? { scale: 1.2, rotate: 10 } : {}
                }
              >
                <FaPlayCircle
                  className={`text-2xl ${
                    status === "locked" || isDisabledDueToHearts ? "text-gray-500" : "text-white"
                  }`}
                />
              </motion.div>

              {/* Locked overlay with star requirements */}
              {status === "locked" && (
                <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black bg-opacity-90">
                  <div className="text-center px-4">
                    <FaLock className="text-3xl text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-200 mb-2 font-semibold text-shadow">
                      Level Locked
                    </p>
                    {originalIndex > 0 && (
                      <>
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-sm text-gray-300 text-shadow">
                            Requires
                          </span>
                          <span className="text-yellow-300 font-bold mx-1 text-shadow">
                            {unlockProgress.required}
                          </span>
                          <FaStar className="text-yellow-300" />
                          <span className="text-sm text-gray-200 text-shadow">
                            from Level {originalIndex}
                          </span>
                        </div>

                        {/* Progress bar toward unlocking */}
                        <div className="mt-3 w-full bg-gray-800 rounded-full h-2.5 ">
                          <div
                            className="bg-blue-400 h-2.5 rounded-full"
                            style={{ width: `${unlockProgress.percent}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-300 mt-1 font-medium">
                          {unlockProgress.current} / {unlockProgress.required}{" "}
                          stars earned
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* No hearts overlay */}
              {isDisabledDueToHearts && (
                <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black bg-opacity-90">
                  <div className="text-center px-4">
                    <FaHeart className="text-3xl text-red-400 mx-auto mb-2" />
                    <p className="text-gray-200 mb-2 font-semibold text-shadow">
                      No Hearts Left
                    </p>
                    <p className="text-sm text-gray-300 text-shadow">
                      Hearts regenerate over time
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
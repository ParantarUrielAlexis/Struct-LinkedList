import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar, FaLock, FaTrophy, FaPlayCircle, FaChevronLeft, FaChevronRight, FaHeart } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import "./LevelSelect.css";
import levelselectBG from "../../assets/snakegame/gif/levelselect_bg.gif";

// Constants for maintainability
const LEVELS = [1, 2, 3, 4, 5];
const LEVELS_PER_PAGE = 3;
const TOTAL_PAGES = 2;

// Descriptions for each level
const LEVEL_DESCRIPTIONS = {
  1: "Beginner - Perfect for new players. Learn the basics of snake movement and food collection.",
  2: "Easy - A little more challenging. Snake moves slightly faster with more obstacles.", 
  3: "Medium - Test your skills. Increased speed and tricky wall placements await you.",
  4: "Hard - For experienced players. Fast-paced gameplay with complex maze-like obstacles.",
  5: "Expert - Only for the brave! Lightning-fast snake with deadly obstacle patterns."
};

// Custom colors for each level
const LEVEL_COLORS = {
  1: "#4CAF50", // Light green
  2: "#8BC34A", // Lime green
  3: "#CDDC39", // Yellow-green
  4: "#FFC107", // Amber
  5: "#FF5722"  // Deep orange-red
};

// Level unlock requirements - stars needed from previous level
const LEVEL_REQUIREMENTS = {
  1: 0, // Level 1: Always unlocked
  2: 1, // Level 2: Requires 1 star from Level 1
  3: 1, // Level 3: Requires 1 star from Level 2
  4: 2, // Level 4: Requires 2 stars from Level 3
  5: 2  // Level 5: Requires 2 stars from Level 4
};

const LevelSelect = () => {
  const { isAuthenticated, user } = useAuth();
  const [hoveredLevel, setHoveredLevel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  
  // Heart system states
  const [hearts, setHearts] = useState(0);
  const [maxHearts, setMaxHearts] = useState(5);
  const [nextHeartIn, setNextHeartIn] = useState(null);
  const [heartLoading, setHeartLoading] = useState(false);
  
  // State for user progress
  const [userProgress, setUserProgress] = useState({
    unlockedLevels: [1], // Default: only first level unlocked
    stars: {}, // Stores { level: stars_earned }
    scores: {}, // Best scores for each level
    attempts: {}, // Number of attempts per level
    completedLevels: [] // Levels that have been completed
  });

  // Get levels for current page
  const getCurrentPageLevels = () => {
    if (currentPage === 0) {
      return [1, 2, 3];
    } else {
      return [4, 5];
    }
  };

  // Function to format remaining time
  const formatTimeRemaining = (milliseconds) => {
    if (!milliseconds || milliseconds <= 0) return null;
    
    const minutes = Math.floor(milliseconds / (60 * 1000));
    const seconds = Math.floor((milliseconds % (60 * 1000)) / 1000);
    
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins}m`;
    }
    
    return `${minutes}m ${seconds < 10 ? '0' : ''}${seconds}s`;
  };

  // Function to fetch heart data
  const fetchHeartData = async () => {
    if (!isAuthenticated) return;
    
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;
      
      const API_BASE_URL = 'http://localhost:8000';
      const response = await axios.get(
        `${API_BASE_URL}/api/user/hearts/`,
        {
          headers: {
            'Authorization': `Token ${token}`
          }
        }
      );
      
      const { hearts: userHearts, max_hearts, next_heart_in } = response.data;
      
      setHearts(userHearts);
      setMaxHearts(max_hearts || 3);
      
      // Handle next_heart_in - convert to number if it's a string
      if (next_heart_in !== null && next_heart_in !== undefined) {
        const nextHeartTime = typeof next_heart_in === 'string' ? parseFloat(next_heart_in) : next_heart_in;
        setNextHeartIn(nextHeartTime > 0 ? nextHeartTime : null);
      } else {
        setNextHeartIn(null);
      }
      
    } catch (error) {
      console.error("Error fetching heart data:", error);
    }
  };

  // Function to consume a heart
 const consumeHeart = async () => {
  if (!isAuthenticated) return true; // Allow non-authenticated users to play
  
  if (hearts <= 0) {
    return false; // Not enough hearts
  }
  
  try {
    setHeartLoading(true);
    const token = localStorage.getItem("authToken");
    if (!token) return false;
    
    const API_BASE_URL = 'http://localhost:8000';
    const response = await fetch(
      `${API_BASE_URL}/api/user/hearts/`,
      {
        method: 'POST', // or PUT, depending on your API
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'consume' // or whatever your API expects
        })
      }
    );
    
    if (!response.ok) {
      console.error("Failed to consume heart:", response.status);
      return false;
    }
    
    const data = await response.json();
    
    // Update local state immediately for better UX
    setHearts(prevHearts => Math.max(0, prevHearts - 1));
    
    // Update with server response if available
    if (data.hearts !== undefined) {
      setHearts(data.hearts);
    }
    if (data.next_heart_in !== undefined) {
      const nextHeartTime = typeof data.next_heart_in === 'string' ? parseFloat(data.next_heart_in) : data.next_heart_in;
      setNextHeartIn(nextHeartTime > 0 ? nextHeartTime : null);
    }
    
    return true;
  } catch (error) {
    console.error("Error consuming heart:", error);
    return false;
  } finally {
    setHeartLoading(false);
  }
};

  // Fetch user progress from backend or localStorage
  useEffect(() => {
    const fetchUserProgress = async () => {
      setLoading(true);
      
      if (!isAuthenticated) {
        // For non-authenticated users, use localStorage
        const savedProgress = localStorage.getItem('snakeGameProgress');
        if (savedProgress) {
          try {
            const progress = JSON.parse(savedProgress);
            setUserProgress(calculateUnlockedLevels(progress));
          } catch (error) {
            console.error("Error parsing saved progress:", error);
            setUserProgress({ unlockedLevels: [1], stars: {}, scores: {}, attempts: {}, completedLevels: [] });
          }
        }
        setLoading(false);
        return;
      }

      try {
        // Fetch snake game progress from the correct API endpoint
        const response = await fetch(
          "http://localhost:8000/api/snake-progress/me/best/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${localStorage.getItem("authToken")}`,
            },
          }
        );

        if (!response.ok) {
          console.error("Failed to fetch snake game progress:", response.status);
          // Fallback to localStorage for authenticated users too
          const savedProgress = localStorage.getItem('snakeGameProgress');
          if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            setUserProgress(calculateUnlockedLevels(progress));
          }
          setLoading(false);
          return;
        }

        const data = await response.json();
        console.log("Snake game progress data:", data);
        const processedProgress = processProgressData(data);
        setUserProgress(calculateUnlockedLevels(processedProgress));
      } catch (error) {
        console.error("Error fetching snake game progress:", error);
        // Fallback to localStorage
        const savedProgress = localStorage.getItem('snakeGameProgress');
        if (savedProgress) {
          const progress = JSON.parse(savedProgress);
          setUserProgress(calculateUnlockedLevels(progress));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProgress();

    // Listen for custom progress events from the game
    const handleProgressEvent = (event) => {
      const { level, score, stars, foodEaten, timeSurvived, gameCompleted } = event.detail;
      handleLevelComplete(level, score, stars, foodEaten, timeSurvived, gameCompleted);
    };

    // Listen for page visibility changes to refresh progress when returning from game
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Page became visible, refresh progress
        fetchUserProgress();
        if (isAuthenticated) {
          fetchHeartData();
        }
      }
    };

    // Listen for focus events to refresh progress when returning to this page
    const handleWindowFocus = () => {
      fetchUserProgress();
      if (isAuthenticated) {
        fetchHeartData();
      }
    };

    window.addEventListener('snakeGameProgress', handleProgressEvent);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleWindowFocus);
    
    return () => {
      window.removeEventListener('snakeGameProgress', handleProgressEvent);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [isAuthenticated]);

  // Fetch heart data when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      fetchHeartData();
      
      // Set up countdown timer for next heart
      const interval = setInterval(() => {
        setNextHeartIn(prev => {
          if (prev === null || prev <= 0) {
            fetchHeartData();
            return null;
          }
          return prev - 1000; // Decrement by 1 second
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Process API data into the format we need
  const processProgressData = (data) => {
    const stars = {};
    const scores = {};
    const attempts = {};
    const completedLevels = [];

    data.forEach((record) => {
      const level = record.level;
      stars[level] = record.stars_earned;
      
      // Keep track of best score
      if (!scores[level] || record.score > scores[level]) {
        scores[level] = record.score;
      }

      // Track if level was completed
      if (record.game_completed && !completedLevels.includes(level)) {
        completedLevels.push(level);
      }
    });

    return { stars, scores, attempts, completedLevels };
  };

  // Calculate which levels should be unlocked based on stars
  const calculateUnlockedLevels = (progress) => {
    const unlockedLevels = [1]; // Level 1 is always unlocked
    const stars = progress.stars || {};

    // Level unlock requirements (make sure this matches SnakeGame exactly)
    const LEVEL_REQUIREMENTS = {
      1: 0, // Level 1: Always unlocked
      2: 1, // Level 2: Requires 1 star from Level 1
      3: 1, // Level 3: Requires 1 star from Level 2
      4: 2, // Level 4: Requires 2 stars from Level 3
      5: 2  // Level 5: Requires 2 stars from Level 4
    };

    for (let level = 2; level <= LEVELS.length; level++) {
      const previousLevel = level - 1;
      const starsEarnedInPreviousLevel = stars[previousLevel] || 0;
      const starsRequiredForThisLevel = LEVEL_REQUIREMENTS[level] || 1;

      if (starsEarnedInPreviousLevel >= starsRequiredForThisLevel) {
        unlockedLevels.push(level);
      } else {
        // If this level can't be unlocked, no subsequent levels can be unlocked either
        break;
      }
    }

    return {
      ...progress,
      unlockedLevels
    };
  };

  // Save progress to localStorage (for non-authenticated users or as backup)
  const saveProgressToLocalStorage = (progress) => {
    try {
      localStorage.setItem('snakeGameProgress', JSON.stringify(progress));
    } catch (error) {
      console.error("Error saving progress to localStorage:", error);
    }
  };

  // Handle level completion (call this from your game component)
  const handleLevelComplete = async (level, score, stars, foodEaten = 0, timeSurvived = 0, gameCompleted = false) => {
    const newProgress = {
      ...userProgress,
      stars: {
        ...userProgress.stars,
        [level]: Math.max(userProgress.stars[level] || 0, stars)
      },
      scores: {
        ...userProgress.scores,
        [level]: Math.max(userProgress.scores[level] || 0, score)
      },
      attempts: {
        ...userProgress.attempts,
        [level]: (userProgress.attempts[level] || 0) + 1
      },
      completedLevels: gameCompleted && !userProgress.completedLevels.includes(level) 
        ? [...userProgress.completedLevels, level]
        : userProgress.completedLevels
    };

    const updatedProgress = calculateUnlockedLevels(newProgress);
    setUserProgress(updatedProgress);
    saveProgressToLocalStorage(updatedProgress);

    // If authenticated, also save to backend
    if (isAuthenticated) {
      await saveProgressToBackend(level, score, stars, foodEaten, timeSurvived, gameCompleted);
    }
  };

  // Save progress to backend
  const saveProgressToBackend = async (level, score, stars, foodEaten = 0, timeSurvived = 0, gameCompleted = false) => {
    try {
      const response = await fetch("http://localhost:8000/api/snake-progress/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          level,
          score,
          food_eaten: foodEaten,
          time_survived: timeSurvived,
          game_completed: gameCompleted,
          stars_earned: stars
        }),
      });

      if (!response.ok) {
        console.error("Failed to save progress to backend:", response.status);
        const errorData = await response.json();
        console.error("Error details:", errorData);
      } else {
        console.log("Progress saved successfully to backend");
      }
    } catch (error) {
      console.error("Error saving progress to backend:", error);
    }
  };

  const handleLevelSelect = async (level) => {
  if (!userProgress.unlockedLevels.includes(level)) {
    return; // Level is locked
  }

  // Check hearts for authenticated users
  if (isAuthenticated) {
    if (hearts <= 0) {
      alert("You don't have enough hearts to play! Wait for hearts to regenerate or purchase more.");
      return;
    }

    // Show loading state while consuming heart
    setHeartLoading(true);
    
    try {
      // Consume a heart before starting the level
      const heartConsumed = await consumeHeart();
      if (!heartConsumed) {
        alert("Failed to consume heart. Please try again.");
        return;
      }
    } catch (error) {
      console.error("Error consuming heart:", error);
      alert("Failed to consume heart. Please try again.");
      return;
    } finally {
      setHeartLoading(false);
    }
  }

  console.log(`Navigating to level ${level}`);
  // Pass the handleLevelComplete function to the game component
  // You might want to use React Router instead of window.location.href
  window.location.href = `/snake-game/${level}`;
};

  // Determine level status
  const getLevelStatus = (level) => {
    if (userProgress.unlockedLevels.includes(level)) {
      return userProgress.completedLevels.includes(level) ? "completed" : "current";
    }
    return "locked";
  };

  // Get progress toward unlocking a level
  const getProgressTowardUnlock = (level) => {
    if (level === 1) return { current: 0, required: 0 };

    const prevLevel = level - 1;
    const starsEarned = userProgress.stars[prevLevel] || 0;
    const starsRequired = LEVEL_REQUIREMENTS[level] || 1;

    return {
      current: starsEarned,
      required: starsRequired,
      percent: Math.min(100, (starsEarned / starsRequired) * 100),
    };
  };

  // Updated canNavigateToPage function - now allows all pages
  const canNavigateToPage = (pageIndex) => {
    // Allow navigation to all pages regardless of unlock status
    return pageIndex >= 0 && pageIndex < TOTAL_PAGES;
  };

  // Updated handlePageChange function - simplified
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < TOTAL_PAGES) {
      setCurrentPage(newPage);
    }
  };

  if (loading) {
    return (
      <div className="level-select-screen">
        <div className="background-container">
          <div 
            className="pixelated-bg"
            style={{ 
              backgroundImage: `url(${levelselectBG})`,
            }}
          />
        </div>
        <div className="content-container flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-400 mx-auto mb-4"></div>
            <p className="text-green-200 pixel-text">Loading your progress...</p>
          </div>
        </div>
      </div>
    );
  }

  const currentPageLevels = getCurrentPageLevels();

  return (
    <div className="level-select-screen">
      <div className="background-container">
        <div 
          className="pixelated-bg"
          style={{ 
            backgroundImage: `url(${levelselectBG})`,
          }}
        />
      </div>
      <div className="content-container">
        <div className="flex items-center justify-between mb-8">
          
          {/* Page navigation button - Left */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className={`p-3 rounded-lg transition-all duration-300 ${
              currentPage === 0
                ? 'text-gray-500 cursor-not-allowed opacity-50'
                : 'text-green-400 hover:text-green-300 hover:bg-green-900 hover:bg-opacity-30'
            }`}
          >
            <FaChevronLeft size={24} />
          </button>

          {/* Title and Hearts */}
          <div className="flex flex-col items-center">
            <h1 className="text-4xl font-bold text-center text-green-100 uppercase tracking-wider pixel-text mb-2">
              Choose Your Snake Game Level
            </h1>
            
            {/* Hearts display for authenticated users */}
            {isAuthenticated && (
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center bg-green-900/60 px-4 py-2 rounded-lg pixel-border">
                  <div className="flex items-center">
                    <span className="text-green-200 text-sm pixel-text mr-2">Hearts:</span>
                    <span className="text-white font-bold pixel-text">{hearts}</span>
                    <FaHeart className="text-red-500 ml-1" size={12} />
                    <span className="text-green-300 pixel-text text-sm ml-1">/{maxHearts}</span>
                  </div>
                </div>
                
                {nextHeartIn && nextHeartIn > 0 && hearts < maxHearts && (
                  <div className="text-xs text-green-300 pixel-text mt-1 bg-green-900/30 px-2 py-1 rounded">
                    Next heart in: {formatTimeRemaining(nextHeartIn)}
                  </div>
                )}
                
                {hearts === 0 && (
                  <div className="text-xs text-red-300 pixel-text mt-1 bg-red-900/30 px-2 py-1 rounded">
                    No hearts left! Wait for regeneration
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Page navigation button - Right */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= TOTAL_PAGES - 1 || !canNavigateToPage(currentPage + 1)}
            className={`p-3 rounded-lg transition-all duration-300 ${
              currentPage >= TOTAL_PAGES - 1 || !canNavigateToPage(currentPage + 1)
                ? 'text-gray-500 cursor-not-allowed opacity-50'
                : 'text-green-400 hover:text-green-300 hover:bg-green-900 hover:bg-opacity-30'
            }`}
          >
            <FaChevronRight size={24} />
          </button>
        </div>

        {/* Page indicator */}
        <div className="flex justify-center mb-6">
          <div className="flex gap-2">
            {Array.from({ length: TOTAL_PAGES }).map((_, pageIndex) => (
              <button
                key={pageIndex}
                onClick={() => handlePageChange(pageIndex)}
                disabled={!canNavigateToPage(pageIndex)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentPage === pageIndex
                    ? 'bg-green-400 shadow-lg shadow-green-400/50'
                    : canNavigateToPage(pageIndex)
                    ? 'bg-green-700 hover:bg-green-600'
                    : 'bg-gray-600 cursor-not-allowed'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Current page indicator text */}
        <div className="text-center mb-8">
          <p className="text-green-200 pixel-text text-sm">
            {currentPage === 0 ? "Basic Levels (1-3)" : "Advanced Levels (4-5)"}
          </p>
        </div>
        
        <div className="flex-1 flex justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="flex justify-center gap-8 w-full flex-wrap"
            >
              {currentPageLevels.map((levelNumber) => {
                const status = getLevelStatus(levelNumber);
                const starsForLevel = userProgress.stars[levelNumber] || 0;
                const unlockProgress = getProgressTowardUnlock(levelNumber);
                const bestScore = userProgress.scores[levelNumber] || 0;
                const attempts = userProgress.attempts[levelNumber] || 0;
                const canPlay = status !== "locked" && (!isAuthenticated || hearts > 0);

                return (
                  <motion.div
                    key={levelNumber}
                    className={`level-card pixel-border w-80 h-96 flex flex-col items-center justify-center rounded-2xl p-8 cursor-pointer transform transition-all duration-300 relative mx-4
                      ${status === "locked" ? "opacity-60" : 
                        !canPlay ? "opacity-70" : "hover:scale-105"}`}
                    style={{
                      borderColor: status === "locked" ? "#666" : 
                                 !canPlay ? "#999" : LEVEL_COLORS[levelNumber],
                      boxShadow: hoveredLevel === levelNumber && canPlay 
                        ? `0 0 30px ${LEVEL_COLORS[levelNumber]}` 
                        : 'none'
                    }}
                    onClick={() => handleLevelSelect(levelNumber)}
                    onMouseEnter={() => setHoveredLevel(levelNumber)}
                    onMouseLeave={() => setHoveredLevel(null)}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => e.key === "Enter" && handleLevelSelect(levelNumber)}
                    whileHover={canPlay ? { scale: 1.05 } : {}}
                    whileTap={canPlay ? { scale: 0.95 } : {}}
                    layout
                  >
                    {/* Level number badge */}
                    <div
                      className="absolute -top-4 -left-4 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl pixel-text border-2 border-white"
                      style={{
                        background: status === "locked" || !canPlay
                          ? "#374151" 
                          : `linear-gradient(145deg, ${LEVEL_COLORS[levelNumber]}, #1a4d1a)`,
                        color: "white"
                      }}
                    >
                      {levelNumber}
                    </div>

                    {/* Heart cost indicator for authenticated users */}
                    {isAuthenticated && status !== "locked" && (
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold pixel-text">
                        <FaHeart size={10} />
                      </div>
                    )}

                    <div className="level-content text-center flex flex-col items-center justify-between h-full">
                      {/* Level icon */}
                      <div className="mb-4 text-5xl">
                        {status === "locked" ? (
                          <FaLock className="text-gray-400" />
                        ) : status === "completed" ? (
                          <FaTrophy className="text-yellow-400" />
                        ) : (
                          <FaPlayCircle style={{ color: !canPlay ? "#999" : LEVEL_COLORS[levelNumber] }} />
                        )}
                      </div>

                      <div className="flex-1 flex flex-col justify-center">
                        <h2 className="text-4xl font-bold mb-4 pixel-text" 
                            style={{ color: status === "locked" || !canPlay ? "#666" : LEVEL_COLORS[levelNumber] }}>
                          Level {levelNumber}
                        </h2>
                        
                        {/* Stars display for unlocked levels */}
                        {status !== "locked" && (
                          <div className="flex justify-center mb-4">
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

                        {/* Best score display for completed levels */}
                        {status === "completed" && bestScore > 0 && (
                          <div className="mb-4 text-center">
                            <div className="text-sm text-green-200 opacity-80 pixel-text">Best Score</div>
                            <div className="text-2xl font-bold text-yellow-300 pixel-text">{bestScore}</div>
                          </div>
                        )}

                        {/* Attempts display for unlocked levels */}
                        {status !== "locked" && attempts > 0 && (
                          <div className="mb-3 text-center">
                            <div className="text-sm text-green-200 opacity-60 pixel-text">
                              Attempts: {attempts}
                            </div>
                          </div>
                        )}
                        
                        <div className="difficulty-indicators flex justify-center gap-2 my-4">
                          {Array.from({ length: levelNumber }).map((_, index) => (
                            <div 
                              key={index} 
                              className="difficulty-dot w-4 h-4 rounded-full pixel-dot"
                              style={{ 
                                background: status === "locked" || !canPlay
                                  ? "#666" 
                                  : `linear-gradient(145deg, ${LEVEL_COLORS[levelNumber]}, #1a4d1a)`,
                                opacity: hoveredLevel === levelNumber && canPlay ? 1 : 0.8
                              }}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <p className="text-sm mt-4 text-green-100 opacity-90 pixel-text leading-relaxed text-center">
                        {LEVEL_DESCRIPTIONS[levelNumber]}
                      </p>
                    </div>

                    {/* No hearts overlay for authenticated users */}
                    {isAuthenticated && status !== "locked" && hearts === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black bg-opacity-80">
                        <div className="text-center px-6">
                          <FaHeart className="text-3xl text-red-400 mx-auto mb-3" />
                          <p className="text-red-200 mb-3 font-semibold pixel-text text-base">
                            No Hearts Left!
                          </p>
                          <p className="text-gray-300 text-sm pixel-text">
                            Wait for hearts to regenerate
                          </p>
                          {nextHeartIn && nextHeartIn > 0 && (
                            <div className="text-xs text-green-300 pixel-text mt-2 bg-green-900/30 px-2 py-1 rounded">
                              Next in: {formatTimeRemaining(nextHeartIn)}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Locked overlay */}
                    {status === "locked" && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black bg-opacity-80">
                        <div className="text-center px-6">
                          <FaLock className="text-3xl text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-200 mb-3 font-semibold pixel-text text-base">
                            Level Locked
                          </p>
                          {levelNumber > 1 && (
                            <>
                              <div className="flex items-center justify-center gap-2 mb-3">
                                <span className="text-sm text-gray-300 pixel-text">
                                  Need
                                </span>
                                <span className="text-yellow-300 font-bold mx-1 pixel-text text-lg">
                                  {unlockProgress.required}
                                </span>
                                <FaStar className="text-yellow-300 text-sm" />
                                <span className="text-sm text-gray-200 pixel-text">
                                  from Level {levelNumber - 1}
                                </span>
                              </div>

                              {/* Progress bar */}
                              <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                                <div
                                  className="bg-green-400 h-3 rounded-full transition-all duration-300"
                                  style={{ width: `${unlockProgress.percent}%` }}
                                />
                              </div>
                              <div className="text-sm text-gray-300 pixel-text">
                                {unlockProgress.current} / {unlockProgress.required} stars
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Game description with progress summary */}
        <div className="mt-8 max-w-3xl mx-auto p-6 bg-green-900/60 rounded-lg pixel-border">
          <button 
            onClick={() => window.location.href = '/games'}
            className="mb-4 flex items-center gap-2 px-4 py-2 text-green-300 hover:text-green-100 
                     bg-green-900/60 hover:bg-green-800/80 rounded-lg transition-all duration-300 
                     pixel-text border border-green-500/30 text-sm w-full justify-center"
          >
            <FaChevronLeft />
            Back to Games
          </button>
          <h3 className="text-xl font-semibold mb-3 text-green-200 pixel-text">About Snake Game</h3>
          <p className="text-green-100/90 pixel-text mb-4 text-sm">
            Navigate the snake to collect food while avoiding walls and your own tail.
            Each level introduces new challenges, faster gameplay, and unique obstacle patterns.
            Earn stars based on your performance to unlock advanced levels!
          </p>

          <div className="flex justify-center items-center gap-4 text-sm flex-wrap">
            <div className="flex items-center gap-1">
              <span className="text-green-200">Levels:</span>
              <span className="text-yellow-300 font-bold">{userProgress.unlockedLevels.length}/{LEVELS.length}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-green-200">Stars:</span>
              <FaStar className="text-yellow-400" />
              <span className="text-yellow-300 font-bold">
                {Object.values(userProgress.stars).reduce((s, n) => s + n, 0)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-green-200">Completed:</span>
              <span className="text-yellow-300 font-bold">{userProgress.completedLevels.length}/{LEVELS.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export the level progress hook for use in game components
export const useLevelProgress = () => {
  // This hook can be used in your game components to report progress
  const handleLevelComplete = (level, score, stars, foodEaten = 0, timeSurvived = 0, gameCompleted = false) => {
    // Dispatch a custom event that the LevelSelect component can listen to
    window.dispatchEvent(new CustomEvent('snakeGameProgress', {
      detail: { level, score, stars, foodEaten, timeSurvived, gameCompleted }
    }));
  };

  return { handleLevelComplete };
};

export default LevelSelect;
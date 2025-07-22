import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaGamepad, FaTrophy, FaRedo, FaLightbulb, FaArrowRight, FaSort, FaPlay, FaStar, FaChevronRight } from "react-icons/fa";
import axios from 'axios';


const Slide3 = () => {
  const [showCover, setShowCover] = useState(true);
  const [gameState, setGameState] = useState({
    level: 1,
    score: 0,
    currentArray: [],
    sortedArray: [],
    minimumValue: null,
    sortedElements: [],
    feedback: "Drag the minimum value to the box on the right",
    isCompleted: false,
    showHint: false
  });
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [pointsAwarded, setPointsAwarded] = useState(0);

  // Initialize or reset the game when component mounts or reset is clicked
  useEffect(() => {
    initializeGame(1);
  }, []);
  const submitQuizScore = async (finalScore) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("No authentication token found");
      return { success: false, error: "Not authenticated" };
    }
    
    const API_BASE_URL = 'http://localhost:8000';
    
    const response = await axios.post(
      `${API_BASE_URL}/api/update-points/`,
      {
        score: finalScore,
        quiz_type: 'selection_sort' 
      },
      {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return {
      success: true,
      data: response.data
    };
    
  } catch (error) {
    console.error("Error submitting quiz score:", error);
    return { 
      success: false, 
      error: error.response?.data?.message || "Failed to submit score" 
    };
  }
};

const handleGameCompletion = async (finalScore) => {
  try {
    setScoreSubmitted(true);
    
    const result = await submitQuizScore(finalScore);
    
    if (result.success) {
      // Check if it's a new high score
      if (result.data.is_new_high_score) {
        setIsNewHighScore(true);
      }
      
      // Set points awarded 
      const points = result.data.points_awarded || finalScore;
      setPointsAwarded(points);
      
      console.log("Score submitted successfully:", result.data);
    } else {
      console.error("Failed to submit score:", result.error);
    }
  } catch (error) {
    console.error("Error in game completion:", error);
  }
};


  // Generate a random array for the game
  const generateRandomArray = (size) => {
    const array = [];
    while (array.length < size) {
      const num = Math.floor(Math.random() * 99) + 1;
      if (!array.includes(num)) {
        array.push(num);
      }
    }
    return array;
  };

  // Initialize the game with a given level
  const initializeGame = (level) => {
    const sizes = { 1: 5, 2: 8, 3: 10 };
    const size = sizes[level] || 5;
    const newArray = generateRandomArray(size);
    
    setGameState({
      level,
      score: level === 1 ? 0 : gameState.score,
      currentArray: newArray,
      sortedArray: [...newArray].sort((a, b) => a - b),
      minimumValue: null,
      sortedElements: [],
      feedback: "Find and select the minimum value",
      isCompleted: false,
      showHint: false
    });
  };

  // Handle clicking on a number in the unsorted array
  const handleSelectValue = (value) => {
    // If we already have a minimum value or this element is already sorted, ignore
    if (gameState.minimumValue !== null || gameState.sortedElements.includes(value)) {
      return;
    }
    
    // Find the minimum value from remaining unsorted elements
    const unsortedValues = gameState.currentArray.filter(val => !gameState.sortedElements.includes(val));
    const actualMinimum = Math.min(...unsortedValues);
    
    if (value === actualMinimum) {
      // Correct selection
      setGameState({
        ...gameState,
        minimumValue: value,
        feedback: "Correct! Now click the arrow to place it in the sorted area."
      });
    } else {
      // Wrong selection
      setGameState({
        ...gameState,
        feedback: "That's not the minimum value. Try again!"
      });
    }
  };

  // Handle moving the selected minimum to the sorted array
  const handleSortValue = () => {
    if (gameState.minimumValue === null) {
      return;
    }
    
    // Add the minimum to sorted elements
    const newSortedElements = [...gameState.sortedElements, gameState.minimumValue];
    
    // Check if sorted elements match the expected sorted array so far
    const isCorrect = newSortedElements.every((val, idx) => 
      val === gameState.sortedArray[idx]
    );
    
    if (!isCorrect) {
      setGameState({
        ...gameState,
        feedback: "Something went wrong. Try again!",
        minimumValue: null
      });
      return;
    }
    
    // Update score
    const newScore = gameState.score + 20;
    
    // Check if level is completed
    const requiredPasses = gameState.level === 1 ? 2 : gameState.level === 2 ? 4 : gameState.currentArray.length;
    
    if (newSortedElements.length >= requiredPasses) {
      // Level completed
      if (gameState.level < 3) {
        // Advance to next level
        setGameState({
          ...gameState,
          sortedElements: newSortedElements,
          minimumValue: null,
          score: newScore,
          feedback: `Level ${gameState.level} completed! Moving to next level...`
        });
        
        // Move to next level after a short delay
        setTimeout(() => {
          initializeGame(gameState.level + 1);
        }, 2000);
      } else {
        // Game completed
        setGameState({
          ...gameState,
          sortedElements: newSortedElements,
          minimumValue: null,
          score: newScore,
          feedback: "Congratulations! You've mastered Selection Sort!",
          isCompleted: true
        });
        handleGameCompletion(newScore);
      }
    } else {
      // Continue with next pass
      setGameState({
        ...gameState,
        sortedElements: newSortedElements,
        minimumValue: null,
        score: newScore,
        feedback: `Perfect! Pass ${newSortedElements.length} completed. Find the next minimum value.`
      });
    }
  };

  // Cover page component
  const CoverPage = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden"
    >
      <div className="h-48 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
        <div className="absolute inset-0 bg-pattern opacity-20">
          <div className="w-20 h-20 rounded-full bg-white absolute top-10 left-10 opacity-20"></div>
          <div className="w-16 h-16 rounded-full bg-white absolute bottom-10 right-10 opacity-10"></div>
          <div className="w-24 h-24 rounded-full bg-white absolute top-20 right-20 opacity-10"></div>
        </div>
        <div className="h-full flex items-center justify-center p-6">
          <div className="text-center">
            <h2 className="text-white text-3xl md:text-4xl font-bold flex items-center justify-center drop-shadow-lg">
              <FaSort className="mr-4" />
              Selection Sort Challenge
            </h2>
            <p className="text-blue-100 mt-2">
              Learn selection sort by actually performing it!
            </p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <FaGamepad className="mr-2 text-blue-500" /> Interactive Challenge
          </h3>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded flex items-center">
            <FaStar className="mr-1" /> 3 Levels
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-blue-50 p-5 rounded-lg">
            <h3 className="font-bold text-blue-800 mb-3">How Selection Sort Works</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <FaChevronRight className="mt-1 mr-2 text-blue-500 flex-shrink-0" />
                <span>Find the smallest element in the unsorted part</span>
              </li>
              <li className="flex items-start">
                <FaChevronRight className="mt-1 mr-2 text-blue-500 flex-shrink-0" />
                <span>Move it to the beginning of the unsorted part</span>
              </li>
              <li className="flex items-start">
                <FaChevronRight className="mt-1 mr-2 text-blue-500 flex-shrink-0" />
                <span>Expand the sorted portion by one element</span>
              </li>
              <li className="flex items-start">
                <FaChevronRight className="mt-1 mr-2 text-blue-500 flex-shrink-0" />
                <span>Repeat until the entire array is sorted</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-indigo-50 p-5 rounded-lg">
            <h3 className="font-bold text-indigo-800 mb-3">How to Play</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <FaChevronRight className="mt-1 mr-2 text-indigo-500 flex-shrink-0" />
                <span>Find and select the minimum value in the unsorted portion</span>
              </li>
              <li className="flex items-start">
                <FaChevronRight className="mt-1 mr-2 text-indigo-500 flex-shrink-0" />
                <span>Click the arrow to move it to the sorted portion</span>
              </li>
              <li className="flex items-start">
                <FaChevronRight className="mt-1 mr-2 text-indigo-500 flex-shrink-0" />
                <span>Complete each level by performing the required passes</span>
              </li>
              <li className="flex items-start">
                <FaChevronRight className="mt-1 mr-2 text-indigo-500 flex-shrink-0" />
                <span>Earn 20 points for each correct placement</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-md border border-purple-100 mb-6">
          <div className="flex items-center">
            <FaLightbulb className="text-purple-500 mr-3 text-xl flex-shrink-0" />
            <div>
              <p className="font-medium text-purple-800">Learning Goal</p>
              <p className="text-sm mt-1">
                By playing this challenge, you'll understand how selection sort works through hands-on practice,
                reinforcing the algorithm's step-by-step process of building a sorted array.
              </p>
            </div>
          </div>
        </div>
        
        <motion.button
          onClick={() => setShowCover(false)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md flex items-center justify-center shadow-md"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <FaPlay className="mr-2" /> Start Challenge
        </motion.button>
      </div>
    </motion.div>
  );

  // Render the UI
  return (
    <div className="space-y-4">
      {showCover ? (
        <CoverPage />
      ) : (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="text-xl font-medium flex items-center">
            <FaGamepad className="mr-2 text-blue-600" /> Selection Sort Challenge
          </h3>
          
          <p className="mt-2">
            Test your understanding of Selection Sort with this interactive challenge! 
            Select the minimum value and move it to the sorted portion.
          </p>
          
          {/* Game container */}
          <div className="mt-4 p-4 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg border border-blue-200 shadow-md">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <div className="bg-white px-3 py-2 rounded-lg shadow-sm border border-blue-200">
                  <div className="flex items-center">
                    <FaTrophy className="text-yellow-500 mr-2" />
                    <span className="font-bold">Score: {gameState.score}</span>
                  </div>
                </div>
                <div className="ml-4 px-3 py-2 bg-blue-600 text-white rounded-lg shadow-sm">
                  <span className="font-bold">Level: {gameState.level}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button 
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-md text-sm shadow transition flex items-center"
                  onClick={() => setGameState({...gameState, showHint: !gameState.showHint})}
                >
                  <FaLightbulb className="mr-1" /> {gameState.showHint ? "Hide Hint" : "Show Hint"}
                </button>
                
                <button 
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-2 rounded-md text-sm shadow transition flex items-center"
                  onClick={() => setShowCover(true)}
                >
                  <FaGamepad className="mr-1" /> Instructions
                </button>
              </div>
            </div>
            
            {gameState.showHint && (
              <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
                <p className="text-sm">
                  <strong>Hint:</strong> In Selection Sort, find the smallest element in the unsorted portion, and move it to the sorted portion.
                </p>
              </div>
            )}
            
            <div className="text-center mb-6 bg-white p-3 rounded-lg shadow-sm border border-blue-200">
              <h4 className="font-bold text-blue-800">
                {gameState.level === 1 ? "Level 1: Perform the FIRST 2 passes of Selection Sort" : 
                 gameState.level === 2 ? "Level 2: Perform the FIRST 4 passes of Selection Sort" :
                 "Level 3: Complete the ENTIRE Selection Sort"}
              </h4>
              <p className="text-sm text-gray-600">
                Pass {gameState.sortedElements.length + 1}: Find the minimum element and move it to the sorted portion
              </p>
            </div>

            {/* Main game area */}
            <div className="flex flex-col mb-6">
              {/* Unsorted array */}
              <div className="w-full mb-4">
                <h5 className="font-medium text-center mb-2">Unsorted Portion</h5>
                <div className="flex justify-center flex-wrap gap-3 p-4 bg-white rounded-lg shadow-inner border-2 border-dashed border-blue-300 min-h-[80px]">
                  {gameState.currentArray.map((value, index) => (
                    !gameState.sortedElements.includes(value) && (
                      <div 
                        key={index}
                        className={`px-4 py-3 bg-gradient-to-br ${gameState.minimumValue === value ? 'from-green-500 to-green-600' : 'from-blue-500 to-blue-600'} text-white font-bold rounded-lg shadow-md cursor-pointer transition-transform transform hover:scale-105`}
                        onClick={() => handleSelectValue(value)}
                      >
                        {value}
                      </div>
                    )
                  ))}
                </div>
              </div>
              
              {/* Selection and sorted areas */}
              <div className="flex items-center justify-center mb-4">
                <div className="text-center p-2 bg-blue-100 rounded-lg border border-blue-300 w-40">
                  <h5 className="font-medium text-blue-800 mb-2">Minimum Value</h5>
                  <div className="h-14 flex items-center justify-center bg-white rounded-lg shadow-inner border-2 border-dashed border-blue-300">
                    {gameState.minimumValue !== null && (
                      <div className="px-4 py-3 bg-gradient-to-br from-green-500 to-green-600 text-white font-bold rounded-lg shadow-md">
                        {gameState.minimumValue}
                      </div>
                    )}
                  </div>
                </div>
                
                <button 
                  className={`mx-4 p-2 rounded-full ${gameState.minimumValue === null ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 cursor-pointer'}`}
                  onClick={handleSortValue}
                  disabled={gameState.minimumValue === null}
                >
                  <FaArrowRight className="text-white text-xl" />
                </button>
                
                <div className="text-center p-2 bg-green-100 rounded-lg border border-green-300 flex-grow">
                  <h5 className="font-medium text-green-800 mb-2">Sorted Portion</h5>
                  <div className="flex flex-wrap justify-center gap-2 p-3 bg-white rounded-lg shadow-inner border-2 border-dashed border-green-300 min-h-[60px]">
                    {gameState.sortedElements.map((value, index) => (
                      <div 
                        key={index}
                        className="px-4 py-3 bg-gradient-to-br from-green-500 to-green-600 text-white font-bold rounded-lg shadow-md"
                      >
                        {value}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Feedback and controls */}
            <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4">
              <div className={`p-3 rounded-lg border flex-grow text-center shadow-sm ${
                gameState.feedback.includes("Correct") || gameState.feedback.includes("Perfect") ? 
                'bg-green-100 border-green-300 text-green-800' : 
                gameState.feedback.includes("wrong") || gameState.feedback.includes("not") ? 
                'bg-red-100 border-red-300 text-red-800' : 
                'bg-white border-blue-200 text-blue-800'
              }`}>
                <p className="font-medium">{gameState.feedback}</p>
              </div>
              
              <button 
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md shadow transition flex items-center"
                onClick={() => initializeGame(gameState.level)}
              >
                <FaRedo className="mr-1" /> Reset Level
              </button>
            </div>
          </div>
          
          {/* Completion modal */}
          {gameState.isCompleted && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                    <FaTrophy className="text-4xl text-yellow-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-800 mb-2">
                    Challenge Complete!
                  </h3>
                  
                  {isNewHighScore && (
                    <div className="mb-2 p-2 bg-yellow-100 border border-yellow-300 rounded-lg">
                      <p className="text-yellow-800 font-bold">🎉 New High Score! 🎉</p>
                    </div>
                  )}
                  
                  <p className="mb-4">You've mastered the Selection Sort algorithm!</p>
                  
                  <div className="bg-gray-100 p-3 rounded-lg mb-4">
                    <p className="font-medium">Final Score: {gameState.score}</p>
                    {pointsAwarded > 0 && (
                      <p className="text-green-600">Points Awarded: +{pointsAwarded}</p>
                    )}
                  </div>
                  
                  {scoreSubmitted ? (
                    <p className="text-green-600 text-sm mb-4">
                      ✓ Score saved successfully!
                    </p>
                  ) : (
                    <p className="text-blue-600 text-sm mb-4">
                      Saving score...
                    </p>
                  )}
                  
                  <div className="flex gap-2 justify-center">
                    <button 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow transition"
                      onClick={() => {
                        // Reset all completion states
                        setScoreSubmitted(false);
                        setIsNewHighScore(false);
                        setPointsAwarded(0);
                        initializeGame(1);
                      }}
                    >
                      Play Again
                    </button>
                    <button 
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md shadow transition"
                      onClick={() => setShowCover(true)}
                    >
                      Back to Menu
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Slide3;
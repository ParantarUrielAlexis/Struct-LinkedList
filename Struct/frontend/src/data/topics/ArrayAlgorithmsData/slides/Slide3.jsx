import React, { useState, useEffect } from "react";
import { FaGamepad, FaTrophy, FaRedo, FaLightbulb, FaArrowRight } from "react-icons/fa";

const Slide3 = () => {
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

  // Initialize or reset the game when component mounts or reset is clicked
  useEffect(() => {
    initializeGame(1);
  }, []);

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
    const newScore = gameState.score + 100;
    
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

  // Render the UI
  return (
    <div className="space-y-4">
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
            
            <div>
              <button 
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-md text-sm shadow transition flex items-center"
                onClick={() => setGameState({...gameState, showHint: !gameState.showHint})}
              >
                <FaLightbulb className="mr-1" /> {gameState.showHint ? "Hide Hint" : "Show Hint"}
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
                <h3 className="text-2xl font-bold text-green-800 mb-2">Challenge Complete!</h3>
                <p className="mb-4">You've mastered the Selection Sort algorithm!</p>
                <div className="bg-gray-100 p-3 rounded-lg mb-4">
                  <p className="font-medium">Final Score: {gameState.score}</p>
                </div>
                <button 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow transition"
                  onClick={() => initializeGame(1)}
                >
                  Play Again
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Slide3;
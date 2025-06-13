import React, { useState, useEffect } from "react";
import { FaGamepad, FaTrophy, FaRedo, FaLightbulb, FaExchangeAlt, FaTimes } from "react-icons/fa";

const BubbleSortChallenge = () => {
  const [gameState, setGameState] = useState({
    level: 1,
    score: 0,
    currentArray: [],
    sortedArray: [],
    currentPairIndices: [0, 1], // Start with first two elements
    passesCompleted: 0,
    currentPass: 0,
    feedback: "Should these elements be swapped?",
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
    const sizes = { 1: 5, 2: 7, 3: 9 };
    const size = sizes[level] || 5;
    const newArray = generateRandomArray(size);
    
    setGameState({
      level,
      score: level === 1 ? 0 : gameState.score,
      currentArray: newArray,
      sortedArray: [...newArray].sort((a, b) => a - b),
      currentPairIndices: [0, 1], // Start with first pair
      passesCompleted: 0,
      currentPass: 0,
      feedback: "Should these elements be swapped?",
      isCompleted: false,
      showHint: false
    });
  };

  // Handle answer to swap question (Yes or No)
  const handleSwapDecision = (shouldSwap) => {
    const { currentArray, currentPairIndices, currentPass } = gameState;
    
    // Get the values of the current pair
    const leftIndex = currentPairIndices[0];
    const rightIndex = currentPairIndices[1];
    const leftValue = currentArray[leftIndex];
    const rightValue = currentArray[rightIndex];
    
    // Check if their decision is correct according to bubble sort rules
    const needsSwap = leftValue > rightValue;
    const isCorrectDecision = shouldSwap === needsSwap;
    
    // Create a new array for the next state
    let newArray = [...currentArray];
    let newScore = gameState.score;
    let newFeedback = "";
    
    // If decision is incorrect, don't proceed to next pair
    if (!isCorrectDecision) {
      if (shouldSwap) {
        newFeedback = "Incorrect. These elements don't need to be swapped. Try again.";
      } else {
        newFeedback = "Incorrect. These elements should be swapped. Try again.";
      }
      
      // Stay on the current pair, don't make any changes to the array
      setGameState({
        ...gameState,
        feedback: newFeedback
      });
      return;
    }
    
    // If we reach here, the decision was correct
    if (shouldSwap) {
      // Perform swap
      newArray[leftIndex] = rightValue;
      newArray[rightIndex] = leftValue;
      newScore += 50;
      newFeedback = "Correct! These elements needed to be swapped.";
    } else {
      // Correctly decided not to swap
      newScore += 50;
      newFeedback = "Correct! These elements were already in the right order.";
    }
    
    // Determine next pair to check
    let nextLeft = leftIndex + 1;
    let nextRight = rightIndex + 1;
    
    // Check if we've reached the end of this pass
    const isPassComplete = nextRight >= currentArray.length - currentPass;
    
    if (isPassComplete) {
      // Increment pass
      const newPass = currentPass + 1;
      
      // Check if bubble sort is being performed correctly
      const isBubbleSortCorrect = checkBubbleSortProgress(newArray, newPass);
      
      if (!isBubbleSortCorrect) {
        // Array is not being sorted correctly according to bubble sort
        newFeedback = "The array isn't being sorted correctly. Let's try this pass again.";
        
        // Reset the current pass
        setGameState({
          ...gameState,
          feedback: newFeedback,
        });
        
        // Reset the level after a delay
        setTimeout(() => {
          initializeGame(gameState.level);
        }, 2500);
        
        return;
      }
      
      // Check if array is fully sorted
      const isArrayFullySorted = JSON.stringify(newArray) === JSON.stringify(gameState.sortedArray);
      
      // If array is fully sorted, level is complete
      if (isArrayFullySorted) {
        // Level completed
        if (gameState.level < 3) {
          // Advance to next level
          setGameState({
            ...gameState,
            currentArray: newArray,
            score: newScore,
            feedback: `${newFeedback} Array sorted! Moving to level ${gameState.level + 1}...`
          });
          
          // Move to next level after a short delay
          setTimeout(() => {
            initializeGame(gameState.level + 1);
          }, 2000);
        } else {
          // Game completed
          setGameState({
            ...gameState,
            currentArray: newArray,
            score: newScore,
            feedback: "Congratulations! You've mastered Bubble Sort!",
            isCompleted: true
          });
        }
      } else {
        // Continue with next pass since array is not fully sorted
        setGameState({
          ...gameState,
          currentArray: newArray,
          score: newScore,
          currentPairIndices: [0, 1], // Reset to first pair
          passesCompleted: gameState.passesCompleted + 1,
          currentPass: newPass,
          feedback: `${newFeedback} Pass ${newPass} completed. Continue sorting!`
        });
      }
    } else {
      // Continue with next pair in this pass
      setGameState({
        ...gameState,
        currentArray: newArray,
        score: newScore,
        currentPairIndices: [nextLeft, nextRight],
        feedback: newFeedback
      });
    }
  };

  // Check if bubble sort is being performed correctly
  // In bubble sort, after k passes, the k largest elements should be in their final positions
  const checkBubbleSortProgress = (currentArr, passesCompleted) => {
    const sortedArr = [...gameState.sortedArray]; // The fully sorted reference array
    
    // For each completed pass, check if the largest element is in the right place
    for (let i = 0; i < passesCompleted; i++) {
      const currentPosition = currentArr.length - 1 - i;
      
      // The element at this position in the current array should match 
      // the element at the same position in the fully sorted array
      if (currentArr[currentPosition] !== sortedArr[currentPosition]) {
        return false;
      }
    }
    
    return true;
  };

  // Render the UI
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-xl font-medium flex items-center">
          <FaGamepad className="mr-2 text-blue-600" /> Bubble Sort Challenge
        </h3>
        
        <p className="mt-2">
          Test your understanding of Bubble Sort with this interactive challenge! 
          Decide whether each pair of elements should be swapped to sort the array.
        </p>
        
        {/* Game container */}
        <div className="mt-4 p-4 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg border border-blue-200 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-4">
              <div className="bg-white px-3 py-2 rounded-lg shadow-sm border border-blue-200">
                <div className="flex items-center">
                  <FaTrophy className="text-yellow-500 mr-2" />
                  <span className="font-bold">Score: {gameState.score}</span>
                </div>
              </div>
              <div className="bg-white px-3 py-2 rounded-lg shadow-sm border border-blue-200">
                <div className="flex items-center">
                  <span className="font-bold">Level: {gameState.level}</span>
                </div>
              </div>
              <div className="bg-white px-3 py-2 rounded-lg shadow-sm border border-blue-200">
                <div className="flex items-center">
                  <span className="font-bold">Pass: {gameState.currentPass + 1}</span>
                </div>
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
                <strong>Hint:</strong> In Bubble Sort, you should swap two adjacent elements if the left element is greater than the right element (for ascending order). After each pass, the largest unsorted element will be in its final position.
              </p>
            </div>
          )}
          
          <div className="text-center mb-6 bg-white p-3 rounded-lg shadow-sm border border-blue-200">
            <h4 className="font-bold text-blue-800">
              {gameState.level === 1 ? "Level 1: Sort the array using Bubble Sort" : 
               gameState.level === 2 ? "Level 2: Sort the array using Bubble Sort" :
               "Level 3: Sort the array using Bubble Sort"}
            </h4>
            <p className="text-sm text-gray-600">
              Pass {gameState.currentPass + 1}: Decide whether to swap pairs of adjacent elements
            </p>
          </div>

          {/* Main game area */}
          <div className="flex flex-col mb-6">
            {/* Array visualization */}
            <div className="w-full mb-6">
              <h5 className="font-medium text-center mb-2">Current Array</h5>
              <div className="flex justify-center flex-wrap gap-3 p-4 bg-white rounded-lg shadow-inner border-2 border-dashed border-blue-300 min-h-[80px]">
                {gameState.currentArray.map((value, index) => {
                  // Check if this element is fixed (sorted in previous passes)
                  const isFixed = index >= gameState.currentArray.length - gameState.currentPass;
                  // Check if this element is currently being compared
                  const isCurrentlyCompared = gameState.currentPairIndices.includes(index);
                  
                  return (
                    <div 
                      key={index}
                      className={`px-4 py-3 ${
                        isFixed ? 'bg-gradient-to-br from-green-500 to-green-600' : 
                        isCurrentlyCompared ? 'bg-gradient-to-br from-yellow-500 to-yellow-600 ring-2 ring-yellow-300' : 
                        'bg-gradient-to-br from-blue-500 to-blue-600'
                      } text-white font-bold rounded-lg shadow-md`}
                    >
                      {value}
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Current comparison and swap decision */}
            <div className="bg-white p-4 rounded-lg border border-blue-200 mb-6">
              <h5 className="font-medium text-center mb-3">Current Comparison</h5>
              
              <div className="flex justify-center items-center gap-6 mb-4">
                <div className="text-center">
                  <div className="px-5 py-4 bg-yellow-500 text-white font-bold rounded-lg shadow-md text-xl">
                    {gameState.currentArray[gameState.currentPairIndices[0]]}
                  </div>
                  <p className="mt-1 text-sm font-medium">Left</p>
                </div>
                
                <div className="text-2xl font-bold">vs</div>
                
                <div className="text-center">
                  <div className="px-5 py-4 bg-yellow-500 text-white font-bold rounded-lg shadow-md text-xl">
                    {gameState.currentArray[gameState.currentPairIndices[1]]}
                  </div>
                  <p className="mt-1 text-sm font-medium">Right</p>
                </div>
              </div>
              
              <p className="text-center mb-3 font-medium">Should these elements be swapped?</p>
              
              <div className="flex justify-center gap-4">
                <button
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-md"
                  onClick={() => handleSwapDecision(true)}
                >
                  <div className="flex items-center">
                    <FaExchangeAlt className="mr-2" /> Yes, Swap
                  </div>
                </button>
                
                <button
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-md"
                  onClick={() => handleSwapDecision(false)}
                >
                  <div className="flex items-center">
                    <FaTimes className="mr-2" /> No, Keep
                  </div>
                </button>
              </div>
            </div>
            
            {/* Explanation area */}
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <h5 className="font-medium text-center mb-2 text-blue-800">How Bubble Sort Works</h5>
              <p className="text-sm text-center">
                For each pass, compare adjacent pairs from left to right.
                If the left element is greater than the right element, swap them.
                After each pass, the largest unsorted element "bubbles" to its correct position.
              </p>
              <p className="text-sm text-center mt-2 font-medium text-blue-700">
                In bubble sort, after each pass, the largest element will be placed at the end of the array.
              </p>
            </div>
          </div>
          
          {/* Feedback and controls */}
          <div className="w-full flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
            <div className={`p-3 rounded-lg border flex-grow text-center shadow-sm ${
              gameState.feedback.includes("Correct") || gameState.feedback.includes("completed") ? 
              'bg-green-100 border-green-300 text-green-800' : 
              gameState.feedback.includes("Incorrect") || gameState.feedback.includes("isn't being sorted correctly") ? 
              'bg-red-100 border-red-300 text-red-800' : 
              'bg-white border-blue-200 text-blue-800'
            }`}>
              <p className="font-medium">{gameState.feedback}</p>
            </div>
            
            <button 
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md shadow transition flex items-center"
              onClick={() => initializeGame(1)} // Changed from gameState.level to 1
            >
              <FaRedo className="mr-1" /> Reset Game
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
                <p className="mb-4">You've mastered the Bubble Sort algorithm!</p>
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

export default BubbleSortChallenge;
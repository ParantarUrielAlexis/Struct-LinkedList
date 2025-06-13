import React, { useState, useEffect } from "react";

const Slide7 = () => {
  // Difficulty level configurations
  const difficultyLevels = [
    { 
      name: "Beginner",
      arraySize: 6,
      range: [1, 9]  // Random numbers between 1-9
    },
    { 
      name: "Intermediate",
      arraySize: 7,
      range: [1, 15] // Random numbers between 1-15
    },
    { 
      name: "Advanced",
      arraySize: 8,
      range: [1, 30] // Random numbers between 1-30
    }
  ];
  
  // Game state
  const [currentLevel, setCurrentLevel] = useState(0); // Starting with beginner level
  const [initialArray, setInitialArray] = useState([]);
  const [array, setArray] = useState([]);
  const [step, setStep] = useState(0);
  const [message, setMessage] = useState("Select the first element to begin sorting");
  const [userInput, setUserInput] = useState(null);
  const [isWaiting, setIsWaiting] = useState(false);
  const [score, setScore] = useState(100);
  const [gameComplete, setGameComplete] = useState(false);
  const [sortingSteps, setSortingSteps] = useState([]);
  const [showingFinalState, setShowingFinalState] = useState(false);
  // Add this state for the celebration popup
  const [showCelebration, setShowCelebration] = useState(false);
  const [showNextLevelPopup, setShowNextLevelPopup] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  
  // Generate a random array with no duplicates
  const generateRandomArray = (size, range) => {
    // If range is too small for the size, adjust it
    if (range[1] - range[0] + 1 < size) {
      range[1] = range[0] + size * 2; // Ensure enough numbers to pick from
    }
    
    const availableNumbers = [];
    for (let i = range[0]; i <= range[1]; i++) {
      availableNumbers.push(i);
    }
    
    // Shuffle and take the first 'size' elements
    const shuffled = [...availableNumbers].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, size);
  };

  // Generate sorting steps for the given array
  const generateSortingSteps = (arr) => {
    const steps = [];
    const tempArray = [...arr];
    
    // First element is considered sorted
    steps.push({
      prompt: `First, we consider the first element (${tempArray[0]}) to be already sorted. Which element should we select next?`,
      correctAnswer: 1,
      explanation: `In insertion sort, we start with the second element (${tempArray[1]}) and compare it with the sorted portion.`
    });
    
    // Generate insertion sort steps
    for (let i = 1; i < tempArray.length; i++) {
      const currentElement = tempArray[i];
      
      // Add selection step (except for the first element which is added above)
      if (i > 1) {
        steps.push({
          prompt: `Which element should we select next?`,
          correctAnswer: i,
          explanation: `We select the next unsorted element (${currentElement}).`
        });
      }
      
      // Find insertion point
      let j = i - 1;
      const tempValue = tempArray[i];
      while (j >= 0 && tempArray[j] > tempValue) {
        tempArray[j + 1] = tempArray[j];
        j--;
      }
      
      // Only add insertion step if element actually moves
      const insertPosition = j + 1;
      tempArray[insertPosition] = tempValue;
      
      steps.push({
        prompt: `Where should we insert the element ${currentElement} in the sorted portion?`,
        correctAnswer: insertPosition,
        explanation: insertPosition === i 
          ? `Since ${currentElement} is already in the correct position, we keep it there.`
          : `We insert ${currentElement} at position ${insertPosition + 1} in the array.`,
        resultingArray: [...tempArray]
      });
    }
    
    return steps;
  };

  // Initialize or change level
  useEffect(() => {
    // Generate random array for current level
    const levelConfig = difficultyLevels[currentLevel];
    const newArray = generateRandomArray(
      levelConfig.arraySize,
      levelConfig.range
    );
    
    setInitialArray([...newArray]);
    setArray([...newArray]);
    
    // Generate sorting steps for the selected array
    const steps = generateSortingSteps(newArray);
    setSortingSteps(steps);
    
    setStep(0);
    setScore(100);
    setGameComplete(false);
    setShowingFinalState(false);
    setMessage(`Let's sort this ${newArray.length}-element array using insertion sort. Select the first element to begin.`);
  }, [currentLevel]);

  // Get the current step information
  const getCurrentStep = () => sortingSteps[step] || {};
  
  // Update the array based on step
  useEffect(() => {
    if (sortingSteps.length === 0) return;
    
    // Don't update array for insertion steps (odd steps)
    // Only update when advancing to a new selection step (even steps)
    if (step % 2 === 0) {
      // Find the most recent step with a resulting array
      let latestStepWithArray = -1;
      for (let i = step - 1; i >= 0; i--) {
        if (sortingSteps[i].resultingArray) {
          latestStepWithArray = i;
          break;
        }
      }
      
      if (latestStepWithArray >= 0) {
        setArray([...sortingSteps[latestStepWithArray].resultingArray]);
      } else {
        setArray([...initialArray]);
      }
    }
  }, [step, sortingSteps, initialArray]);

  // Calculate progress percentage
  const getProgressPercentage = () => {
    // If game is complete, return 100%
    if (gameComplete) return 100;
    // Otherwise calculate normally but max at 100%
    return Math.min(100, Math.round((step / sortingSteps.length) * 100));
  };

  // Handle the user's answer
  const handleAnswer = (selectedIndex) => {
    if (isWaiting || gameComplete) return;
    
    const currentStep = getCurrentStep();
    
    // For odd steps (insertion steps)
    if (step % 2 === 1) {
      setIsWaiting(true);
      
      if (selectedIndex === currentStep.correctAnswer) {
        // Explicitly handle insertion
        if (currentStep.resultingArray) {
          setArray([...currentStep.resultingArray]);
        }
        
        setMessage(`Correct! ${currentStep.explanation}`);
        
        setTimeout(() => {
          const nextStep = step + 1;
          if (nextStep >= sortingSteps.length) {
            // Game complete - auto advance to next level after delay
            setShowingFinalState(true);
            setGameComplete(true);
            setMessage("🎉 Congratulations! You've completed this level!");
            
            // Check if this is the final level
            if (currentLevel === difficultyLevels.length - 1) {
              // Final level completion
              setGameFinished(true);
              setShowCelebration(true);
            } else {
              // Not final level - show next level popup
              setShowNextLevelPopup(true);
            }
          } else {
            setStep(nextStep);
            setUserInput(null);
            setMessage(sortingSteps[nextStep].prompt);
          }
          setIsWaiting(false);
        }, 0);
      } else {
        setMessage(`Incorrect. Try again.`);
        setScore(Math.max(0, score - 10));
        
        setTimeout(() => {
          setUserInput(null);
          setIsWaiting(false);
          setMessage(currentStep.prompt);
        }, 1500);
      }
      return;
    }
    
    // For even steps (selection steps)
    setUserInput(selectedIndex);
    
    if (selectedIndex === currentStep.correctAnswer) {
      setMessage(`Good! Now select where to insert ${array[selectedIndex]}.`);
      setStep(step + 1);
    } else {
      setIsWaiting(true);
      setMessage(`Incorrect. Try again.`);
      setScore(Math.max(0, score - 10));
      
      setTimeout(() => {
        setUserInput(null);
        setIsWaiting(false);
        setMessage(currentStep.prompt);
      }, 1500);
    }
  };

  // Reset the current level
  const resetChallenge = () => {
    // Always go back to beginner level
    setCurrentLevel(0);
    
    // Generate a new random array for beginner level
    const levelConfig = difficultyLevels[0];
    const newArray = generateRandomArray(
      levelConfig.arraySize,
      levelConfig.range
    );
    
    setInitialArray([...newArray]);
    setArray([...newArray]);
    
    // Generate sorting steps for the new array
    const steps = generateSortingSteps(newArray);
    setSortingSteps(steps);
    
    // Reset all game state
    setStep(0);
    setUserInput(null);
    setIsWaiting(false);
    setScore(100);
    setGameComplete(false);
    setShowingFinalState(false);
    setMessage(`Let's sort this ${newArray.length}-element array using insertion sort. Select the first element to begin.`);
  };

  // Add a function to advance to next level
  const advanceToNextLevel = () => {
    setShowNextLevelPopup(false);
    
    // Small delay before starting next level
    setTimeout(() => {
      setCurrentLevel(currentLevel + 1);
    }, 300);
  };

  // Add a function to restart the game
  const playAgain = () => {
    setShowCelebration(false);
    setGameFinished(false);
    
    // Small delay before reset
    setTimeout(() => {
      // Reset to beginner level with new random array
      setCurrentLevel(0);
      // Game will auto-initialize via useEffect
    }, 300);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-2">Insertion Sort Challenge</h2>
      <p>
        Test your understanding of the insertion sort algorithm by correctly identifying the next step at each stage of the sorting process.
      </p>
      
      {/* Card sorting area */}
      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <div className="mb-2 flex justify-between items-center">
          <div className="text-sm font-medium">
            Level: {difficultyLevels[currentLevel].name}
          </div>
          <div className="text-sm font-medium">
            Progress: {getProgressPercentage()}%
          </div>
          <div className="text-sm font-medium">
            Score: {score}/100
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
        
        {/* Cards display */}
        <div className="min-h-[160px] w-full bg-white p-4 rounded-lg shadow-inner relative">
          <div className="flex justify-center gap-4">
            {array.map((value, index) => {
              // Determine card styling based on state
              const isSelected = userInput === index;
              const isInSortedPortion = showingFinalState || (step % 2 === 0 ? Math.floor(step/2) >= index : Math.ceil(step/2) > index);
              
              return (
                <div
                  key={`${index}-${value}`}
                  className={`
                    relative w-16 h-24 rounded transition-all duration-300
                    ${isSelected ? 'ring-2 ring-blue-500 scale-110' : ''}
                    ${isInSortedPortion ? 'bg-yellow-100 border-2 border-yellow-400' : 'bg-white border border-gray-300'}
                    flex flex-col items-center justify-center shadow-md
                    ${!isWaiting && !gameComplete ? 'cursor-pointer hover:bg-blue-50' : ''}
                  `}
                  onClick={() => !isWaiting && !gameComplete && handleAnswer(index)}
                >
                  <div className="absolute top-1 left-2 text-lg font-bold">
                    {value}
                  </div>
                  <div className="absolute bottom-1 right-2 text-lg font-bold rotate-180">
                    {value}
                  </div>
                  <div className={`text-3xl font-bold ${isInSortedPortion ? 'text-yellow-600' : 'text-gray-800'}`}>
                    {value}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Challenge instruction */}
        <div className={`mt-4 p-3 rounded-lg text-center transition-colors ${
          message.includes("Incorrect") ? 'bg-red-100 text-red-700' : 
          message.includes("Correct") || message.includes("Congratulations") ? 'bg-green-100 text-green-700' : 
          'bg-white text-gray-700 border border-gray-200'
        }`}>
          {message}
        </div>
        
        {/* Control buttons */}
        <div className="flex justify-center space-x-3 mt-4">
          <button 
            className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 transition text-sm"
            onClick={resetChallenge}
          >
            Reset Challenge
          </button>
        </div>
      </div>
      
      {/* Additional explanation */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="font-medium">Challenge Tips:</h4>
        <ul className="list-disc list-inside pl-4 mt-2 space-y-1 text-sm">
          <li>At each step, focus on one unsorted element at a time</li>
          <li>When selecting a position, think about where the element belongs in the sorted portion</li>
          <li>Elements in the sorted portion are always kept in order</li>
          {currentLevel === 2 && (
            <li>Remember insertion sort can handle multiple values while maintaining their relative order</li>
          )}
        </ul>
      </div>
      
      {/* Celebration Popup */}
      {showCelebration && gameFinished && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black bg-opacity-60 animate-fade-in"></div>
          <div className="bg-white rounded-lg p-8 mx-4 max-w-sm md:max-w-md relative z-10 animate-scale-in shadow-2xl border-4 border-yellow-400">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <span className="text-6xl">🎉</span>
                <span className="text-6xl ml-3">🏆</span>
                <span className="text-6xl ml-3">🎊</span>
              </div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">Amazing Job!</h3>
              <p className="text-gray-700 mb-6">
                You've mastered all levels of the Insertion Sort Challenge with a final score of {score}/100!
              </p>
              
              {/* Play Again button - highlighted and prominent */}
              <button 
                onClick={playAgain}
                className="bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition font-bold text-lg shadow-lg flex items-center justify-center mx-auto"
              >
                <span className="mr-2">🔄</span> Play Again
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Next Level Popup */}
      {showNextLevelPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black bg-opacity-50 animate-fade-in"></div>
          <div className="bg-white rounded-lg p-8 mx-4 max-w-sm md:max-w-md relative z-10 animate-scale-in shadow-2xl border-4 border-blue-400">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-blue-600 mb-2">Nice Job!</h3>
              <p className="text-gray-700 mb-4">
                You've completed the {difficultyLevels[currentLevel].name} level.
              </p>
              <p className="text-gray-600 text-sm mb-4">
                Get ready for the next level of challenges!
              </p>
              
              <button 
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all duration-300 text-sm font-medium"
                onClick={advanceToNextLevel}
              >
                Continue to Next Level
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Slide7;
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaGamepad, FaTrophy, FaSort, FaPlay, FaChevronRight, FaLightbulb, FaArrowRight } from "react-icons/fa";

const Slide7 = () => {
  const [showCover, setShowCover] = useState(true);
  
  // Difficulty level configurations - expanded to 5 levels
  const difficultyLevels = [
    { 
      name: "Beginner",
      arraySize: 5,
      range: [1, 9]  // Random numbers between 1-9
    },
    { 
      name: "Easy",
      arraySize: 6,
      range: [1, 12] // Random numbers between 1-12
    },
    { 
      name: "Intermediate",
      arraySize: 7,
      range: [1, 20] // Random numbers between 1-20
    },
    { 
      name: "Advanced",
      arraySize: 8,
      range: [1, 30] // Random numbers between 1-30
    },
    { 
      name: "Expert",
      arraySize: 9,
      range: [1, 40] // Random numbers between 1-40
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
  const [score, setScore] = useState(500); // Starting score of 500
  const [gameComplete, setGameComplete] = useState(false);
  const [sortingSteps, setSortingSteps] = useState([]);
  const [showingFinalState, setShowingFinalState] = useState(false);
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
    // Do NOT reset the score when changing levels - only initialize it at first load
    if (currentLevel === 0 && score === 500) {
      // This means we're starting the game for the first time
      setScore(500);
    }
    
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
        setMessage(`Incorrect. Try again. -20 points`);
        setScore(Math.max(0, score - 20)); // Deduct 20 points for wrong answers
        
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
      setMessage(`Incorrect. Try again. -20 points`);
      setScore(Math.max(0, score - 20)); // Deduct 20 points for wrong answers
      
      setTimeout(() => {
        setUserInput(null);
        setIsWaiting(false);
        setMessage(currentStep.prompt);
      }, 1500);
    }
  };

  // Reset the challenge completely
  const resetChallenge = () => {
    // Reset to beginner level
    setCurrentLevel(0);
    
    // Reset score to initial value
    setScore(500);
    
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
      // Reset to beginner level with new random array and reset score
      resetChallenge();
    }, 300);
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
        <div className="absolute inset-0 opacity-20">
          <div className="w-20 h-20 rounded-full bg-white absolute top-10 left-10 opacity-20"></div>
          <div className="w-16 h-16 rounded-full bg-white absolute bottom-10 right-10 opacity-10"></div>
          <div className="w-24 h-24 rounded-full bg-white absolute top-20 right-20 opacity-10"></div>
        </div>
        <div className="h-full flex items-center justify-center p-6">
          <div className="text-center">
            <h2 className="text-white text-3xl md:text-4xl font-bold flex items-center justify-center drop-shadow-lg">
              <FaSort className="mr-4" />
              Insertion Sort Challenge
            </h2>
            <p className="text-blue-100 mt-2">
              Master the insertion sort algorithm through hands-on practice
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
            <FaTrophy className="mr-1" /> 5 Levels
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-blue-50 p-5 rounded-lg">
            <h3 className="font-bold text-blue-800 mb-3">How Insertion Sort Works</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <FaChevronRight className="mt-1 mr-2 text-blue-500 flex-shrink-0" />
                <span>Start with the first element as "sorted"</span>
              </li>
              <li className="flex items-start">
                <FaChevronRight className="mt-1 mr-2 text-blue-500 flex-shrink-0" />
                <span>Take the next element and insert it in the correct position in the sorted array</span>
              </li>
              <li className="flex items-start">
                <FaChevronRight className="mt-1 mr-2 text-blue-500 flex-shrink-0" />
                <span>Shift elements as needed to make space</span>
              </li>
              <li className="flex items-start">
                <FaChevronRight className="mt-1 mr-2 text-blue-500 flex-shrink-0" />
                <span>Repeat until all elements are sorted</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-indigo-50 p-5 rounded-lg">
            <h3 className="font-bold text-indigo-800 mb-3">How to Play</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <FaChevronRight className="mt-1 mr-2 text-indigo-500 flex-shrink-0" />
                <span>Select the next element to be inserted</span>
              </li>
              <li className="flex items-start">
                <FaChevronRight className="mt-1 mr-2 text-indigo-500 flex-shrink-0" />
                <span>Choose the correct position to insert it within the sorted portion</span>
              </li>
              <li className="flex items-start">
                <FaChevronRight className="mt-1 mr-2 text-indigo-500 flex-shrink-0" />
                <span>Progress through all 5 difficulty levels</span>
              </li>
              <li className="flex items-start">
                <FaChevronRight className="mt-1 mr-2 text-indigo-500 flex-shrink-0" />
                <span>Watch out: each wrong answer costs 20 points!</span>
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
                By playing this challenge, you'll understand how insertion sort works through hands-on practice,
                reinforcing the algorithm's approach of building a sorted array one element at a time.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-bold text-blue-800 mb-2">Level Progression</h3>
          <div className="grid grid-cols-5 gap-2">
            {difficultyLevels.map((level, index) => (
              <div key={index} className="bg-white p-2 rounded border border-blue-200 text-center">
                <div className="text-xs font-medium text-blue-800">{level.name}</div>
                <div className="text-xs text-gray-500">{level.arraySize} elements</div>
              </div>
            ))}
            <div className="col-span-5 mt-1">
              <div className="w-full bg-blue-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full w-[20%]"></div>
              </div>
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

  return (
    <div className="space-y-4">
      {showCover ? (
        <CoverPage />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Insertion Sort Challenge</h2>
            <button
              onClick={() => setShowCover(true)}
              className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition flex items-center"
            >
              <FaGamepad className="mr-1" /> Instructions
            </button>
          </div>
          
          <p>
            Test your understanding of the insertion sort algorithm by correctly identifying the next step at each stage of the sorting process.
          </p>
          
          {/* Card sorting area */}
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="mb-2 flex justify-between items-center">
              <div className="text-sm font-medium bg-white px-3 py-1 rounded-full border border-yellow-200">
                Level: {difficultyLevels[currentLevel].name} ({currentLevel + 1}/5)
              </div>
              <div className="text-sm font-medium bg-white px-3 py-1 rounded-full border border-yellow-200">
                Progress: {getProgressPercentage()}%
              </div>
              <div className="text-sm font-medium bg-white px-3 py-1 rounded-full border border-yellow-200 flex items-center">
                <FaTrophy className="text-yellow-500 mr-1" />
                Score: {score}/500
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
            
           
          </div>
          
          {/* Additional explanation */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-medium">Challenge Tips:</h4>
            <ul className="list-disc list-inside pl-4 mt-2 space-y-1 text-sm">
              <li>At each step, focus on one unsorted element at a time</li>
              <li>When selecting a position, think about where the element belongs in the sorted portion</li>
              <li>Elements in the sorted portion are always kept in order</li>
              <li>Each incorrect answer reduces your score by 20 points</li>
              {currentLevel >= 3 && (
                <li>With larger arrays, carefully track which elements are already sorted</li>
              )}
            </ul>
          </div>
          
          {/* Celebration Popup */}
          {showCelebration && gameFinished && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="absolute inset-0 bg-black bg-opacity-60 animate-fade-in"></div>
              <div className="bg-white rounded-lg p-8 mx-4 max-w-sm md:max-w-md relative z-10 shadow-2xl border-4 border-yellow-400">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <span className="text-6xl">🎉</span>
                    <span className="text-6xl ml-3">🏆</span>
                    <span className="text-6xl ml-3">🎊</span>
                  </div>
                  <h3 className="text-2xl font-bold text-green-600 mb-2">Amazing Job!</h3>
                  <p className="text-gray-700 mb-6">
                    You've mastered all 5 levels of the Insertion Sort Challenge with a final score of {score}/500!
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
              <div className="bg-white rounded-lg p-8 mx-4 max-w-sm md:max-w-md relative z-10 shadow-2xl border-4 border-blue-400">
                <div className="text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <FaTrophy className="text-yellow-500 text-3xl" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-blue-600 mb-2">Level Complete!</h3>
                  <p className="text-gray-700 mb-2">
                    You've completed the {difficultyLevels[currentLevel].name} level with a current score of {score} points.
                  </p>
                  <p className="text-gray-600 text-sm mb-4">
                    Ready for {difficultyLevels[currentLevel + 1].name} level with {difficultyLevels[currentLevel + 1].arraySize} elements?
                  </p>
                  
                  <button 
                    className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-all duration-300 text-sm font-medium shadow-md"
                    onClick={advanceToNextLevel}
                  >
                    <div className="flex items-center justify-center">
                      <FaPlay className="mr-2" /> Continue to Level {currentLevel + 2}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Slide7;
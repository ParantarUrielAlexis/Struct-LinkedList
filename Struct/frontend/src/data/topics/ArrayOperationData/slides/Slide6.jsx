import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaTrophy, FaSearch, FaPlay, FaLightbulb, FaStar, FaCheck, FaTimes, FaArrowRight } from "react-icons/fa";

const Slide6SearchingChallenge = () => {
  const fruits = ["🍎", "🍌", "🍓", "🍊", "🍏", "🍇", "🥝", "🍒", "🍍", "🥭", "🍑", "🍐"];
  const fruitNames = ["Apple", "Banana", "Strawberry", "Orange", "Green Apple", "Grapes", "Kiwi", "Cherry", "Pineapple", "Mango", "Peach", "Pear"];
  
  const allChallenges = [
    {
      id: 1,
      title: "Fruit Finder",
      question: "Which method checks if an array contains a specific fruit?",
      options: ["indexOf()", "includes()", "find()", "some()"],
      correct: 1,
      example: "fruits.includes('strawberry')"
    },
    {
      id: 2,
      title: "Index Explorer",
      question: "Which method returns the position of a banana in the array?",
      options: ["indexOf()", "findIndex()", "position()", "search()"],
      correct: 0,
      example: "fruits.indexOf('banana')"
    },
    {
      id: 3,
      title: "Conditional Seeker",
      question: "Which method finds the first green fruit in the array?",
      options: ["filter()", "some()", "find()", "every()"],
      correct: 2,
      example: "fruits.find(fruit => fruit === 'green_apple' || fruit === 'kiwi')"
    },
    {
      id: 4,
      title: "Multiple Hunter",
      question: "Which method collects all fruits that start with 'p'?",
      options: ["map()", "filter()", "reduce()", "forEach()"],
      correct: 1,
      example: "fruits.filter(fruit => fruit.startsWith('p'))"
    },
    {
      id: 5,
      title: "Tropical Collector",
      question: "Which method returns an array of only tropical fruits?",
      options: ["filter()", "sort()", "slice()", "splice()"],
      correct: 0,
      example: "fruits.filter(fruit => ['pineapple', 'mango'].includes(fruit))"
    },
    {
      id: 6,
      title: "Existence Checker",
      question: "Which method returns a boolean indicating whether at least one fruit passes a test?",
      options: ["every()", "some()", "includes()", "has()"],
      correct: 1,
      example: "fruits.some(fruit => fruit === 'apple')"
    },
    {
      id: 7,
      title: "Last Occurrence Finder",
      question: "Which method finds the last position of a repeated fruit in an array?",
      options: ["indexAt()", "lastIndexOf()", "findLastIndex()", "search()"],
      correct: 1,
      example: "fruits.lastIndexOf('apple')"
    },
    {
      id: 8,
      title: "Universal Tester",
      question: "Which method checks if ALL fruits in the array pass a condition?",
      options: ["every()", "all()", "filter()", "map()"],
      correct: 0,
      example: "fruits.every(fruit => fruit.length > 2)"
    },
    {
      id: 9,
      title: "Index Finder",
      question: "Which method returns the index of the first element that passes a test?",
      options: ["find()", "findIndex()", "indexOf()", "search()"],
      correct: 1,
      example: "fruits.findIndex(fruit => fruit === 'banana')"
    },
    {
      id: 10,
      title: "Array Checker",
      question: "Which method is best for checking if a specific value exists in an array?",
      options: ["contains()", "has()", "includes()", "exists()"],
      correct: 2,
      example: "fruits.includes('apple')"
    },
    {
      id: 11,
      title: "Value Extractor",
      question: "Which method transforms each element in an array to create a new array?",
      options: ["forEach()", "map()", "reduce()", "filter()"],
      correct: 1,
      example: "fruits.map(fruit => fruit.toUpperCase())"
    },
    {
      id: 12,
      title: "Condition Matcher",
      question: "Which method is used to find the first element that matches a condition?",
      options: ["filter()", "find()", "search()", "match()"],
      correct: 1,
      example: "fruits.find(fruit => fruit.startsWith('a'))"
    },
    {
      id: 13,
      title: "Presence Detector",
      question: "Which method would you use to check if an array has a fruit at a specific index?",
      options: ["at()", "hasIndex()", "includes()", "contains()"],
      correct: 0,
      example: "fruits.at(2) !== undefined"
    },
    {
      id: 14,
      title: "Element Counter",
      question: "Which array method would help count how many fruits start with the letter 'p'?",
      options: ["count()", "filter()", "reduce()", "sum()"],
      correct: 1,
      example: "fruits.filter(fruit => fruit.startsWith('p')).length"
    },
    {
      id: 15,
      title: "Data Reduction",
      question: "Which method is used to reduce an array to a single value (like counting total fruits)?",
      options: ["collapse()", "flatten()", "reduce()", "sum()"],
      correct: 2,
      example: "fruits.reduce((count, _) => count + 1, 0)"
    }
  ];
  
  const [gameStarted, setGameStarted] = useState(false);
  const [challenges, setChallenges] = useState([]);
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [succeeded, setSucceeded] = useState([]);
  const [score, setScore] = useState(0);
  const [showExample, setShowExample] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [autoAdvanceTimer, setAutoAdvanceTimer] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(10);
  const [timerActive, setTimerActive] = useState(false);
  const [timerInterval, setTimerInterval] = useState(null);

  // Function to shuffle array using Fisher-Yates algorithm
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Initialize game with shuffled challenges
  const startGame = () => {
    const shuffledChallenges = shuffleArray([...allChallenges]);
    // Take only 10 questions
    const selectedChallenges = shuffledChallenges.slice(0, 10);
    setChallenges(selectedChallenges);
    setSucceeded(new Array(selectedChallenges.length).fill(false));
    setGameStarted(true);
    setCurrentChallenge(0);
    setSelectedOption(null);
    setShowResult(false);
    setScore(0);
    setIsCompleted(false);
    setTimeRemaining(10);
    setTimerActive(true);
  };
  
  const checkAnswer = (optionIndex) => {
    // Stop the timer
    setTimerActive(false);
    if (timerInterval) clearInterval(timerInterval);
    
    setSelectedOption(optionIndex);
    setShowResult(true);
    
    const isCorrect = optionIndex === challenges[currentChallenge].correct;
    
    if (isCorrect && !succeeded[currentChallenge]) {
      setScore(score => score + 10);
      setSucceeded(prev => {
        const newSucceeded = [...prev];
        newSucceeded[currentChallenge] = true;
        return newSucceeded;
      });
    }
    
    // Auto-advance after 3 seconds
    const timer = setTimeout(() => {
      if (currentChallenge < challenges.length - 1) {
        setCurrentChallenge(currentChallenge + 1);
        setSelectedOption(null);
        setShowResult(false);
        setTimeRemaining(10);
        setTimerActive(true);
      } else {
        setIsCompleted(true);
      }
    }, 3000);
    
    setAutoAdvanceTimer(timer);
  };
  
  // Clear timer when unmounting or moving to next question manually
  useEffect(() => {
    return () => {
      if (autoAdvanceTimer) clearTimeout(autoAdvanceTimer);
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [autoAdvanceTimer, timerInterval]);
  
  // Fixed timer useEffect
  useEffect(() => {
    let interval = null;
    
    if (timerActive && timeRemaining > 0) {
      // Create new interval that runs every 1000ms (1 second)
      interval = setInterval(() => {
        setTimeRemaining(prevTime => {
          console.log("Timer tick:", prevTime - 1); // Debug log
          return prevTime - 1;
        });
      }, 1000);
    } 
    else if (timeRemaining <= 0 && timerActive) {
      // Time's up - handle unanswered question
      setTimerActive(false);
      setShowResult(true);
      
      // If they didn't select an option, it counts as incorrect
      if (selectedOption === null) {
        setSelectedOption(-1); // -1 represents no selection
      }
      
      // Auto-advance after showing the result for 3 seconds
      const advanceTimer = setTimeout(() => {
        if (currentChallenge < challenges.length - 1) {
          setCurrentChallenge(currentChallenge + 1);
          setSelectedOption(null);
          setShowResult(false);
          setTimeRemaining(10);
          setTimerActive(true);
        } else {
          setIsCompleted(true);
        }
      }, 3000);
      
      setAutoAdvanceTimer(advanceTimer);
    }
    
    // Clean up interval on component unmount or when dependencies change
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timerActive, timeRemaining, currentChallenge, challenges.length, selectedOption]);
  
  const goToNextChallenge = () => {
    // Clear any existing timers
    if (autoAdvanceTimer) {
      clearTimeout(autoAdvanceTimer);
      setAutoAdvanceTimer(null);
    }
    
    if (currentChallenge < challenges.length - 1) {
      setCurrentChallenge(currentChallenge + 1);
      setSelectedOption(null);
      setShowResult(false);
      
      // Reset and restart timer
      setTimeRemaining(10);
      
      // Important: Add a small delay before starting the timer again
      // This helps ensure state updates have completed
      setTimeout(() => {
        setTimerActive(true);
      }, 50);
    } else {
      setIsCompleted(true);
    }
  };

  const resetGame = () => {
    if (autoAdvanceTimer) {
      clearTimeout(autoAdvanceTimer);
      setAutoAdvanceTimer(null);
    }
    
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    
    setGameStarted(false);
    setCurrentChallenge(0);
    setSelectedOption(null);
    setShowResult(false);
    setScore(0);
    setSucceeded([]);
    setIsCompleted(false);
    setShowExample(false);
    setTimerActive(false);
    setTimeRemaining(10);
  };

  // Add this useEffect to ensure clean state on initial mount
  useEffect(() => {
    // Reset timer state when the component mounts
    setTimerActive(false);
    setTimeRemaining(10);
    
    return () => {
      // Clean up any running timers when component unmounts
      if (autoAdvanceTimer) {
        clearTimeout(autoAdvanceTimer);
      }
    };
  }, []);

  // Cover page
  if (!gameStarted) {
    return (
      <motion.div 
        className="p-6 space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
            <div className="absolute inset-0 opacity-20">
              <div className="w-20 h-20 rounded-full bg-white absolute top-5 left-5 opacity-20"></div>
              <div className="w-16 h-16 rounded-full bg-white absolute bottom-10 right-10 opacity-10"></div>
              <div className="w-24 h-24 rounded-full bg-white absolute top-20 right-20 opacity-10"></div>
            </div>
            <div className="h-full flex items-center justify-center p-6">
              <div className="relative">
                <div className="text-white text-4xl font-bold flex items-center drop-shadow-lg text-center">
                  <FaSearch className="mr-4" />
                  Array Search Methods Quiz
                </div>
                <div className="text-indigo-100 mt-2 text-center">
                  Test your knowledge of JavaScript array methods!
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <FaStar className="mr-2 text-indigo-500" /> 10 Random Questions
              </h2>
              <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-1 rounded flex items-center">
                <FaStar className="mr-1" /> 10 points per correct answer
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div className="bg-indigo-50 p-5 rounded-lg">
                <h3 className="font-bold text-indigo-800 mb-3">What You'll Learn</h3>
                <ul className="text-sm space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <FaArrowRight className="mt-0.5 mr-2 text-indigo-500 flex-shrink-0" />
                    <span>indexOf() - Find position of an element</span>
                  </li>
                  <li className="flex items-start">
                    <FaArrowRight className="mt-0.5 mr-2 text-indigo-500 flex-shrink-0" />
                    <span>includes() - Check if element exists</span>
                  </li>
                  <li className="flex items-start">
                    <FaArrowRight className="mt-0.5 mr-2 text-indigo-500 flex-shrink-0" />
                    <span>find() - Get first element matching condition</span>
                  </li>
                  <li className="flex items-start">
                    <FaArrowRight className="mt-0.5 mr-2 text-indigo-500 flex-shrink-0" />
                    <span>filter() - Get all elements matching condition</span>
                  </li>
                  <li className="flex items-start">
                    <FaArrowRight className="mt-0.5 mr-2 text-indigo-500 flex-shrink-0" />
                    <span>...and other essential array methods</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-purple-50 p-5 rounded-lg">
                <h3 className="font-bold text-purple-800 mb-3">How To Play</h3>
                <ul className="text-sm space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <FaArrowRight className="mt-0.5 mr-2 text-purple-500 flex-shrink-0" />
                    <span>Answer 10 random questions from our pool of 15</span>
                  </li>
                  <li className="flex items-start">
                    <FaArrowRight className="mt-0.5 mr-2 text-purple-500 flex-shrink-0" />
                    <span>Each correct answer earns you 10 points</span>
                  </li>
                  <li className="flex items-start">
                    <FaArrowRight className="mt-0.5 mr-2 text-purple-500 flex-shrink-0" />
                    <span>After answering, you'll see the correct answer</span>
                  </li>
                  <li className="flex items-start">
                    <FaArrowRight className="mt-0.5 mr-2 text-purple-500 flex-shrink-0" />
                    <span>The quiz automatically advances after 3 seconds</span>
                  </li>
                  <li className="flex items-start">
                    <FaArrowRight className="mt-0.5 mr-2 text-purple-500 flex-shrink-0" />
                    <span>You have 10 seconds to answer each question</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-amber-50 p-4 rounded-md border border-amber-200 mb-6">
              <div className="flex items-center">
                <FaLightbulb className="text-amber-500 mr-3 flex-shrink-0" />
                <div>
                  <p className="font-medium text-amber-800">Tip for Success</p>
                  <p className="text-sm mt-1">Pay attention to the fruit array examples! 
                  Understanding which method to use for different search operations is key to 
                  becoming proficient with JavaScript arrays.</p>
                </div>
              </div>
            </div>
            
            <motion.button
              onClick={startGame}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-md flex items-center justify-center shadow-md"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <FaPlay className="mr-2" /> Start Quiz
            </motion.button>
            
            <p className="mt-4 text-center text-xs text-gray-500">
              Test your knowledge of JavaScript array search methods!
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Game completion screen
  if (isCompleted) {
    // Calculate percentage score
    const percentage = Math.round((score / (challenges.length * 10)) * 100);
    
    return (
      <motion.div 
        className="p-6 space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <FaTrophy className="text-yellow-500 text-6xl mx-auto mb-4" />
          </motion.div>
          
          <h2 className="text-2xl font-bold mb-3">Quiz Complete!</h2>
          
          <div className="mb-6">
            <p className="text-lg">
              Final Score: <span className="font-bold text-indigo-600">{score}</span> points
            </p>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className={`h-4 rounded-full ${
                    percentage >= 80 ? 'bg-green-500' : 
                    percentage >= 60 ? 'bg-yellow-500' : 
                    'bg-red-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <p className="text-sm mt-1 text-gray-600">{percentage}% Correct</p>
            </div>
            <p className="text-md mt-3">
              Correct Answers: <span className="font-bold text-green-600">{succeeded.filter(Boolean).length}</span> out of {challenges.length}
            </p>
          </div>
          
          <div className={`p-4 rounded-lg mb-6 ${
            percentage >= 80 ? 'bg-green-50 border border-green-200' :
            percentage >= 60 ? 'bg-yellow-50 border border-yellow-200' :
            'bg-amber-50 border border-amber-200'
          }`}>
            <h4 className={`font-bold mb-2 ${
              percentage >= 80 ? 'text-green-800' :
              percentage >= 60 ? 'text-yellow-800' :
              'text-amber-800'
            }`}>
              {percentage >= 80 ? 'Congratulations! 🎉' :
               percentage >= 60 ? 'Good job! 👍' :
               'Keep practicing! 💪'}
            </h4>
            <p className={
              percentage >= 80 ? 'text-green-700' :
              percentage >= 60 ? 'text-yellow-700' :
              'text-amber-700'
            }>
              {percentage >= 80 ? "You've mastered JavaScript array search methods!" :
               percentage >= 60 ? "You have a good understanding of array methods, but there's still room to improve." :
               "Don't worry! Array methods take practice. Try again to improve your score."}
            </p>
          </div>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={resetGame}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md"
            >
              Play Again
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Check if challenges are loaded
  if (challenges.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 relative">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-indigo-600">Array Methods Quiz</h2>
        
        {/* Place the timer here as part of the header row */}
        <div className="flex items-center gap-3">
          {!showResult && timerActive && (
            <div className="flex items-center bg-indigo-50 px-3 py-1 rounded-lg">
              <div className="flex items-center">
                <div className="relative flex items-center justify-center">
                  <span className="text-md font-bold z-10">{timeRemaining}</span>
                  <svg className="absolute w-8 h-8">
                    <circle
                      className="text-indigo-500"
                      strokeWidth="2"
                      stroke="currentColor"
                      fill="transparent"
                      r="12"
                      cx="16"
                      cy="16"
                      style={{
                        strokeDasharray: 75,
                        strokeDashoffset: (75 - (timeRemaining / 10 * 75)),
                        transformOrigin: 'center',
                        transform: 'rotate(-90deg)'
                      }}
                    />
                  </svg>
                </div>
                <span className="ml-2 text-indigo-700">seconds</span>
              </div>
            </div>
          )}
          <div className="flex items-center bg-indigo-100 px-3 py-1 rounded-full">
            <FaStar className="text-yellow-500 mr-2" />
            <span className="font-bold">{score} points</span>
          </div>
        </div>
      </div>
      
      <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-indigo-700">Question {currentChallenge + 1} of {challenges.length}</h3>
          <div className="flex items-center">
            <span className="text-xs text-indigo-600 mr-2">{challenges[currentChallenge].title}</span>
            {showResult && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center text-xs px-2 py-1 rounded-full bg-indigo-100"
              >
                {selectedOption === challenges[currentChallenge].correct ? (
                  <><FaCheck className="text-green-500 mr-1" /> +10 points</>
                ) : (
                  <FaTimes className="text-red-500 mr-1" />
                )}
              </motion.span>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-white p-5 rounded-lg shadow-lg">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-indigo-700 mb-3">Fruit Array</h3>
          <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
            {fruits.map((fruit, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <motion.div
                  className="bg-white w-10 h-10 flex items-center justify-center text-lg rounded shadow-sm border border-gray-200"
                  whileHover={{ scale: 1.1 }}
                >
                  {fruit}
                </motion.div>
                <div className="text-xs text-gray-500 mt-1">
                  <span>{idx}: {fruitNames[idx]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">{challenges[currentChallenge].question}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            {challenges[currentChallenge].options.map((option, idx) => (
              <motion.button
                key={idx}
                onClick={() => !showResult && checkAnswer(idx)}
                disabled={showResult}
                className={`p-3 rounded-lg border text-left ${
                  selectedOption === idx 
                    ? showResult
                      ? idx === challenges[currentChallenge].correct
                        ? 'bg-green-100 border-green-300'
                        : 'bg-red-100 border-red-300'
                      : 'bg-indigo-100 border-indigo-300'
                    : showResult && idx === challenges[currentChallenge].correct
                      ? 'bg-green-100 border-green-300'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
                whileHover={!showResult ? { scale: 1.02 } : {}}
                whileTap={!showResult ? { scale: 0.98 } : {}}
              >
                <div className="font-mono text-indigo-700 flex justify-between items-center">
                  {option}
                  {showResult && (
                    idx === challenges[currentChallenge].correct 
                      ? <FaCheck className="text-green-500" />
                      : selectedOption === idx 
                        ? <FaTimes className="text-red-500" />
                        : null
                  )}
                </div>
              </motion.button>
            ))}
          </div>
          
          {showResult && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-4 rounded-lg ${
                selectedOption === challenges[currentChallenge].correct 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              <div className="flex items-start">
                {selectedOption === challenges[currentChallenge].correct ? (
                  <FaCheck className="text-green-500 mt-1 mr-2" />
                ) : (
                  <FaTimes className="text-red-500 mt-1 mr-2" />
                )}
                <div className="flex-grow">
                  <h4 className="font-bold">
                    {selectedOption === challenges[currentChallenge].correct 
                      ? "Correct! +10 points" 
                      : "Incorrect"
                    }
                  </h4>
                  
                  <div className="mt-3 p-3 bg-gray-800 text-gray-100 rounded font-mono text-sm">
                    <p>Example:</p>
                    <code>{challenges[currentChallenge].example}</code>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="text-sm text-gray-500">
                      <span>Next question in </span>
                      <motion.span
                        key={`timer-${currentChallenge}`}
                        initial={{ width: '100%' }}
                        animate={{ width: '0%' }}
                        transition={{ duration: 3, ease: 'linear' }}
                        className="inline-block bg-indigo-200 h-1 w-20 mx-1 rounded-full"
                      ></motion.span>
                      <span>3s</span>
                    </div>
                    <button
                      onClick={goToNextChallenge}
                      className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 text-sm rounded flex items-center"
                    >
                      {currentChallenge < challenges.length - 1 ? (
                        <>Next <FaArrowRight className="ml-1" /></>
                      ) : (
                        <>Finish <FaTrophy className="ml-1" /></>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      
      <div className="flex justify-center mt-4">
        <div className="flex space-x-1">
          {challenges.map((_, i) => (
            <div
              key={i}
              className={`w-8 h-1 rounded-full transition-all ${
                i < currentChallenge 
                  ? succeeded[i]
                    ? 'bg-green-500'
                    : 'bg-red-500'
                  : i === currentChallenge
                    ? 'bg-indigo-600' 
                    : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
      
      
    </div>
  );
};

export default Slide6SearchingChallenge;
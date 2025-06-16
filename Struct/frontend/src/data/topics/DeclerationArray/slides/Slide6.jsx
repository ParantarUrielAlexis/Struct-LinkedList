import React, { useState, useEffect, useRef } from "react";
import { FaCheck, FaTimes, FaTrophy, FaCode, FaGamepad, FaLightbulb, FaRocket, FaStar, FaArrowRight, FaMedal, FaPlay, FaClock } from "react-icons/fa";
import { motion } from "framer-motion";

const Slide6 = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [completedChallenges, setCompletedChallenges] = useState(0);
  const [points, setPoints] = useState(0);
  const [challengeOrder, setChallengeOrder] = useState([]);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  // Game challenges with multiple choice options (20 questions total)
  const allChallenges = [
    {
      title: "Array Creation",
      description: "Which code correctly creates an array of numbers 1-5?",
      options: [
        "const arr = (1, 2, 3, 4, 5);",
        "const arr = [1, 2, 3, 4, 5];",
        "const arr = {1, 2, 3, 4, 5};",
        "const arr = Array(1, 2, 3, 4, 5);"
      ],
      correctAnswer: 1,
      explanation: "Square brackets [] are used to create array literals in JavaScript."
    },
    {
      title: "Empty Array Check",
      description: "Which is the correct way to check if an array is empty?",
      options: [
        "if (array.empty) { ... }",
        "if (array.length === 0) { ... }",
        "if (array.size === 0) { ... }",
        "if (array.isEmpty()) { ... }"
      ],
      correctAnswer: 1,
      explanation: "The length property returns the number of elements in an array. If it's 0, the array is empty."
    },
    {
      title: "Add to Array End",
      description: "How do you add an element to the end of an array?",
      options: [
        "array.add(element);",
        "array.append(element);",
        "array.push(element);",
        "array.insert(element);"
      ],
      correctAnswer: 2,
      explanation: "The push() method adds one or more elements to the end of an array."
    },
    {
      title: "Remove from End",
      description: "Which method removes the last element from an array?",
      options: [
        "array.pop();",
        "array.remove();",
        "array.deleteLast();",
        "array.splice(-1);"
      ],
      correctAnswer: 0,
      explanation: "The pop() method removes the last element from an array and returns it."
    },
    {
      title: "First Element Access",
      description: "What's the correct way to access the first element of an array?",
      options: [
        "array.first;",
        "array.first();",
        "array[0];",
        "array[1];"
      ],
      correctAnswer: 2,
      explanation: "Arrays use zero-based indexing, so the first element is at position 0."
    },
    {
      title: "Array Length",
      description: "How do you find the number of elements in an array?",
      options: [
        "array.count;",
        "array.size;",
        "array.length;",
        "array.elements;"
      ],
      correctAnswer: 2,
      explanation: "The length property returns the number of elements in an array."
    },
    {
      title: "Add to Beginning",
      description: "How do you add an element to the beginning of an array?",
      options: [
        "array.addFirst(element);",
        "array.prepend(element);",
        "array.unshift(element);",
        "array.insert(0, element);"
      ],
      correctAnswer: 2,
      explanation: "The unshift() method adds one or more elements to the beginning of an array."
    },
    {
      title: "Array Includes",
      description: "Which method checks if an array contains a specific element?",
      options: [
        "array.contains(element);",
        "array.includes(element);",
        "array.has(element);",
        "array.find(element);"
      ],
      correctAnswer: 1,
      explanation: "The includes() method determines whether an array includes a certain value."
    },
    {
      title: "Array Join",
      description: "How do you convert an array to a string with commas?",
      options: [
        "array.convert();",
        "array.toString();",
        "array.join();",
        "String(array);"
      ],
      correctAnswer: 2,
      explanation: "The join() method creates and returns a new string by concatenating all of the elements in an array, separated by commas by default."
    },
    {
      title: "Array Element Removal",
      description: "Which method removes elements from a specific position?",
      options: [
        "array.remove(index);",
        "array.delete(index);",
        "array.splice(index, count);",
        "array.cut(index, count);"
      ],
      correctAnswer: 2,
      explanation: "The splice() method changes the contents of an array by removing or replacing existing elements."
    },
    {
      title: "Array Filter",
      description: "How do you create a new array with elements that pass a test?",
      options: [
        "array.select(test);",
        "array.filter(test);",
        "array.where(test);",
        "array.test(condition);"
      ],
      correctAnswer: 1,
      explanation: "The filter() method creates a new array with all elements that pass the test implemented by the provided function."
    },
    {
      title: "Combine Arrays",
      description: "Which method combines two arrays into a new array?",
      options: [
        "array1.combine(array2);",
        "array1.append(array2);",
        "array1.concat(array2);",
        "array1.merge(array2);"
      ],
      correctAnswer: 2,
      explanation: "The concat() method returns a new array by combining arrays and/or values."
    },
    {
      title: "Array Map",
      description: "Which method creates a new array by transforming each element?",
      options: [
        "array.transform(func);",
        "array.convert(func);",
        "array.map(func);",
        "array.each(func);"
      ],
      correctAnswer: 2,
      explanation: "The map() method creates a new array populated with the results of calling a provided function on every element."
    },
    {
      title: "Array Sort",
      description: "How do you sort an array in JavaScript?",
      options: [
        "array.sort();",
        "array.order();",
        "array.arrange();",
        "array.sortBy();"
      ],
      correctAnswer: 0,
      explanation: "The sort() method sorts the elements of an array in place and returns the sorted array."
    },
    {
      title: "Find Array Element",
      description: "Which method returns the first element that satisfies a condition?",
      options: [
        "array.search(condition);",
        "array.find(condition);",
        "array.detect(condition);",
        "array.first(condition);"
      ],
      correctAnswer: 1,
      explanation: "The find() method returns the first element in the array that satisfies the provided testing function."
    },
    {
      title: "Remove First Element",
      description: "Which method removes the first element from an array?",
      options: [
        "array.shift();",
        "array.removeFirst();",
        "array.deleteFirst();",
        "array.splice(0, 1);"
      ],
      correctAnswer: 0,
      explanation: "The shift() method removes the first element from an array and returns it."
    },
    {
      title: "Array Index Of",
      description: "How do you find the index of an element in an array?",
      options: [
        "array.findIndex(element);",
        "array.indexOf(element);",
        "array.search(element);",
        "array.position(element);"
      ],
      correctAnswer: 1,
      explanation: "The indexOf() method returns the first index at which a given element can be found in the array."
    },
    {
      title: "Create Array From String",
      description: "How do you split a string into an array?",
      options: [
        "string.toArray();",
        "string.parse();",
        "string.split();",
        "Array.from(string);"
      ],
      correctAnswer: 2,
      explanation: "The split() method divides a string into an ordered list of substrings and returns them as an array."
    },
    {
      title: "Reverse Array",
      description: "Which method reverses the order of elements in an array?",
      options: [
        "array.invert();",
        "array.flip();",
        "array.reverse();",
        "array.backwards();"
      ],
      correctAnswer: 2,
      explanation: "The reverse() method reverses an array in place and returns the reference to the same array."
    },
    {
      title: "Flatten Nested Arrays",
      description: "Which method combines nested arrays into a single array?",
      options: [
        "array.flatten();",
        "array.flat();",
        "array.collapse();",
        "array.unnest();"
      ],
      correctAnswer: 1,
      explanation: "The flat() method creates a new array with all sub-array elements concatenated into it recursively."
    }
  ];

  // Fisher-Yates shuffle algorithm
  const shuffleArray = (array) => {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Function to select 10 random challenges from the 20
  const selectRandomChallenges = () => {
    const shuffled = shuffleArray([...Array(allChallenges.length).keys()]);
    return shuffled.slice(0, 10); // Take 10 questions
  };

  // Setup game when started
  useEffect(() => {
    if (gameStarted) {
      setChallengeOrder(selectRandomChallenges());
      setTimeLeft(10); // Set to 10 seconds per question
    }
  }, [gameStarted]);

  // Timer effect
  useEffect(() => {
    if (gameStarted && !showResult && !isPaused && timeLeft > 0 && challengeOrder.length > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            // Time's up! Move to next question or show results
            setTimeout(() => {
              if (currentChallenge < challengeOrder.length - 1) {
                setCurrentChallenge(prev => prev + 1);
                setSelectedOption(null);
                setIsCorrect(null);
                setTimeLeft(10); // Reset to 10 seconds
              } else {
                setShowResult(true);
              }
            }, 1500);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStarted, showResult, isPaused, challengeOrder, currentChallenge]);

  // Start the game
  const startGame = () => {
    setGameStarted(true);
    setShowResult(false);
    setCurrentChallenge(0);
    setCompletedChallenges(0);
    setPoints(0);
    setSelectedOption(null);
    setIsCorrect(null);
  };

  // Check selected answer
  const checkAnswer = (optionIndex) => {
    setIsPaused(true);
    clearInterval(timerRef.current);
    
    setSelectedOption(optionIndex);
    const currentQuestion = allChallenges[challengeOrder[currentChallenge]];
    const correct = optionIndex === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      setCompletedChallenges(completedChallenges + 1);
      
      // Award 20 points for correct answer (no time bonus)
      setPoints(points + 20);
    }
    
    // Move to next question after delay
    setTimeout(() => {
      if (currentChallenge < challengeOrder.length - 1) {
        setCurrentChallenge(currentChallenge + 1);
        setSelectedOption(null);
        setIsCorrect(null);
        setTimeLeft(10); // Reset to 10 seconds
        setIsPaused(false);
      } else {
        setShowResult(true);
      }
    }, 2000);
  };

  // Restart the game
  const restartGame = () => {
    setGameStarted(false);
    setCurrentChallenge(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setShowResult(false);
    setCompletedChallenges(0);
    setPoints(0);
    setTimeLeft(10); // Reset to 10 seconds
    setIsPaused(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // If game hasn't started yet, show cover page
  if (!gameStarted) {
    return (
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition hover:shadow-xl">
          <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
            <div className="absolute inset-0 opacity-20">
              <div className="w-20 h-20 rounded-full bg-white absolute top-5 left-5 opacity-20"></div>
              <div className="w-16 h-16 rounded-full bg-white absolute bottom-10 right-10 opacity-10"></div>
              <div className="w-24 h-24 rounded-full bg-white absolute top-20 right-20 opacity-10"></div>
            </div>
            <div className="h-full flex items-center justify-center p-6">
              <div className="relative">
                <div className="text-white text-4xl font-bold flex items-center drop-shadow-lg">
                  <FaGamepad className="mr-4" /> 
                  <span>Array Master Challenge</span>
                </div>
                <div className="text-blue-100 mt-2 text-center">Test your knowledge of JavaScript arrays!</div>
                <motion.div 
                  className="absolute -right-8 -top-8"
                  animate={{ rotate: [0, -5, 5, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <div className="bg-yellow-400 text-yellow-900 text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                    10 Questions
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <FaCode className="mr-2 text-blue-500" /> JavaScript Array Game
              </h2>
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-1 rounded flex items-center">
                <FaClock className="mr-1" /> 10 sec per question
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                  <FaPlay className="text-blue-600" />
                </div>
                <h3 className="font-medium text-blue-900 mb-1">Quick Play</h3>
                <p className="text-xs text-blue-700">10 randomized questions from a pool of 20</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                  <FaStar className="text-purple-600" />
                </div>
                <h3 className="font-medium text-purple-900 mb-1">Earn Points</h3>
                <p className="text-xs text-purple-700">20 points for each correct answer</p>
              </div>
              
              <div className="bg-indigo-50 p-4 rounded-lg flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
                  <FaMedal className="text-indigo-600" />
                </div>
                <h3 className="font-medium text-indigo-900 mb-1">Test Mastery</h3>
                <p className="text-xs text-indigo-700">Challenge yourself on array methods and syntax</p>
              </div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 mb-6">
              <div className="flex items-start">
                <FaLightbulb className="text-yellow-500 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-yellow-800 mb-1">How to Play</h3>
                  <p className="text-sm text-yellow-700">
                    Choose the correct answer for each array question within 10 seconds.
                    Each correct answer is worth 20 points! Can you get all 10 questions right?
                  </p>
                </div>
              </div>
            </div>
            
            <motion.button
              onClick={startGame}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md flex items-center justify-center shadow-md"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <FaPlay className="mr-2" /> Start Game
            </motion.button>
            
            <p className="mt-4 text-center text-xs text-gray-500">
              Challenge yourself and improve your JavaScript array skills!
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Wait for challenge order to be initialized
  if (challengeOrder.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading game...</p>
        </div>
      </div>
    );
  }

  // Get current challenge
  const currentChallengeData = allChallenges[challengeOrder[currentChallenge]];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-blue-700 flex items-center">
          <FaGamepad className="mr-2" /> Array Master Challenge
        </h2>
      </div>

      {!showResult ? (
        <motion.div 
          className="bg-white p-6 rounded-lg shadow-lg"
          key={currentChallenge}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-4">
            <div className="flex justify-between items-center">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                Question {currentChallenge + 1}/{challengeOrder.length}
              </span>
              <div className="flex space-x-3">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium flex items-center">
                  <FaCheck className="mr-1" /> {completedChallenges}
                </span>
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-medium flex items-center">
                  <FaStar className="mr-1" /> {points}
                </span>
              </div>
            </div>

            {/* Timer bar - adjusted for 10 seconds */}
            <div className="mt-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-gray-500">Time remaining</span>
                <span className={`text-xs font-bold ${timeLeft < 5 ? 'text-red-500' : 'text-gray-700'}`}>
                  {timeLeft}s
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full transition-all ${
                    timeLeft > 6 ? 'bg-green-500' : 
                    timeLeft > 3 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${(timeLeft / 10) * 100}%` }}
                ></div>
              </div>
            </div>

            <h3 className="text-lg font-bold mt-4">{currentChallengeData.title}</h3>
            <p className="text-gray-700 mt-1">{currentChallengeData.description}</p>
          </div>

          <div className="mt-6 space-y-3">
            {currentChallengeData.options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => selectedOption === null && !isPaused && checkAnswer(index)}
                disabled={selectedOption !== null || isPaused}
                className={`w-full text-left p-4 rounded-md border transition-all ${
                  selectedOption === null 
                    ? "bg-white hover:bg-gray-50 border-gray-200 transform hover:scale-[1.01]" 
                    : selectedOption === index
                      ? index === currentChallengeData.correctAnswer
                        ? "bg-green-100 border-green-300"
                        : "bg-red-100 border-red-300"
                      : index === currentChallengeData.correctAnswer
                        ? "bg-green-100 border-green-300"
                        : "bg-white border-gray-200"
                }`}
                whileHover={selectedOption === null ? { scale: 1.01 } : {}}
                whileTap={selectedOption === null ? { scale: 0.99 } : {}}
              >
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-medium ${
                    selectedOption === null 
                      ? "bg-gray-100 text-gray-700" 
                      : selectedOption === index
                        ? index === currentChallengeData.correctAnswer
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                        : index === currentChallengeData.correctAnswer
                          ? "bg-green-500 text-white"
                          : "bg-gray-100 text-gray-700"
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <code className="font-mono">{option}</code>
                  {selectedOption !== null && selectedOption === index && index === currentChallengeData.correctAnswer && (
                    <FaCheck className="ml-auto text-green-500" />
                  )}
                  {selectedOption !== null && selectedOption === index && index !== currentChallengeData.correctAnswer && (
                    <FaTimes className="ml-auto text-red-500" />
                  )}
                  {selectedOption !== null && selectedOption !== index && index === currentChallengeData.correctAnswer && (
                    <FaCheck className="ml-auto text-green-500" />
                  )}
                </div>
              </motion.button>
            ))}
          </div>

          {/* Explanation after answering */}
          {selectedOption !== null && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-4 rounded-md ${
                isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
              }`}
            >
              <div className="flex items-start">
                {isCorrect ? (
                  <FaCheck className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                ) : (
                  <FaTimes className="text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                )}
                <div>
                  <p className="font-medium">
                    {isCorrect ? "Correct! +20 points" : "Incorrect"}
                  </p>
                  <p className="text-sm mt-1">{currentChallengeData.explanation}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Time's up message */}
          {timeLeft === 0 && selectedOption === null && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 rounded-md bg-amber-50 border border-amber-200"
            >
              <div className="flex items-start">
                <FaTimes className="text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium text-amber-800">Time's up!</p>
                  <p className="text-sm mt-1">
                    The correct answer was: <code className="bg-amber-100 px-1 py-0.5 rounded">
                      {currentChallengeData.options[currentChallengeData.correctAnswer]}
                    </code>
                  </p>
                  <p className="text-sm mt-1">{currentChallengeData.explanation}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Next question message */}
          {(selectedOption !== null || timeLeft === 0) && (
            <div className="mt-4 text-center text-sm text-gray-500">
              <div className="flex items-center justify-center">
                <span>Next question in a moment</span>
                <span className="ml-2 flex items-center">
                  <span className="animate-pulse">•</span>
                  <span className="animate-pulse delay-150">•</span>
                  <span className="animate-pulse delay-300">•</span>
                </span>
              </div>
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div 
          className="bg-white p-6 rounded-lg shadow-lg text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <FaTrophy className="text-yellow-500 text-6xl mx-auto mb-4" />
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <h3 className="text-2xl font-bold mb-2">Game Complete!</h3>
            
            <div className="mb-6">
              <p className="text-lg">
                Score: <span className="font-bold text-yellow-600">{points}</span> points
              </p>
              <p className="text-md">
                You got <span className="font-bold text-blue-600">{completedChallenges}</span> out of {challengeOrder.length} correct
              </p>
            </div>

            {completedChallenges === challengeOrder.length ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
                <h4 className="font-bold text-green-800 mb-2">Perfect Score! 🏆</h4>
                <p className="text-green-700">You're an Array Master! You know your JavaScript arrays inside and out.</p>
                <div className="flex justify-center mt-3 space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                    >
                      <FaStar className="text-yellow-400 text-xl" />
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : completedChallenges >= challengeOrder.length * 0.6 ? (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
                <h4 className="font-bold text-blue-800 mb-2">Great Job! 🌟</h4>
                <p className="text-blue-700">You have a strong understanding of JavaScript arrays.</p>
                <div className="flex justify-center mt-3 space-x-1">
                  {[...Array(Math.ceil(completedChallenges / challengeOrder.length * 5))].map((_, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                    >
                      <FaStar className="text-blue-400 text-xl" />
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-6">
                <h4 className="font-bold text-amber-800 mb-2">Good Effort! 💫</h4>
                <p className="text-amber-700">Keep practicing your array skills to improve your score!</p>
                <div className="flex justify-center mt-3 space-x-1">
                  {[...Array(Math.max(1, Math.ceil(completedChallenges / challengeOrder.length * 5)))].map((_, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                    >
                      <FaStar className="text-amber-400 text-xl" />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            <motion.div 
              className="mt-6 flex space-x-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <motion.button
                onClick={restartGame}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium flex items-center shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaPlay className="mr-2" /> Play Again
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}

      
    </div>
  );
};

export default Slide6;
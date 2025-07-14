import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaTrophy, FaCode, FaPlay, FaLightbulb, FaStar, FaCheck, FaTimes, FaArrowRight, FaSpinner } from "react-icons/fa";
import axios from 'axios';

const Slide8MergingSplittingChallenge = () => {
  const allChallenges = [
    {
      id: 1,
      title: "Merge and Sort",
      question: "Which code correctly merges the two arrays and sorts the result in ascending order?",
      arrays: {
        array1: [5, 1, 9],
        array2: [3, 7, 2]
      },
      options: [
        "const result = array1.concat(array2).sort((a, b) => a - b);",
        "const result = [...array1, ...array2].sort((a, b) => a - b);",
        "const result = [array1, array2].flat().sort();",
        "const result = array1.push(...array2).sort();"
      ],
      correct: 1,
      explanation: "The spread operator (...) is used to merge the arrays into a new array, then sort() with a compare function sorts them numerically."
    },
    {
      id: 2,
      title: "Extract Middle Elements",
      question: "Which code correctly extracts the middle three elements from the array?",
      arrays: {
        array: [7, 9, 0, 4, 2, 8, 5]
      },
      options: [
        "const result = array.splice(2, 3);",
        "const result = array.slice(2, 5);",
        "const middle = Math.floor(array.length / 2); const result = array.slice(middle - 1, middle + 2);",
        "const result = array.filter((_, i) => i >= 2 && i <= 4);"
      ],
      correct: 2,
      explanation: "This finds the middle index and uses slice() to get one element before and one after the middle element."
    },
    {
      id: 3,
      title: "Splice Challenge",
      question: "Which code removes the 3rd and 4th elements and replaces them with 'apple' and 'banana'?",
      arrays: {
        array: ['dog', 'cat', 'fish', 'bird', 'turtle']
      },
      options: [
        "array.replace(2, 2, 'apple', 'banana');",
        "array.splice(2, 2, 'apple', 'banana');",
        "array[2] = 'apple'; array[3] = 'banana';",
        "array = [...array.slice(0, 2), 'apple', 'banana', ...array.slice(4)];"
      ],
      correct: 1,
      explanation: "The splice() method changes an array by removing elements and/or adding new elements. Here it starts at index 2, removes 2 items, and adds the new fruits."
    },
    {
      id: 4,
      title: "Advanced Merging Challenge",
      question: "Which code merges three arrays while avoiding duplicates in the result?",
      arrays: {
        nums1: [1, 3, 5],
        nums2: [2, 3, 6],
        nums3: [1, 5, 7]
      },
      options: [
        "const result = [...new Set([...nums1, ...nums2, ...nums3])];",
        "const result = nums1.concat(nums2, nums3).filter((v, i, a) => a.indexOf(v) === i);",
        "const result = Array.from(new Set([].concat(nums1, nums2, nums3)));",
        "Both A and C are correct"
      ],
      correct: 3,
      explanation: "Both options use Set to automatically remove duplicates. Option A uses the spread operator, while option C uses Array.from and concat, but both produce the same result."
    },
    {
      id: 5,
      title: "Array Chunking",
      question: "Which code splits an array into chunks of size 2?",
      arrays: {
        array: [1, 2, 3, 4, 5, 6, 7]
      },
      options: [
        "const result = array.reduce((acc, val, i) => (i % 2 === 0 ? acc.push([val]) : acc[acc.length - 1].push(val), acc), []);",
        "const result = Array.from({ length: Math.ceil(array.length / 2) }, (_, i) => array.slice(i * 2, i * 2 + 2));",
        "const result = []; for (let i = 0; i < array.length; i += 2) result.push(array.slice(i, i + 2));",
        "const result = array.split(2);"
      ],
      correct: 2,
      explanation: "This creates a loop that slices the array every 2 elements, creating chunks of size 2."
    },
    {
      id: 6,
      title: "Array Flattening",
      question: "Which method would flatten a nested array like [[1,2], [3,4], [5,6]] into [1,2,3,4,5,6]?",
      arrays: {
        nested: [[1,2], [3,4], [5,6]]
      },
      options: [
        "nested.flatten()",
        "nested.flat()",
        "nested.flatMap(a => a)",
        "nested.reduce((acc, val) => acc.concat(val), [])"
      ],
      correct: 1,
      explanation: "The flat() method creates a new array with all sub-array elements concatenated into it recursively up to the specified depth (default is 1)."
    },
    {
      id: 7,
      title: "Array Transformation",
      question: "Which code transforms each element in the array by multiplying it by 2?",
      arrays: {
        numbers: [1, 2, 3, 4, 5]
      },
      options: [
        "numbers.forEach(x => x * 2)",
        "numbers.map(x => x * 2)",
        "numbers.flatMap(x => x * 2)",
        "numbers.reduce((acc, x) => [...acc, x * 2], [])"
      ],
      correct: 1,
      explanation: "The map() method creates a new array populated with the results of calling a provided function on every element in the calling array."
    },
    {
      id: 8,
      title: "Array Joining",
      question: "Which method combines all elements of an array into a string with a specified separator?",
      arrays: {
        items: ["apple", "banana", "orange"]
      },
      options: [
        "items.combine('-')",
        "items.concat('-')",
        "items.join('-')",
        "items.toString('-')"
      ],
      correct: 2,
      explanation: "The join() method creates and returns a new string by concatenating all the elements in an array, separated by the specified separator."
    },
    {
      id: 9,
      title: "Array Division",
      question: "Which code correctly splits the array into two parts at index 3?",
      arrays: {
        array: [1, 2, 3, 4, 5, 6, 7]
      },
      options: [
        "const [first, second] = array.split(3)",
        "const first = array.slice(0, 3); const second = array.slice(3);",
        "const first = array.splice(0, 3); const second = array;",
        "const [first, second] = [array.filter((_, i) => i < 3), array.filter((_, i) => i >= 3)]"
      ],
      correct: 1,
      explanation: "Using slice() is the most efficient way to split an array without modifying the original. The first part takes elements from index 0 up to (but not including) index 3, and the second part takes elements from index 3 to the end."
    },
    {
      id: 10,
      title: "Array Intersection",
      question: "Which code finds common elements between two arrays?",
      arrays: {
        a1: [1, 2, 3, 4, 5],
        a2: [3, 4, 5, 6, 7]
      },
      options: [
        "const result = a1.intersect(a2);",
        "const result = a1.filter(x => a2.includes(x));",
        "const result = a1.find(x => a2.includes(x));",
        "const result = [...a1, ...a2].filter(x => a1.includes(x) && a2.includes(x));"
      ],
      correct: 1,
      explanation: "Using filter() with includes() checks each element from the first array to see if it exists in the second array, effectively finding the intersection."
    },
    {
      id: 11,
      title: "Array Difference",
      question: "Which code returns elements from the first array that are not in the second array?",
      arrays: {
        a1: [1, 2, 3, 4, 5],
        a2: [3, 4, 5, 6, 7]
      },
      options: [
        "const result = a1.difference(a2);",
        "const result = a1.filter(x => !a2.includes(x));",
        "const result = a1 - a2;",
        "const result = a1.remove(a2);"
      ],
      correct: 1,
      explanation: "The filter() method with a negated includes() check creates a new array with elements from the first array that don't exist in the second array."
    },
    {
      id: 12,
      title: "Array Symmetrical Difference",
      question: "Which code returns elements unique to either array (not in both)?",
      arrays: {
        a1: [1, 2, 3, 4],
        a2: [3, 4, 5, 6]
      },
      options: [
        "const result = [...a1.filter(x => !a2.includes(x)), ...a2.filter(x => !a1.includes(x))];",
        "const result = [...a1, ...a2].filter(x => !(a1.includes(x) && a2.includes(x)));",
        "const result = a1.symmetricDifference(a2);",
        "Both A and B are correct"
      ],
      correct: 3,
      explanation: "Both options A and B correctly find the symmetrical difference. Option A explicitly filters each array for elements not in the other and combines them, while option B filters the combined array for elements not in both arrays."
    },
    {
      id: 13,
      title: "Array Rotation",
      question: "Which code rotates an array by moving the last 2 elements to the beginning?",
      arrays: {
        array: [1, 2, 3, 4, 5, 6]
      },
      options: [
        "const result = array.rotate(-2);",
        "const result = [...array.slice(-2), ...array.slice(0, -2)];",
        "const result = array.splice(-2).concat(array);",
        "const result = array.unshift(...array.splice(-2));"
      ],
      correct: 1,
      explanation: "The spread operator with slice(-2) gets the last two elements, and slice(0, -2) gets everything except the last two elements. Combining them with spread creates the rotated array."
    },
    {
      id: 14,
      title: "Array Zipping",
      question: "Which code combines two arrays by alternating their elements?",
      arrays: {
        names: ["Alice", "Bob", "Charlie"],
        ages: [25, 30, 35]
      },
      options: [
        "const result = names.zip(ages);",
        "const result = names.flatMap((name, i) => [name, ages[i]]);",
        "const result = names.reduce((acc, name, i) => [...acc, name, ages[i]], []);",
        "Both B and C are correct"
      ],
      correct: 3,
      explanation: "Both flatMap() and reduce() approaches achieve the same result of interleaving elements from two arrays. They create a new array with alternating elements from each original array."
    },
    {
      id: 15,
      title: "Array Grouping",
      question: "Which code groups an array of objects by a property value?",
      arrays: {
        users: [
          JSON.stringify({name: "Alice", role: "admin"}),
          JSON.stringify({name: "Bob", role: "user"}),
          JSON.stringify({name: "Charlie", role: "admin"})
        ]
      },
      options: [
        "const result = users.groupBy(user => user.role);",
        "const result = users.reduce((acc, user) => ({...acc, [user.role]: [...(acc[user.role] || []), user]}), {});",
        "const result = Object.groupBy(users, user => user.role);",
        "const result = users.map(user => user.role).reduce((acc, role, i) => ({...acc, [role]: [...(acc[role] || []), users[i]]}), {});"
      ],
      correct: 1,
      explanation: "The reduce() method creates an object where keys are the role values and values are arrays of users with that role, effectively grouping users by their role property."
    }
  ];

  const [gameStarted, setGameStarted] = useState(false);
  const [challenges, setChallenges] = useState([]);
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [succeeded, setSucceeded] = useState([]);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(10);
  const [timerActive, setTimerActive] = useState(false);
  const [autoAdvanceTimer, setAutoAdvanceTimer] = useState(null);

  // Backend integration states
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  
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
          quiz_type: 'array_merging_splitting'
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
      setSubmissionStatus('submitting');
      
      const result = await submitQuizScore(finalScore);
      
      if (result.success) {
        setSubmissionStatus('success');
        setScoreSubmitted(true);
      } else {
        setSubmissionStatus('error');
        console.error("Failed to submit score:", result.error);
      }
    } catch (error) {
      setSubmissionStatus('error');
      console.error("Error in game completion:", error);
    }
  };
  
  // Function to shuffle array
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
    // Reset submission states
    setSubmissionStatus(null);
    setScoreSubmitted(false);
  };

  // Timer effect
  useEffect(() => {
    let interval = null;
    
    if (timerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } 
    else if (timeRemaining <= 0 && timerActive) {
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
          setShowExplanation(false);
          setTimeRemaining(10);
          setTimerActive(true);
        } else {
          setIsCompleted(true);
          // Submit score when quiz completes
          handleGameCompletion(score);
        }
      }, 3000);
      
      setAutoAdvanceTimer(advanceTimer);
    }
    
    // Clean up interval
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timeRemaining, currentChallenge, challenges.length, selectedOption, score]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (autoAdvanceTimer) {
        clearTimeout(autoAdvanceTimer);
      }
    };
  }, [autoAdvanceTimer]);
  
  const checkAnswer = (optionIndex) => {
    // Stop the timer
    setTimerActive(false);
    
    setSelectedOption(optionIndex);
    setShowResult(true);
    
    const isCorrect = optionIndex === challenges[currentChallenge].correct;
    
    if (isCorrect && !succeeded[currentChallenge]) {
      setScore(prevScore => {
        const newScore = prevScore + 20;
        return newScore;
      });
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
        setShowExplanation(false);
        setTimeRemaining(10);
        setTimerActive(true);
      } else {
        setIsCompleted(true);
        // Submit score when quiz completes - use the updated score
        const finalScore = score + (isCorrect ? 20 : 0);
        handleGameCompletion(finalScore);
      }
    }, 3000);
    
    setAutoAdvanceTimer(timer);
  };

  const goToNextChallenge = () => {
    // Clear any existing timer
    if (autoAdvanceTimer) {
      clearTimeout(autoAdvanceTimer);
      setAutoAdvanceTimer(null);
    }
    
    if (currentChallenge < challenges.length - 1) {
      setCurrentChallenge(currentChallenge + 1);
      setSelectedOption(null);
      setShowResult(false);
      setShowExplanation(false);
      setTimeRemaining(10);
      setTimerActive(true);
    } else {
      setIsCompleted(true);
      // Submit score when manually finishing
      handleGameCompletion(score);
    }
  };

  const resetGame = () => {
    if (autoAdvanceTimer) {
      clearTimeout(autoAdvanceTimer);
      setAutoAdvanceTimer(null);
    }
    
    setGameStarted(false);
    setCurrentChallenge(0);
    setSelectedOption(null);
    setShowResult(false);
    setScore(0);
    setSucceeded([]);
    setIsCompleted(false);
    setShowExplanation(false);
    setTimerActive(false);
    setTimeRemaining(10);
    // Reset submission states
    setSubmissionStatus(null);
    setScoreSubmitted(false);
  };

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
          <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
            <div className="absolute inset-0 opacity-20">
              <div className="w-20 h-20 rounded-full bg-white absolute top-5 left-5 opacity-20"></div>
              <div className="w-16 h-16 rounded-full bg-white absolute bottom-10 right-10 opacity-10"></div>
              <div className="w-24 h-24 rounded-full bg-white absolute top-20 right-20 opacity-10"></div>
            </div>
            <div className="h-full flex items-center justify-center p-6">
              <div className="relative">
                <div className="text-white text-4xl font-bold flex items-center drop-shadow-lg text-center">
                  <FaCode className="mr-4" />
                  Array Merging & Splitting Quiz
                </div>
                <div className="text-blue-100 mt-2 text-center">
                  Test your knowledge of JavaScript array manipulation methods!
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <FaStar className="mr-2 text-blue-500" /> 10 Array Manipulation Challenges
              </h2>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded flex items-center">
                <FaStar className="mr-1" /> 20 points per correct answer
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div className="bg-blue-50 p-5 rounded-lg">
                <h3 className="font-bold text-blue-800 mb-3">What You'll Learn</h3>
                <ul className="text-sm space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <FaArrowRight className="mt-0.5 mr-2 text-blue-500 flex-shrink-0" />
                    <span>Merging arrays with concat() and spread syntax</span>
                  </li>
                  <li className="flex items-start">
                    <FaArrowRight className="mt-0.5 mr-2 text-blue-500 flex-shrink-0" />
                    <span>Extracting elements with slice() and splice()</span>
                  </li>
                  <li className="flex items-start">
                    <FaArrowRight className="mt-0.5 mr-2 text-blue-500 flex-shrink-0" />
                    <span>Removing duplicates with Set</span>
                  </li>
                  <li className="flex items-start">
                    <FaArrowRight className="mt-0.5 mr-2 text-blue-500 flex-shrink-0" />
                    <span>Chunking arrays into smaller pieces</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-purple-50 p-5 rounded-lg">
                <h3 className="font-bold text-purple-800 mb-3">How To Play</h3>
                <ul className="text-sm space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <FaArrowRight className="mt-0.5 mr-2 text-purple-500 flex-shrink-0" />
                    <span>You have 10 seconds to answer each question</span>
                  </li>
                  <li className="flex items-start">
                    <FaArrowRight className="mt-0.5 mr-2 text-purple-500 flex-shrink-0" />
                    <span>Each correct answer earns you 20 points</span>
                  </li>
                  <li className="flex items-start">
                    <FaArrowRight className="mt-0.5 mr-2 text-purple-500 flex-shrink-0" />
                    <span>After answering, you'll see the explanation</span>
                  </li>
                  <li className="flex items-start">
                    <FaArrowRight className="mt-0.5 mr-2 text-purple-500 flex-shrink-0" />
                    <span>The quiz automatically advances after 3 seconds</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-amber-50 p-4 rounded-md border border-amber-200 mb-6">
              <div className="flex items-center">
                <FaLightbulb className="text-amber-500 mr-3 flex-shrink-0" />
                <div>
                  <p className="font-medium text-amber-800">Why This Matters</p>
                  <p className="text-sm mt-1">
                    Array manipulation methods are essential for data processing tasks. Learning how to 
                    merge, split, and transform arrays efficiently will help you become a more effective 
                    JavaScript programmer.
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
              <FaPlay className="mr-2" /> Start Quiz
            </motion.button>
            
            <p className="mt-4 text-center text-xs text-gray-500">
              Test your knowledge of JavaScript array manipulation methods!
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Game completion screen
  if (isCompleted) {
    // Calculate percentage score
    const percentage = Math.round((score / (challenges.length * 20)) * 100);
    
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
              Final Score: <span className="font-bold text-blue-600">{score}</span> points
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
          
          {/* Score Submission Status */}
          <div className="mb-6">
            {submissionStatus === 'submitting' && (
              <div className="flex items-center justify-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <FaSpinner className="animate-spin text-blue-500 mr-2" />
                <span className="text-blue-700">Submitting your score...</span>
              </div>
            )}
            
            {submissionStatus === 'success' && scoreSubmitted && (
              <div className="flex items-center justify-center p-4 bg-green-50 border border-green-200 rounded-lg">
                <FaCheck className="text-green-500 mr-2" />
                <span className="text-green-700">Score submitted successfully! Points added to your account.</span>
              </div>
            )}
            
            {submissionStatus === 'error' && (
              <div className="flex items-center justify-center p-4 bg-red-50 border border-red-200 rounded-lg">
                <FaTimes className="text-red-500 mr-2" />
                <span className="text-red-700">Failed to submit score. Please try again later.</span>
              </div>
            )}
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
              {percentage >= 80 ? "You've mastered JavaScript array manipulation methods!" :
               percentage >= 60 ? "You have a good understanding of array methods, but there's still room to improve." :
               "Don't worry! Array manipulation methods take practice. Try again to improve your score."}
            </p>
          </div>
          
          <button
            onClick={resetGame}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md"
          >
            Play Again
          </button>
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

  // An even better solution for array rendering with special handling for objects
  const renderArrays = (arrays) => {
    return (
      <div className="flex flex-wrap gap-4 my-4">
        {Object.entries(arrays).map(([name, array]) => (
          <div key={name} className="flex flex-col">
            <span className="text-sm font-medium text-blue-700 mb-1">{name}:</span>
            
            {name === "users" ? (
              // Special handling for user objects
              <div className="flex flex-col gap-1">
                <div className="grid grid-cols-2 gap-2 text-xs font-medium bg-blue-100 p-1 rounded">
                  <div>name</div>
                  <div>role</div>
                </div>
                {array.map((user, idx) => {
                  // Parse the user object if it was stringified
                  const userObj = typeof user === 'string' ? JSON.parse(user) : user;
                  return (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="grid grid-cols-2 gap-2 bg-blue-50 border border-blue-200 p-1 rounded text-blue-800 text-xs font-mono"
                    >
                      <div>{userObj.name}</div>
                      <div>{userObj.role}</div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              // Regular array rendering
              <div className="flex flex-wrap gap-1">
                {Array.isArray(array) && array.map((item, idx) => (
                  <motion.div
                    key={`${name}-${idx}`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-blue-50 border border-blue-200 px-2 py-1 rounded text-blue-800 font-mono"
                  >
                    {typeof item === 'string' ? 
                      item.startsWith('{') ? item : `"${item}"` : 
                      item}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-600">Array Methods Quiz</h2>
        <div className="flex items-center gap-3">
          {!showResult && timerActive && (
            <div className="flex items-center bg-blue-50 px-3 py-1 rounded-lg">
              <div className="flex items-center justify-center">
                <div className="relative flex items-center justify-center w-8 h-8">
                  {/* Circle progress */}
                  <svg className="absolute inset-0 w-full h-full">
                    <circle
                      className="text-blue-200"
                      strokeWidth="2"
                      stroke="currentColor"
                      fill="transparent"
                      r="12"
                      cx="16"
                      cy="16"
                    />
                    <circle
                      className="text-blue-500"
                      strokeWidth="2"
                      stroke="currentColor"
                      fill="transparent"
                      r="12"
                      cx="16"
                      cy="16"
                      strokeDasharray="75"
                      strokeDashoffset={(75 - (timeRemaining / 10 * 75))}
                      transform="rotate(-90 16 16)"
                    />
                  </svg>
                  {/* Timer number (centered) */}
                  <span className="font-bold text-blue-800 z-10">{timeRemaining}</span>
                </div>
                <span className="ml-2 text-blue-700">seconds</span>
              </div>
            </div>
          )}
          <div className="flex items-center bg-blue-100 px-3 py-1 rounded-full">
            <FaStar className="text-yellow-500 mr-2" />
            <span className="font-bold">{score} points</span>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-blue-700">Question {currentChallenge + 1} of {challenges.length}</h3>
          <span className="text-sm text-blue-700 font-medium">{challenges[currentChallenge].title}</span>
        </div>
      </div>
      
      <div className="bg-white p-5 rounded-lg shadow-lg">
        {renderArrays(challenges[currentChallenge].arrays)}
        
        <div className="mt-4">
          <h3 className="text-lg font-bold text-gray-800 mb-3">{challenges[currentChallenge].question}</h3>
          
          <div className="grid grid-cols-1 gap-3 mb-6">
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
                      : 'bg-blue-100 border-blue-300'
                    : showResult && idx === challenges[currentChallenge].correct
                      ? 'bg-green-100 border-green-300'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
                whileHover={!showResult ? { scale: 1.01 } : {}}
                whileTap={!showResult ? { scale: 0.99 } : {}}
              >
                <div className="font-mono text-sm text-gray-800 flex justify-between items-center">
                  <div className="whitespace-pre-wrap">{option}</div>
                  {showResult && (
                    idx === challenges[currentChallenge].correct 
                      ? <FaCheck className="text-green-500 ml-2 flex-shrink-0" />
                      : selectedOption === idx 
                        ? <FaTimes className="text-red-500 ml-2 flex-shrink-0" />
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
                      ? "Correct! +20 points" 
                      : "Incorrect"
                    }
                  </h4>
                  
                  <div className="mt-3 p-3 bg-white border rounded">
                    <h5 className="font-medium mb-1">Explanation:</h5>
                    <p className="text-sm text-gray-700">{challenges[currentChallenge].explanation}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="text-sm text-gray-500">
                      <span>Next question in </span>
                      <motion.span
                        key={`timer-${currentChallenge}`}
                        initial={{ width: '100%' }}
                        animate={{ width: '0%' }}
                        transition={{ duration: 3, ease: 'linear' }}
                        className="inline-block bg-blue-200 h-1 w-20 mx-1 rounded-full"
                      ></motion.span>
                      <span>3s</span>
                    </div>
                    <button
                      onClick={goToNextChallenge}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 text-sm rounded flex items-center"
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
                    ? 'bg-blue-600' 
                    : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slide8MergingSplittingChallenge;
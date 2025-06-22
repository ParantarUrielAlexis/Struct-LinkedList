import React, { useState, useEffect } from "react";
import { FaTrophy, FaLightbulb, FaExclamationTriangle, FaPlay, FaClock, FaBolt, FaGamepad, FaMedal, FaArrowRight, FaSpinner, FaCheck, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios'; 

const Slide3 = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null); // 'loading', 'success', 'error'
  const [submissionMessage, setSubmissionMessage] = useState('');

  const allQuestions = [
    {
      question: "What will be the output of: const fruits = ['apple', 'banana', 'orange']; console.log(fruits[1]);",
      options: ["apple", "banana", "orange", "undefined"],
      correctAnswer: 1,
      explanation: "Arrays use zero-based indexing, so fruits[1] accesses the second element: 'banana'."
    },
    {
      question: "What will be the output of: const numbers = [10, 20, 30]; console.log(numbers[numbers.length - 1]);",
      options: ["10", "20", "30", "undefined"],
      correctAnswer: 2,
      explanation: "numbers.length - 1 gives us the index of the last element (2), so numbers[2] is 30."
    },
    {
      question: "What will be the output of: const colors = ['red', 'green', 'blue']; console.log(colors[3]);",
      options: ["red", "green", "blue", "undefined"],
      correctAnswer: 3,
      explanation: "colors[3] tries to access an element that doesn't exist (beyond the array bounds), so it returns undefined."
    },
    {
      question: "What's the correct way to access the last element of any array called 'arr' without knowing its length?",
      options: ["arr[arr.length]", "arr[arr.length - 1]", "arr[-1]", "arr.last()"],
      correctAnswer: 1,
      explanation: "arr.length - 1 gives the index of the last element. arr[-1] doesn't work in standard JavaScript (though it works in some languages like Python)."
    },
    {
      question: "const nested = [[1, 2], [3, 4], [5, 6]]; What's the value of nested[1][0]?",
      options: ["1", "2", "3", "5"],
      correctAnswer: 2,
      explanation: "nested[1] accesses the second array [3, 4], and [0] accesses its first element, which is 3."
    },
    {
      question: "What will be the output of: const arr = [1, 2, 3]; console.log(arr[arr[0]]);",
      options: ["1", "2", "3", "undefined"],
      correctAnswer: 1,
      explanation: "arr[0] is 1, so arr[arr[0]] becomes arr[1], which is 2."
    },
    {
      question: "Given const array = [10, 20, 30, 40, 50]; what does array.slice(1, 3) return?",
      options: ["[10, 20]", "[20, 30]", "[20, 30, 40]", "[10, 20, 30]"],
      correctAnswer: 1,
      explanation: "slice(1, 3) returns elements from index 1 (inclusive) to index 3 (exclusive), which are [20, 30]."
    },
    {
      question: "const data = [10, 20, 30]; data[1] = 50; What is data now?",
      options: ["[10, 20, 30]", "[10, 50, 30]", "[50, 20, 30]", "[10, 20, 50]"],
      correctAnswer: 1,
      explanation: "data[1] = 50 replaces the element at index 1 (the second element) with 50, resulting in [10, 50, 30]."
    },
    {
      question: "const arr = [1, 2, 3]; arr[3] = 4; What is arr.length now?",
      options: ["3", "4", "5", "undefined"],
      correctAnswer: 1,
      explanation: "After setting arr[3] = 4, the array becomes [1, 2, 3, 4] with a length of 4."
    },
    {
      question: "const arr = [1, 2, 3]; arr[10] = 10; What is arr.length now?",
      options: ["3", "10", "11", "4"],
      correctAnswer: 2,
      explanation: "Setting arr[10] = 10 creates sparse array with empty slots between indices 3-9, making the length 11."
    },
    {
      question: "const grid = [[1, 2], [3, 4], [5, 6]]; What is grid[2][1]?",
      options: ["2", "4", "5", "6"],
      correctAnswer: 3,
      explanation: "grid[2] is the third array [5, 6], and [1] accesses its second element, which is 6."
    },
    {
      question: "What will console.log(['a', 'b', 'c'][0][0]) output?",
      options: ["'a'", "'b'", "undefined", "Error"],
      correctAnswer: 0,
      explanation: "['a', 'b', 'c'][0] is 'a', and 'a'[0] is the first character of the string, which is 'a'."
    },
    {
      question: "const arr = []; arr[0] = 1; arr[1] = 2; What is arr.length?",
      options: ["0", "1", "2", "3"],
      correctAnswer: 2,
      explanation: "After adding elements at indices 0 and 1, the array has 2 elements, so its length is 2."
    },
    {
      question: "What is the output of: const arr = [10, 20, 30]; console.log(arr[arr.length]);",
      options: ["10", "30", "undefined", "Error"],
      correctAnswer: 2,
      explanation: "arr.length is 3, and arr[3] is accessing an element beyond the array bounds, which returns undefined."
    },
    {
      question: "const arr = ['a', 'b', 'c']; What is the output of console.log(0 in arr);",
      options: ["true", "false", "'a'", "undefined"],
      correctAnswer: 0,
      explanation: "The 'in' operator checks if an index exists in the array. Since index 0 exists, it returns true."
    },
    {
      question: "What's the modern way to access the last element of an array 'arr'?",
      options: ["arr.last()", "arr.end()", "arr.at(-1)", "arr[-1]"],
      correctAnswer: 2,
      explanation: "The at() method allows negative indices, where -1 refers to the last element."
    },
    {
      question: "const matrix = [[1, 2], [3, 4]]; What is matrix[0].length?",
      options: ["1", "2", "4", "undefined"],
      correctAnswer: 1,
      explanation: "matrix[0] is [1, 2], which has a length of 2."
    },
    {
      question: "What will be the output of: const arr = [1, 2, 3]; const [, second, ] = arr; console.log(second);",
      options: ["1", "2", "3", "undefined"],
      correctAnswer: 1,
      explanation: "This uses destructuring assignment. The comma skips the first element, assigns the second element to 'second', and skips the third."
    },
    {
      question: "const obj = {0: 'a', 1: 'b', 2: 'c'}; What is obj[1]?",
      options: ["0", "1", "'a'", "'b'"],
      correctAnswer: 3,
      explanation: "Object access with obj[1] looks up property with key '1', which has value 'b'."
    },
    {
      question: "const str = 'hello'; What is str[1]?",
      options: ["'h'", "'e'", "'l'", "'o'"],
      correctAnswer: 1,
      explanation: "Strings can be accessed like arrays. str[1] returns the second character, which is 'e'."
    }
  ];

  // Submit quiz score to backend
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
          quiz_type: 'array_access_challenge'
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

  // Handle game completion and score submission
  const handleGameCompletion = async (finalScore) => {
    if (scoreSubmitted) return; // Prevent duplicate submissions
    
    setSubmissionStatus('loading');
    setSubmissionMessage('Submitting your score...');
    
    try {
      setScoreSubmitted(true);
      
      const result = await submitQuizScore(finalScore);
      
      if (result.success) {
        console.log("Score submitted successfully:", result.data);
        setSubmissionStatus('success');
        setSubmissionMessage(`Great! You earned ${finalScore} points!`);
        
        // Show success message for a few seconds
        setTimeout(() => {
          setSubmissionStatus(null);
          setSubmissionMessage('');
        }, 3000);
      } else {
        console.error("Failed to submit score:", result.error);
        setSubmissionStatus('error');
        setSubmissionMessage(result.error || 'Failed to submit score');
        
        // Reset submission status to allow retry
        setTimeout(() => {
          setScoreSubmitted(false);
          setSubmissionStatus(null);
          setSubmissionMessage('');
        }, 3000);
      }
    } catch (error) {
      console.error("Error in game completion:", error);
      setSubmissionStatus('error');
      setSubmissionMessage('An unexpected error occurred');
      
      // Reset submission status to allow retry
      setTimeout(() => {
        setScoreSubmitted(false);
        setSubmissionStatus(null);
        setSubmissionMessage('');
      }, 3000);
    }
  };

  // Shuffle array function using Fisher-Yates algorithm
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Initialize quiz with shuffled questions when the game starts
  const initializeQuiz = () => {
    // Shuffle all questions first
    const shuffledQuestions = shuffleArray(allQuestions);
    // Take only the first 10 questions from the shuffled array
    setQuizQuestions(shuffledQuestions.slice(0, 10));
    setGameStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setShowHint(false);
    setScoreSubmitted(false);
    setSubmissionStatus(null);
    setSubmissionMessage('');
  };

  const handleAnswer = (selectedIndex) => {
    setSelectedAnswer(selectedIndex);
    
    if (selectedIndex === quizQuestions[currentQuestion].correctAnswer) {
      setScore(score + 10);
    }
  };

  // Function to handle moving to the next question
  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowHint(false);
    } else {
      setShowResult(true);
    }
  };

  // Effect to handle score submission when quiz is completed
  useEffect(() => {
    if (showResult && !scoreSubmitted && quizQuestions.length > 0) {
      handleGameCompletion(score);
    }
  }, [showResult, scoreSubmitted, score, quizQuestions.length]);

  const resetQuiz = () => {
    setGameStarted(false);
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setShowHint(false);
    setScoreSubmitted(false);
    setSubmissionStatus(null);
    setSubmissionMessage('');
  };

  // Generate a random background pattern for the cover
  const getRandomPattern = () => {
    const patterns = [
      'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
      'linear-gradient(135deg, #3b82f6 0%, #10b981 100%)',
      'linear-gradient(135deg, #f43f5e 0%, #f97316 100%)',
      'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)'
    ];
    return patterns[Math.floor(Math.random() * patterns.length)];
  };

  // Render submission status component
  const renderSubmissionStatus = () => {
    if (!submissionStatus) return null;

    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mt-4 p-3 rounded-lg flex items-center ${
          submissionStatus === 'loading' ? 'bg-blue-50 border border-blue-200' :
          submissionStatus === 'success' ? 'bg-green-50 border border-green-200' :
          'bg-red-50 border border-red-200'
        }`}
      >
        {submissionStatus === 'loading' && (
          <FaSpinner className="animate-spin text-blue-500 mr-2" />
        )}
        {submissionStatus === 'success' && (
          <FaCheck className="text-green-500 mr-2" />
        )}
        {submissionStatus === 'error' && (
          <FaTimes className="text-red-500 mr-2" />
        )}
        <span className={`text-sm font-medium ${
          submissionStatus === 'loading' ? 'text-blue-700' :
          submissionStatus === 'success' ? 'text-green-700' :
          'text-red-700'
        }`}>
          {submissionMessage}
        </span>
      </motion.div>
    );
  };

  // If not started yet, show cover page
  if (!gameStarted) {
    return (
      <div className="space-y-4">
        <motion.div 
          className="bg-white rounded-lg shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div 
            className="h-40 flex items-center justify-center p-6"
            style={{ 
              background: getRandomPattern(),
              backgroundSize: "cover"
            }}
          >
            <div className="relative">
              <div className="text-white text-3xl font-bold drop-shadow-lg flex items-center">
                <FaGamepad className="mr-3" /> Array Access Challenge
              </div>
              <div className="absolute -right-10 -top-8 transform rotate-12">
                <div className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  10 Questions
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <FaTrophy className="text-yellow-500 mr-2" />
                <span className="font-medium">Test Your Array Skills!</span>
              </div>
              <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center">
                <FaClock className="mr-1" /> ~5 min
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <p>Challenge yourself with 10 questions about JavaScript array accessing and indexing. Can you get a perfect score?</p>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50 p-3 rounded-md flex items-start">
                  <FaBolt className="text-amber-500 mt-1 mr-2 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-sm">Test Your Knowledge</div>
                    <div className="text-xs text-gray-500">Array indexing and access patterns</div>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-md flex items-start">
                  <FaMedal className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-sm">Earn Points</div>
                    <div className="text-xs text-gray-500">Get points for each correct answer</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-md">
                <div className="font-medium mb-2 flex items-center">
                  <FaLightbulb className="text-yellow-500 mr-2" />
                  Key Concepts Tested:
                </div>
                <div className="flex flex-wrap gap-1">
                  <span className="text-xs bg-white px-2 py-1 rounded border border-blue-100">Zero-based indexing</span>
                  <span className="text-xs bg-white px-2 py-1 rounded border border-blue-100">Array bounds</span>
                  <span className="text-xs bg-white px-2 py-1 rounded border border-blue-100">Nested arrays</span>
                  <span className="text-xs bg-white px-2 py-1 rounded border border-blue-100">Dynamic access</span>
                  <span className="text-xs bg-white px-2 py-1 rounded border border-blue-100">Length property</span>
                </div>
              </div>
            </div>
            
            <motion.button
              onClick={initializeQuiz}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md flex items-center justify-center shadow-md"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <FaPlay className="mr-2" /> Start Challenge
            </motion.button>
            
            <div className="mt-4 text-center text-xs text-gray-500">
              Ready to put your array knowledge to the test?
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // If questions haven't loaded yet, show loading
  if (quizQuestions.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <p className="text-gray-500">Loading challenge...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-lg font-medium text-blue-600">
        Array Access Challenge 🏆
      </p>
      
      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div 
            key="question"
            className="bg-white p-6 rounded-lg shadow-md"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-4">
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                Question {currentQuestion + 1} of {quizQuestions.length}
              </span>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center">
                <FaTrophy className="mr-1" /> Score: {score}
              </span>
            </div>

            <h3 className="text-lg font-medium mb-4">
              {quizQuestions[currentQuestion].question}
            </h3>
            
            <div className="space-y-2">
              {quizQuestions[currentQuestion].options.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={selectedAnswer !== null}
                  className={`w-full text-left p-3 rounded-md transition-colors ${
                    selectedAnswer === null 
                      ? "bg-gray-100 hover:bg-gray-200" 
                      : index === quizQuestions[currentQuestion].correctAnswer
                        ? "bg-green-100 border border-green-500"
                        : selectedAnswer === index
                          ? "bg-red-100 border border-red-500"
                          : "bg-gray-100"
                  }`}
                  whileHover={selectedAnswer === null ? { scale: 1.01, backgroundColor: "#E5E7EB" } : {}}
                  whileTap={selectedAnswer === null ? { scale: 0.99 } : {}}
                >
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-white border border-gray-300 flex items-center justify-center mr-3 text-xs font-medium">
                      {String.fromCharCode(65 + index)}
                    </div>
                    {option}
                  </div>
                </motion.button>
              ))}
            </div>

            {selectedAnswer !== null && (
              <motion.div 
                className={`mt-4 p-3 rounded ${
                  selectedAnswer === quizQuestions[currentQuestion].correctAnswer
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <p className="font-medium">{
                  selectedAnswer === quizQuestions[currentQuestion].correctAnswer
                    ? "Correct! ✅"
                    : "Incorrect ❌"
                }</p>
                <p className="text-sm mt-1">{quizQuestions[currentQuestion].explanation}</p>
              </motion.div>
            )}

            {selectedAnswer !== null && (
              <motion.div 
                className="mt-4 flex justify-end"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <motion.button
                  onClick={handleNextQuestion}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {currentQuestion < quizQuestions.length - 1 ? (
                    <>
                      Next Question <FaArrowRight className="ml-2" />
                    </>
                  ) : (
                    <>
                      Finish Quiz <FaTrophy className="ml-2" />
                    </>
                  )}
                </motion.button>
              </motion.div>
            )}

            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
              >
                <FaLightbulb className="mr-1" /> {showHint ? "Hide Hint" : "Show Hint"}
              </button>
              <div className="text-xs text-gray-500">
                Arrays use zero-based indexing
              </div>
            </div>

            {showHint && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md"
              >
                <p className="text-sm flex">
                  <FaLightbulb className="text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                  <span>Remember that array indices start at 0. Think about what position the element is in, then subtract 1 to get its index.</span>
                </p>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="results"
            className="bg-white p-6 rounded-lg shadow-md text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            >
              <FaTrophy className="text-yellow-500 text-5xl mx-auto mb-4" />
            </motion.div>

            <h3 className="text-xl font-bold mb-2">Challenge Complete!</h3>
            <p className="text-lg mb-4">
              Your score: <span className="font-bold text-blue-600">{score}</span> out of {quizQuestions.length}
            </p>
            
            {/* Submission Status */}
            {renderSubmissionStatus()}
            
            {score === quizQuestions.length ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
                <p className="font-medium text-green-800">Perfect score! You're an array accessing master! 🏅</p>
                <div className="flex justify-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                    >
                      <span className="text-yellow-500 text-xl">★</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : score >= quizQuestions.length * 0.75 ? (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                <p className="font-medium text-blue-800">Excellent job! You have a strong grasp of array indexing! 🌟</p>
                <div className="flex justify-center mt-2">
                  {[...Array(4)].map((_, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                    >
                      <span className="text-blue-500 text-xl">★</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : score >= quizQuestions.length / 2 ? (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                <p className="font-medium text-blue-800">Good job! Keep practicing to become an array expert. 👍</p>
                <div className="flex justify-center mt-2">
                  {[...Array(3)].map((_, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                    >
                      <span className="text-blue-500 text-xl">★</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                <p className="font-medium text-yellow-800">You might want to review array indexing concepts. 📚</p>
                <p className="mt-2 text-sm flex items-start">
                  <FaExclamationTriangle className="text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                  <span>Remember: Array indices start at 0, and accessing beyond the array bounds returns undefined.</span>
                </p>
              </div>
            )}
            
            <div className="mt-6 grid grid-cols-2 gap-3">
              <motion.button 
                onClick={resetQuiz}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors flex items-center justify-center"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <FaPlay className="mr-2" /> Play Again
              </motion.button>
              
              <motion.button 
                onClick={() => {
                  // First reset the game state
                  setGameStarted(false);
                  // Then go back to the cover page
                  setTimeout(() => {
                    setScore(0);
                    setCurrentQuestion(0);
                    setShowResult(false);
                    setSelectedAnswer(null);
                    setShowHint(false);
                  }, 300);
                }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded transition-colors flex items-center justify-center"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Return to Home
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Slide3;
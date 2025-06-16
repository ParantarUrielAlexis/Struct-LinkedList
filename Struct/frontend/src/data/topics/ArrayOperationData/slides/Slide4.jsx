import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaTrophy, FaClock, FaPlay, FaRocket, FaStar, FaAngleRight, FaAngleDoubleRight } from "react-icons/fa";

const Slide4AddingRemovingChallenge = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [userArray, setUserArray] = useState(["🐶", "🐱", "🐭"]);
  const [targetArrays, setTargetArrays] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [moves, setMoves] = useState(0);
  const [success, setSuccess] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const [gameOver, setGameOver] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  
  // All possible target arrays for the challenge
  const allPossibleTargets = [
    ["🐱", "🐭", "🐶"],                     // Rearrange
    ["🐶", "🐰", "🐱", "🐭"],               // Add one in middle
    ["🐰", "🐶", "🐱", "🐭", "🦊"],        // Add two (start and end)
    ["🐼", "🐨", "🐶", "🐱", "🐭"],        // Add two at beginning
    ["🐶", "🐱", "🐭", "🦁", "🐯"],        // Add two at end
    ["🐶", "🐱"],                          // Remove one
    ["🦊", "🐶", "🐱", "🐭", "🐻"],        // Add at both ends
    ["🐰", "🐶", "🐻", "🐱", "🐭"],        // Add in multiple positions
    ["🐼", "🐶", "🐱", "🐭"],              // Add at beginning
    ["🐼", "🐰", "🐶", "🐱", "🐭"],        // Multiple additions
    ["🐱", "🐭"],                          // Remove from beginning
    ["🐶", "🐱"],                          // Remove from end
    ["🐶", "🦊", "🐭"],                    // Replace middle
    ["🦁", "🐱", "🐭", "🐯"],              // Add at both ends, remove one
    ["🐰", "🐼"]                           // Complete transformation
  ];

  // Function to shuffle array
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Initialize game
  const startGame = () => {
    // Shuffle and select 5 target arrays
    const shuffled = shuffleArray([...allPossibleTargets]);
    setTargetArrays(shuffled.slice(0, 5));
    
    // Reset game state
    setUserArray(["🐶", "🐱", "🐭"]);
    setCurrentLevel(0);
    setMoves(0);
    setSuccess(false);
    setScore(0);
    setMessage("");
    setTimeLeft(120);
    setGameOver(false);
    setIsCompleted(false);
    setGameStarted(true);
  };
  
  // Check if arrays match
  useEffect(() => {
    if (!gameStarted || targetArrays.length === 0) return;
    
    const currentTarget = targetArrays[currentLevel];
    if (arraysEqual(userArray, currentTarget)) {
      if (!success) {
        setSuccess(true);
        setScore(score + 50);
        setMessage(`Level ${currentLevel + 1} completed! +50 points`);
        
        // Move to next level after a short delay
        setTimeout(() => {
          if (currentLevel < 4) {
            setCurrentLevel(currentLevel + 1);
            setUserArray(["🐶", "🐱", "🐭"]);
            setSuccess(false);
            setMoves(0);
            setMessage("");
          } else {
            // All levels completed
            setIsCompleted(true);
            setGameOver(true);
          }
        }, 1500);
      }
    } else {
      setSuccess(false);
    }
  }, [userArray, currentLevel, targetArrays, gameStarted]);

  // Timer effect
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameStarted, gameOver]);

  const arraysEqual = (a, b) => {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  };
  
  // Array operations
  const handlePush = (item) => {
    setUserArray([...userArray, item]);
    setMoves(moves + 1);
    setMessage(`push("${item}")`);
  };
  
  const handlePop = () => {
    if (userArray.length === 0) return;
    const newArray = [...userArray];
    newArray.pop();
    setUserArray(newArray);
    setMoves(moves + 1);
    setMessage("pop()");
  };
  
  const handleUnshift = (item) => {
    setUserArray([item, ...userArray]);
    setMoves(moves + 1);
    setMessage(`unshift("${item}")`);
  };
  
  const handleShift = () => {
    if (userArray.length === 0) return;
    const newArray = [...userArray];
    newArray.shift();
    setUserArray(newArray);
    setMoves(moves + 1);
    setMessage("shift()");
  };
  
  const resetLevel = () => {
    setUserArray(["🐶", "🐱", "🐭"]);
    setMoves(0);
    setSuccess(false);
    setMessage("");
  };
  
  // Format time as mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Items for operations
  const operationItems = ["🐰", "🦊", "🐻", "🐼", "🐨", "🦁", "🐯"];

  // If game hasn't started yet, show cover page
  if (!gameStarted) {
    return (
      <motion.div 
        className="p-6 space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition hover:shadow-xl">
          <div className="h-48 bg-gradient-to-r from-purple-500 to-indigo-600 relative">
            <div className="absolute inset-0 opacity-20">
              <div className="w-20 h-20 rounded-full bg-white absolute top-5 left-5 opacity-20"></div>
              <div className="w-16 h-16 rounded-full bg-white absolute bottom-10 right-10 opacity-10"></div>
              <div className="w-24 h-24 rounded-full bg-white absolute top-20 right-20 opacity-10"></div>
            </div>
            <div className="h-full flex items-center justify-center p-6">
              <div className="relative">
                <div className="text-white text-4xl font-bold flex items-center drop-shadow-lg text-center">
                  Array Transformation Challenge
                </div>
                <div className="text-purple-100 mt-2 text-center">
                  Master array operations to match the target patterns!
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <FaRocket className="mr-2 text-purple-500" /> 5 Levels to Conquer
              </h2>
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-1 rounded flex items-center">
                <FaClock className="mr-1" /> 2 minute challenge
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div className="bg-purple-50 p-5 rounded-lg flex flex-col">
                <h3 className="font-bold text-purple-800 mb-3">How to Play</h3>
                <ul className="text-sm space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <FaAngleRight className="mt-0.5 mr-2 text-purple-500 flex-shrink-0" />
                    Transform your starting array to match the target array
                  </li>
                  <li className="flex items-start">
                    <FaAngleRight className="mt-0.5 mr-2 text-purple-500 flex-shrink-0" />
                    Use array methods: push, pop, shift, unshift
                  </li>
                  <li className="flex items-start">
                    <FaAngleRight className="mt-0.5 mr-2 text-purple-500 flex-shrink-0" />
                    Complete 5 levels before time runs out
                  </li>
                  <li className="flex items-start">
                    <FaAngleRight className="mt-0.5 mr-2 text-purple-500 flex-shrink-0" />
                    Each completed array earns 50 points
                  </li>
                </ul>
              </div>
              
              <div className="bg-indigo-50 p-5 rounded-lg">
                <h3 className="font-bold text-indigo-800 mb-3">Available Methods</h3>
                <div className="text-sm space-y-2">
                  <div className="bg-white p-2 rounded">
                    <code className="text-purple-700">push(item)</code>
                    <p className="mt-1 text-gray-600 text-xs">Add an element to the end</p>
                  </div>
                  <div className="bg-white p-2 rounded">
                    <code className="text-purple-700">pop()</code>
                    <p className="mt-1 text-gray-600 text-xs">Remove element from the end</p>
                  </div>
                  <div className="bg-white p-2 rounded">
                    <code className="text-purple-700">unshift(item)</code>
                    <p className="mt-1 text-gray-600 text-xs">Add an element to the beginning</p>
                  </div>
                  <div className="bg-white p-2 rounded">
                    <code className="text-purple-700">shift()</code>
                    <p className="mt-1 text-gray-600 text-xs">Remove element from the beginning</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 mb-6">
              <div className="flex items-center text-yellow-800">
                <FaStar className="text-yellow-500 mr-2" />
                <div>
                  <p className="font-medium">Challenge yourself!</p>
                  <p className="text-sm mt-1">Try to complete all levels with as few moves as possible.</p>
                </div>
              </div>
            </div>
            
            <motion.button
              onClick={startGame}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-md flex items-center justify-center shadow-md"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <FaPlay className="mr-2" /> Start Challenge
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Game over or completed screen
  if (gameOver) {
    return (
      <div className="p-6 space-y-6">
        <motion.div 
          className="bg-white p-6 rounded-lg shadow-lg text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <FaTrophy className={`text-6xl mx-auto mb-4 ${isCompleted ? "text-yellow-500" : "text-purple-400"}`} />
          </motion.div>

          <h2 className="text-2xl font-bold mb-3">{isCompleted ? "Challenge Complete!" : "Time's Up!"}</h2>
          
          <div className="mb-6">
            <p className="text-lg">
              Final Score: <span className="font-bold text-purple-600">{score}</span> points
            </p>
            <p className="text-md">
              Levels Completed: <span className="font-bold text-indigo-600">{Math.min(currentLevel + (isCompleted ? 1 : 0), 5)}</span> out of 5
            </p>
          </div>
          
          {isCompleted ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
              <h4 className="font-bold text-green-800 mb-2">Perfect! 🎉</h4>
              <p className="text-green-700">You've mastered array operations! All target patterns matched successfully.</p>
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
          ) : score > 0 ? (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
              <h4 className="font-bold text-blue-800 mb-2">Good job! 👍</h4>
              <p className="text-blue-700">You completed {currentLevel} level(s) before time ran out.</p>
              <div className="flex justify-center mt-3 space-x-1">
                {[...Array(Math.ceil(currentLevel))].map((_, i) => (
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
              <h4 className="font-bold text-amber-800 mb-2">Keep practicing! 💪</h4>
              <p className="text-amber-700">Array operations take practice. You'll get better!</p>
            </div>
          )}
          
          <button
            onClick={() => setGameStarted(false)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-md mr-3"
          >
            Return to Start
          </button>
          <button
            onClick={startGame}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md"
          >
            Play Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-purple-600">Array Transformation Challenge</h2>
        <div className="flex items-center">
          <div className="flex items-center bg-yellow-100 px-3 py-1 rounded-full mr-3">
            <FaStar className="text-yellow-500 mr-1" />
            <span className="font-bold text-yellow-800">{score}</span>
          </div>
          <div className={`flex items-center px-3 py-1 rounded-full ${
            timeLeft > 30 ? 'bg-green-100 text-green-800' : 
            timeLeft > 10 ? 'bg-yellow-100 text-yellow-800' : 
            'bg-red-100 text-red-800 animate-pulse'
          }`}>
            <FaClock className="mr-1" />
            <span className="font-mono">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <div className="flex justify-between items-center">
          <p className="font-bold text-purple-800 text-lg">Level {currentLevel + 1}/5</p>
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i <= currentLevel ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
            ))}
          </div>
        </div>
        <p className="mt-1 text-gray-700">Transform your array to match the target pattern using array methods.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-xl font-bold text-purple-600 mb-3">Your Array</h3>
          <div className="flex justify-center items-center min-h-[80px] bg-gray-100 rounded-lg p-4 mb-3">
            {userArray.length > 0 ? (
              userArray.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="bg-white border-2 border-gray-300 flex items-center justify-center w-12 h-12 m-1 rounded-lg text-2xl shadow-sm"
                >
                  {item}
                </motion.div>
              ))
            ) : (
              <p className="text-gray-400 italic">Empty array</p>
            )}
          </div>
          
          <div className="mt-4">
            <div className="text-purple-700 font-mono mb-2 flex justify-between items-center">
              <span className="bg-purple-100 px-2 py-1 rounded">Moves: {moves}</span>
              {message && <span className="bg-gray-100 px-2 py-1 rounded text-sm">{message}</span>}
            </div>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-xl font-bold text-purple-600 mb-3">Target Array</h3>
          <div className="flex justify-center items-center min-h-[80px] bg-gray-100 rounded-lg p-4">
            {targetArrays[currentLevel]?.map((item, index) => (
              <motion.div
                key={index}
                className="bg-white border-2 border-gray-300 flex items-center justify-center w-12 h-12 m-1 rounded-lg text-2xl shadow-sm"
              >
                {item}
              </motion.div>
            ))}
          </div>
          
          <div className="mt-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: success ? 1 : 0 }}
              className="bg-green-100 p-2 rounded-lg text-green-800 text-center font-bold"
            >
              {success ? "Success! Arrays match! 🎉" : ""}
            </motion.div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800 p-5 rounded-lg">
        <h3 className="text-xl font-bold text-white mb-4 text-center">Available Operations</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Add elements section with selection */}
          <div className="bg-gray-700 p-3 rounded-lg">
            <h4 className="text-white font-medium mb-3">Add Elements</h4>
            
            {/* Animal selection */}
            <div className="mb-3">
              <p className="text-gray-300 text-sm mb-2">1. Select an animal:</p>
              <div className="grid grid-cols-4 gap-2">
                {operationItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedAnimal(item)}
                    className={`bg-white/10 hover:bg-white/20 rounded-lg p-2 transition-all ${selectedAnimal === item ? 'ring-2 ring-white' : ''}`}
                  >
                    <span className="text-2xl">{item}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Operation buttons */}
            <div>
              <p className="text-gray-300 text-sm mb-2">2. Choose operation:</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    if (selectedAnimal) {
                      handlePush(selectedAnimal);
                      // Optionally clear selection after operation
                      // setSelectedAnimal(null);
                    }
                  }}
                  disabled={!selectedAnimal}
                  className={`bg-green-500 ${selectedAnimal ? 'hover:bg-green-600' : 'opacity-50 cursor-not-allowed'} 
                            text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center`}
                >
                  <span className="mr-2">push</span>
                  {selectedAnimal ? (
                    <span className="bg-white/20 px-2 py-1 rounded text-xl">{selectedAnimal}</span>
                  ) : (
                    <span className="text-xs">(select animal)</span>
                  )}
                </button>
                
                <button
                  onClick={() => {
                    if (selectedAnimal) {
                      handleUnshift(selectedAnimal);
                      // Optionally clear selection after operation
                      // setSelectedAnimal(null); 
                    }
                  }}
                  disabled={!selectedAnimal}
                  className={`bg-blue-500 ${selectedAnimal ? 'hover:bg-blue-600' : 'opacity-50 cursor-not-allowed'} 
                            text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center`}
                >
                  <span className="mr-2">unshift</span>
                  {selectedAnimal ? (
                    <span className="bg-white/20 px-2 py-1 rounded text-xl">{selectedAnimal}</span>
                  ) : (
                    <span className="text-xs">(select animal)</span>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {/* Remove elements section */}
          <div className="bg-gray-700 p-3 rounded-lg">
            <h4 className="text-white font-medium mb-3">Remove Elements</h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handlePop}
                className="bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-medium flex flex-col items-center justify-center"
              >
                <span className="text-lg mb-1">pop()</span>
                <span className="text-xs bg-white/20 px-2 py-1 rounded">Remove from end</span>
              </button>
              <button
                onClick={handleShift}
                className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-medium flex flex-col items-center justify-center"
              >
                <span className="text-lg mb-1">shift()</span>
                <span className="text-xs bg-white/20 px-2 py-1 rounded">Remove from start</span>
              </button>
            </div>
          </div>
        </div>
        
       
        
        {showHint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 bg-gray-700 p-3 rounded-lg text-gray-200"
          >
            <p className="font-mono text-sm">
              Hint: Think about whether elements need to be added or removed, and from which end of the array.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Slide4AddingRemovingChallenge;
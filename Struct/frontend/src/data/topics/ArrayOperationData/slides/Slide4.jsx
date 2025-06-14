import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Slide4AddingRemovingChallenge = () => {
  const [userArray, setUserArray] = useState(["🐶", "🐱", "🐭"]);
  const [targetArray, setTargetArray] = useState(["🐶", "🐰", "🦊", "🐱", "🐭"]);
  const [moves, setMoves] = useState(0);
  const [success, setSuccess] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [message, setMessage] = useState("");
  
  const itemOptions = ["🐶", "🐱", "🐭", "🐰", "🦊", "🐻", "🐼", "🐨", "🦁", "🐯"];
  
  useEffect(() => {
    // Check if arrays match
    if (arraysEqual(userArray, targetArray)) {
      if (!isCompleted) {
        setSuccess(true);
        setIsCompleted(true);
        setMessage(`Challenge completed in ${moves} moves!`);
      }
    } else {
      setSuccess(false);
    }
  }, [userArray, targetArray]);

  const arraysEqual = (a, b) => {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  };
  
  const handlePush = (item) => {
    setUserArray([...userArray, item]);
    setMoves(moves + 1);
    setMessage(`push(${item})`);
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
    setMessage(`unshift(${item})`);
  };
  
  const handleShift = () => {
    if (userArray.length === 0) return;
    const newArray = [...userArray];
    newArray.shift();
    setUserArray(newArray);
    setMoves(moves + 1);
    setMessage("shift()");
  };
  
  const handleSpliceInsert = () => {
    // Insert at index 1
    const newArray = [...userArray];
    newArray.splice(1, 0, "🦊");
    setUserArray(newArray);
    setMoves(moves + 1);
    setMessage("splice(1, 0, '🦊')");
  };
  
  const handleSpliceRemove = () => {
    if (userArray.length <= 1) return;
    // Remove at index 1
    const newArray = [...userArray];
    newArray.splice(1, 1);
    setUserArray(newArray);
    setMoves(moves + 1);
    setMessage("splice(1, 1)");
  };
  
  const resetChallenge = () => {
    setUserArray(["🐶", "🐱", "🐭"]);
    setMoves(0);
    setSuccess(false);
    setIsCompleted(false);
    setMessage("");
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-purple-600">Challenge: Array Manipulation</h2>
      
      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <p className="font-bold text-purple-800 text-lg">Mission: Transform your array to match the target array using array methods!</p>
        <p className="mt-1 text-gray-700">Use the minimum number of operations to match the patterns.</p>
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
            {targetArray.map((item, index) => (
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
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          <button
            onClick={() => handlePush("🐰")}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-bold"
          >
            push("🐰")
          </button>
          <button
            onClick={handlePop}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-bold"
          >
            pop()
          </button>
          <button
            onClick={() => handleUnshift("🐰")}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-bold"
          >
            unshift("🐰")
          </button>
          <button
            onClick={handleShift}
            className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-bold"
          >
            shift()
          </button>
          <button
            onClick={handleSpliceInsert}
            className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg font-bold"
          >
            splice(1, 0, "🦊")
          </button>
          <button
            onClick={handleSpliceRemove}
            className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-lg font-bold"
          >
            splice(1, 1)
          </button>
        </div>
        
        <div className="flex justify-center space-x-4">
          <button
            onClick={resetChallenge}
            className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-6 rounded-lg font-bold"
          >
            Reset Challenge
          </button>
          <button
            onClick={() => setShowHint(!showHint)}
            className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-6 rounded-lg font-bold"
          >
            {showHint ? "Hide Hint" : "Show Hint"}
          </button>
        </div>
        
        {showHint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 bg-gray-700 p-3 rounded-lg text-gray-200"
          >
            <p className="font-mono">Hint: Try inserting "🐰" after 🐶, then inserting "🦊" between them.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Slide4AddingRemovingChallenge;
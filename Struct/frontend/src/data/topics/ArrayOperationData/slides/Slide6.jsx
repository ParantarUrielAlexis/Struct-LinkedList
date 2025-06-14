import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Slide6SearchingChallenge = () => {
  const fruits = ["🍎", "🍌", "🍓", "🍊", "🍏", "🍇", "🥝", "🍒", "🍍", "🥭", "🍑", "🍐"];
  
  const challenges = [
    {
      id: 1,
      title: "Fruit Finder",
      description: "Find if the array includes a strawberry 🍓",
      code: 'fruits.includes("🍓")',
      expected: true
    },
    {
      id: 2,
      title: "Index Explorer",
      description: "Find the index of the banana 🍌",
      code: 'fruits.indexOf("🍌")',
      expected: 1
    },
    {
      id: 3,
      title: "Conditional Seeker",
      description: "Find the first green fruit",
      code: 'fruits.find(fruit => ["🍏", "🥝"].includes(fruit))',
      expected: "🍏"
    },
    {
      id: 4,
      title: "Multiple Hunter",
      description: "Find all indexes of fruits starting with 'p'",
      code: 'fruits.filter((_, i) => fruits[i][0] === "p").map((_, i) => i)',
      expected: "Advanced challenge"
    }
  ];
  
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [result, setResult] = useState(null);
  const [succeeded, setSucceeded] = useState([false, false, false, false]);
  const [showHint, setShowHint] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [hintLevel, setHintLevel] = useState(0);
  
  const methods = [
    { name: "indexOf", desc: "Find the first occurrence index" },
    { name: "lastIndexOf", desc: "Find the last occurrence index" },
    { name: "includes", desc: "Check if an element exists" },
    { name: "find", desc: "Find first element matching a condition" },
    { name: "findIndex", desc: "Find index of first matching element" },
    { name: "filter", desc: "Find all elements matching a condition" },
    { name: "some", desc: "Check if at least one element matches" },
    { name: "every", desc: "Check if all elements match" },
  ];
  
  const checkAnswer = () => {
    let correct = false;
    const challenge = challenges[currentChallenge];
    
    try {
      switch(currentChallenge) {
        case 0: // Fruit Finder
          correct = userAnswer.includes('.includes') && eval(`[${fruits.map(f => `"${f}"`)}]${userAnswer}`);
          break;
        case 1: // Index Explorer
          correct = userAnswer.includes('.indexOf') && eval(`[${fruits.map(f => `"${f}"`)}]${userAnswer}`) === 1;
          break;
        case 2: // Conditional Seeker
          correct = userAnswer.includes('.find') && 
                   eval(`[${fruits.map(f => `"${f}"`)}]${userAnswer}`) === "🍏";
          break;
        case 3: // Multiple Hunter
          // This is more complex - just check for filter usage
          correct = userAnswer.includes('.filter');
          break;
      }
      
      if (correct) {
        setResult({ success: true, message: "Correct! Well done! 🎉" });
        setSucceeded(prev => {
          const newSucceeded = [...prev];
          newSucceeded[currentChallenge] = true;
          return newSucceeded;
        });
      } else {
        setResult({ success: false, message: "Not quite right. Try again!" });
      }
    } catch (e) {
      setResult({ success: false, message: "Error in your code. Check syntax!" });
    }
  };
  
  const goToNextChallenge = () => {
    if (currentChallenge < challenges.length - 1) {
      setCurrentChallenge(currentChallenge + 1);
      setUserAnswer("");
      setResult(null);
      setShowHint(false);
      setHintLevel(0);
    }
  };
  
  const goToPrevChallenge = () => {
    if (currentChallenge > 0) {
      setCurrentChallenge(currentChallenge - 1);
      setUserAnswer("");
      setResult(null);
      setShowHint(false);
      setHintLevel(0);
    }
  };
  
  const applyMethod = () => {
    if (!selectedMethod) return;
    
    let methodCode;
    switch(selectedMethod) {
      case "indexOf":
        methodCode = `.indexOf("🍓")`;
        break;
      case "includes":
        methodCode = `.includes("🍓")`;
        break;
      case "find":
        methodCode = `.find(fruit => fruit === "🍓")`;
        break;
      case "filter":
        methodCode = `.filter(fruit => fruit === "🍓")`;
        break;
      default:
        methodCode = `.${selectedMethod}()`;
    }
    
    setUserAnswer(prev => prev + methodCode);
    setSelectedMethod("");
  };
  
  const increaseHint = () => {
    if (hintLevel < 2) {
      setHintLevel(hintLevel + 1);
    }
  };
  
  const getHint = () => {
    const challenge = challenges[currentChallenge];
    
    switch(hintLevel) {
      case 1:
        switch(currentChallenge) {
          case 0: return "Try using the includes() method to check if an element exists.";
          case 1: return "Use indexOf() to find the position of an element.";
          case 2: return "The find() method can use a callback to test conditions.";
          case 3: return "You'll need filter() to get multiple elements.";
        }
        break;
      case 2:
        return `Structure: fruits${challenge.code.substring(6)}`;
      default:
        return "Click for more specific hints";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-indigo-600">Array Searching Challenge</h2>
      
      <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
        <h3 className="text-lg font-bold text-indigo-700 mb-2">Challenge {currentChallenge + 1}: {challenges[currentChallenge].title}</h3>
        <p className="text-gray-700">{challenges[currentChallenge].description}</p>
      </div>
      
      <div className="bg-gray-800 p-5 rounded-lg text-white">
        <h3 className="text-xl font-bold mb-4">Fruits Array</h3>
        <div className="flex flex-wrap gap-2 mb-4 bg-gray-700 p-3 rounded-lg overflow-auto">
          {fruits.map((fruit, i) => (
            <div key={i} className="flex flex-col items-center">
              <motion.div
                className="bg-gray-600 w-10 h-10 flex items-center justify-center text-lg rounded"
                whileHover={{ scale: 1.2 }}
              >
                {fruit}
              </motion.div>
              <div className="text-xs text-gray-400 mt-1">{i}</div>
            </div>
          ))}
        </div>
        
        <div className="mb-4">
          <label className="block text-sm text-gray-300 mb-1">Your solution:</label>
          <div className="flex items-center">
            <span className="bg-gray-700 px-3 py-2 rounded-l-md border-r border-gray-600">fruits</span>
            <input
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder=".method()"
              className="flex-1 bg-gray-700 px-3 py-2 rounded-r-md text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
            />
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <div>
            <button
              onClick={checkAnswer}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md mr-3"
            >
              Check Answer
            </button>
            <button
              onClick={() => setShowHint(!showHint)}
              className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md"
            >
              {showHint ? "Hide Hint" : "Show Hint"}
            </button>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={goToPrevChallenge}
              disabled={currentChallenge === 0}
              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={goToNextChallenge}
              disabled={currentChallenge === challenges.length - 1}
              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
        
        {showHint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-amber-900/50 p-3 rounded-lg border border-amber-700"
          >
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-amber-300">Hint:</h4>
              <button 
                onClick={increaseHint} 
                className="text-xs bg-amber-700 hover:bg-amber-800 text-white px-2 py-1 rounded"
                disabled={hintLevel >= 2}
              >
                More Help
              </button>
            </div>
            <p className="mt-1 text-amber-100">{getHint()}</p>
          </motion.div>
        )}
        
        {result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mt-4 p-3 rounded-lg ${result.success ? 'bg-green-800/50 border border-green-700' : 'bg-red-800/50 border border-red-700'}`}
          >
            <p className={result.success ? 'text-green-300' : 'text-red-300'}>
              {result.message}
            </p>
          </motion.div>
        )}
      </div>
      
      <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-lg font-bold text-indigo-700 mb-3">Array Search Methods Toolkit</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {methods.map((method) => (
            <motion.button
              key={method.name}
              onClick={() => setSelectedMethod(method.name)}
              className={`p-2 rounded-lg border text-left ${selectedMethod === method.name ? 'bg-indigo-100 border-indigo-300' : 'bg-gray-50 border-gray-200'}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="font-mono text-indigo-700">.{method.name}()</div>
              <div className="text-xs text-gray-600 truncate">{method.desc}</div>
            </motion.button>
          ))}
        </div>
        
        {selectedMethod && (
          <div className="mt-3 flex justify-end">
            <button
              onClick={applyMethod}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 text-sm rounded"
            >
              Apply Method
            </button>
          </div>
        )}
      </div>
      
      <div className="flex justify-center mt-4">
        <div className="flex space-x-2">
          {challenges.map((_, i) => (
            <motion.div
              key={i}
              className={`w-3 h-3 rounded-full ${i === currentChallenge ? 'bg-indigo-600' : succeeded[i] ? 'bg-green-500' : 'bg-gray-300'}`}
              whileHover={{ scale: 1.3 }}
              onClick={() => {
                setCurrentChallenge(i);
                setUserAnswer("");
                setResult(null);
                setShowHint(false);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slide6SearchingChallenge;
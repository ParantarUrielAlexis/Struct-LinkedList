import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Slide8MergingSplittingChallenge = () => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [userSolution, setUserSolution] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [showSolution, setShowSolution] = useState(false);
  const [completed, setCompleted] = useState([]);

  // Reset the user input when changing challenges
  useEffect(() => {
    setUserSolution("");
    setShowHint(false);
    setFeedback(null);
    setShowSolution(false);
  }, [currentChallenge]);

  const challenges = [
    {
      id: 1,
      title: "Merge and Sort",
      description: "Write code to merge the two arrays and sort the result in ascending order.",
      initialCode: "const array1 = [5, 1, 9];\nconst array2 = [3, 7, 2];\n\n// Your solution here",
      testArrays: {
        array1: [5, 1, 9],
        array2: [3, 7, 2]
      },
      hint: "Try using the spread operator to merge the arrays, then use the sort() method.",
      solution: "const result = [...array1, ...array2].sort((a, b) => a - b);",
      expectedOutput: [1, 2, 3, 5, 7, 9],
      verify: (code) => {
        try {
          // Define the arrays in the environment
          const array1 = [5, 1, 9];
          const array2 = [3, 7, 2];
          // Evaluate the user's code
          const result = eval(`(function() { ${code}; return result; })()`);
          // Check if the result is correct
          return JSON.stringify(result) === JSON.stringify([1, 2, 3, 5, 7, 9]);
        } catch (error) {
          return false;
        }
      }
    },
    {
      id: 2,
      title: "Extract Middle Elements",
      description: "Write code to extract the middle three elements from the array.",
      initialCode: "const array = [7, 9, 0, 4, 2, 8, 5];\n\n// Your solution here",
      testArrays: {
        array: [7, 9, 0, 4, 2, 8, 5]
      },
      hint: "Find the middle index of the array, then use slice() to extract elements around it.",
      solution: "const middle = Math.floor(array.length / 2);\nconst result = array.slice(middle - 1, middle + 2);",
      expectedOutput: [0, 4, 2],
      verify: (code) => {
        try {
          const array = [7, 9, 0, 4, 2, 8, 5];
          const result = eval(`(function() { ${code}; return result; })()`);
          return JSON.stringify(result) === JSON.stringify([0, 4, 2]);
        } catch (error) {
          return false;
        }
      }
    },
    {
      id: 3,
      title: "Splice Challenge",
      description: "Use splice() to remove the 3rd and 4th elements and replace them with 'apple' and 'banana'.",
      initialCode: "const array = ['dog', 'cat', 'fish', 'bird', 'turtle'];\n\n// Your solution here",
      testArrays: {
        array: ['dog', 'cat', 'fish', 'bird', 'turtle']
      },
      hint: "Use array.splice(startIndex, deleteCount, ...items) where startIndex is 2 (for the 3rd element).",
      solution: "const removed = array.splice(2, 2, 'apple', 'banana');\nconst result = array;",
      expectedOutput: ['dog', 'cat', 'apple', 'banana', 'turtle'],
      verify: (code) => {
        try {
          const array = ['dog', 'cat', 'fish', 'bird', 'turtle'];
          eval(code);
          return JSON.stringify(array) === JSON.stringify(['dog', 'cat', 'apple', 'banana', 'turtle']);
        } catch (error) {
          return false;
        }
      }
    },
    {
      id: 4,
      title: "Advanced Merging Challenge",
      description: "Merge three arrays but avoid duplicates in the result.",
      initialCode: "const nums1 = [1, 3, 5];\nconst nums2 = [2, 3, 6];\nconst nums3 = [1, 5, 7];\n\n// Your solution here",
      testArrays: {
        nums1: [1, 3, 5],
        nums2: [2, 3, 6],
        nums3: [1, 5, 7]
      },
      hint: "You can use Set to automatically remove duplicates after merging with the spread operator.",
      solution: "const result = [...new Set([...nums1, ...nums2, ...nums3])];",
      expectedOutput: [1, 3, 5, 2, 6, 7],
      verify: (code) => {
        try {
          const nums1 = [1, 3, 5];
          const nums2 = [2, 3, 6];
          const nums3 = [1, 5, 7];
          const result = eval(`(function() { ${code}; return result; })()`);
          // Check if all expected elements are in the result with no duplicates
          const expected = [1, 2, 3, 5, 6, 7];
          return result.length === expected.length && 
                 expected.every(val => result.includes(val)) &&
                 new Set(result).size === result.length;
        } catch (error) {
          return false;
        }
      }
    }
  ];

  const current = challenges[currentChallenge];

  const handleVerify = () => {
    const isCorrect = current.verify(userSolution);
    
    if (isCorrect) {
      setFeedback({ 
        status: "success", 
        message: "Great job! Your solution works correctly!" 
      });
      if (!completed.includes(current.id)) {
        setCompleted([...completed, current.id]);
      }
    } else {
      setFeedback({ 
        status: "error", 
        message: "Your solution doesn't produce the expected output. Try again!" 
      });
    }
  };

  const handleNext = () => {
    setCurrentChallenge((prev) => (prev + 1) % challenges.length);
  };

  const handlePrevious = () => {
    setCurrentChallenge((prev) => (prev - 1 + challenges.length) % challenges.length);
  };

  const renderArrayPreview = (arrays) => {
    return (
      <div className="space-y-2 mt-2">
        {Object.entries(arrays).map(([name, array]) => (
          <div key={name} className="flex items-center">
            <span className="font-mono text-sm mr-2">{name}:</span>
            <div className="flex flex-wrap gap-1">
              {array.map((item, i) => (
                <motion.div
                  key={`${name}-${i}`}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-blue-100 px-2 py-1 rounded text-blue-800 text-sm font-mono"
                >
                  {JSON.stringify(item)}
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white to-blue-50 rounded-lg">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-800">
          Array Challenge: <span className="text-blue-600">{current.title}</span>
        </h2>
        <div className="flex items-center gap-2">
          {challenges.map((challenge, idx) => (
            <button
              key={challenge.id}
              onClick={() => setCurrentChallenge(idx)}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium 
                ${currentChallenge === idx 
                  ? "bg-blue-600 text-white" 
                  : completed.includes(challenge.id) 
                    ? "bg-green-100 text-green-800 border border-green-300" 
                    : "bg-gray-200 text-gray-700"}`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 bg-white rounded-lg shadow border border-gray-200">
        <h3 className="font-bold text-gray-700 mb-2">Challenge Description:</h3>
        <p className="text-gray-600">{current.description}</p>
        
        {renderArrayPreview(current.testArrays)}
        
        <div className="mt-3">
          <h4 className="font-semibold text-gray-700">Expected Output:</h4>
          <div className="bg-gray-50 p-2 rounded mt-1">
            <code className="text-blue-800 font-mono">
              {JSON.stringify(current.expectedOutput)}
            </code>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="flex justify-between items-center p-3 border-b">
          <h3 className="font-bold text-gray-700">Your Solution:</h3>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowHint(!showHint)}
              className="text-sm px-3 py-1 rounded bg-yellow-100 hover:bg-yellow-200 text-yellow-800 transition-colors"
            >
              {showHint ? "Hide Hint" : "Show Hint"}
            </button>
            <button 
              onClick={() => setShowSolution(!showSolution)}
              className="text-sm px-3 py-1 rounded bg-purple-100 hover:bg-purple-200 text-purple-800 transition-colors"
            >
              {showSolution ? "Hide Solution" : "Show Solution"}
            </button>
          </div>
        </div>
        
        <AnimatePresence>
          {showHint && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-yellow-50 p-3 border-b border-yellow-100"
            >
              <p className="text-yellow-800">
                <span className="font-semibold">Hint:</span> {current.hint}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        
        <textarea
          className="w-full p-4 font-mono text-sm h-40 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
          value={userSolution || current.initialCode}
          onChange={(e) => setUserSolution(e.target.value)}
        ></textarea>
        
        <AnimatePresence>
          {showSolution && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-purple-50 p-4 border-t border-purple-100"
            >
              <h4 className="font-semibold text-purple-800 mb-1">Solution:</h4>
              <pre className="bg-white p-3 rounded border border-purple-200 overflow-x-auto">
                <code className="text-purple-900 font-mono text-sm">{current.solution}</code>
              </pre>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <AnimatePresence>
        {feedback && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`p-4 rounded-lg ${
              feedback.status === "success" 
                ? "bg-green-100 border border-green-300 text-green-800" 
                : "bg-red-100 border border-red-300 text-red-800"
            }`}
          >
            <div className="flex items-start">
              <div className={`rounded-full p-1 mr-3 ${
                feedback.status === "success" ? "bg-green-200" : "bg-red-200"
              }`}>
                {feedback.status === "success" ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                )}
              </div>
              <p>{feedback.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between pt-4">
        <button
          onClick={handlePrevious}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors flex items-center"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Previous
        </button>
        
        <button
          onClick={handleVerify}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm transition-colors"
        >
          Check Solution
        </button>
        
        <button
          onClick={handleNext}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors flex items-center"
        >
          Next
          <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
      
      <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-4">
        <h3 className="font-bold text-blue-800 mb-2 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
          </svg>
          Progress
        </h3>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${(completed.length / challenges.length) * 100}%` }}
          ></div>
        </div>
        <p className="text-sm text-blue-800 mt-2">
          {completed.length} of {challenges.length} challenges completed
          {completed.length === challenges.length && " - Great job!"}
        </p>
      </div>
    </div>
  );
};

export default Slide8MergingSplittingChallenge;
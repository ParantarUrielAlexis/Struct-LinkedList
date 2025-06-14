import React, { useState, useEffect, useRef } from "react";
import { FaCheck, FaTimes, FaTrophy, FaCode, FaKeyboard, FaRandom } from "react-icons/fa";

const Slide6 = () => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [completedChallenges, setCompletedChallenges] = useState(0);
  const [points, setPoints] = useState(0);
  const [challengeOrder, setChallengeOrder] = useState([]);
  const inputRef = useRef(null);

  // Focused question pool strictly on array declaration and iteration (20 questions)
  const allChallenges = [
    // ARRAY DECLARATION (10 questions)
    {
      title: "Empty Array Declaration",
      description: "Create an empty array named 'data' using array literal syntax",
      expectedOutput: "const data = [];",
      hint: "Use square brackets for an empty array literal"
    },
    {
      title: "String Array Declaration",
      description: "Create an array named 'fruits' containing: 'apple', 'banana', 'orange'",
      expectedOutput: "const fruits = ['apple', 'banana', 'orange'];",
      hint: "Use string literals inside square brackets, separated by commas"
    },
    {
      title: "Number Array Declaration",
      description: "Create an array named 'ages' with values: 18, 21, 25, 30",
      expectedOutput: "const ages = [18, 21, 25, 30];",
      hint: "Numbers don't need quotes in array declarations"
    },
    
    {
      title: "2D Array Declaration",
      description: "Create a 2×2 array named 'grid' with values [[1,2],[3,4]]",
      expectedOutput: "const grid = [[1, 2], [3, 4]];",
      hint: "Use nested arrays inside the outer array"
    },

    // ARRAY ITERATION (10 questions)
    {
      title: "Basic For Loop",
      description: "Write a for loop that iterates through an array named 'items'",
      expectedOutput: "for (let i = 0; i < items.length; i++) {",
      hint: "Use the classic for loop with index starting at 0"
    },
    {
      title: "For Loop Element Access",
      description: "Inside a for loop, write the code to access the current element",
      expectedOutput: "items[i]",
      hint: "Use square bracket notation with the index variable"
    },
    {
      title: "Complete For Loop",
      description: "Write a complete for loop to log each element in the 'names' array",
      expectedOutput: "for (let i = 0; i < names.length; i++)",
      hint: "Combine the loop with array access and console.log"
    },
    {
      title: "Complete forEach Method",
      description: "Write a complete forEach to log each 'item' in 'items' array",
      expectedOutput: "items.forEach(item => { console.log(item); });",
      hint: "Provide a complete arrow function to forEach"
    },
    {
      title: "For Loop Reverse Iteration",
      description: "Write a for loop that iterates through 'data' array in reverse order",
      expectedOutput: "for (let i = data.length - 1; i >= 0; i--) {",
      hint: "Start from last index and decrement to 0"
    },
    {
      title: "Array Indices for Loop",
      description: "Write a loop to iterate through the indices of array 'list'",
      expectedOutput: "for (let i = 0; i < list.length; i++) {",
      hint: "Standard for loop structure with array length check"
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

  // Function to select 5 random challenges
  const selectRandomChallenges = () => {
    const shuffled = shuffleArray([...Array(allChallenges.length).keys()]);
    return shuffled.slice(0, 5);
  };

  // Initialize game with shuffled challenge indices
  useEffect(() => {
    setChallengeOrder(selectRandomChallenges());
  }, []);

  // Start challenge
  const startChallenge = () => {
    setUserInput("");
    setIsCorrect(null);
    if (inputRef.current) inputRef.current.focus();
  };

  // Check if user input matches expected output
  const checkAnswer = () => {
    // Normalize inputs for comparison (remove extra whitespace)
    const normalizedUserInput = userInput.trim().replace(/\s+/g, ' ');
    const normalizedExpected = allChallenges[challengeOrder[currentChallenge]].expectedOutput.trim().replace(/\s+/g, ' ');
    
    const correct = normalizedUserInput === normalizedExpected;
    setIsCorrect(correct);
    
    if (correct) {
      setCompletedChallenges(completedChallenges + 1);
      // Award 10 points for correct answer
      setPoints(points + 40);
    }
  };

  // Move to next challenge
  const nextChallenge = () => {
    if (currentChallenge < challengeOrder.length - 1) {
      setCurrentChallenge(currentChallenge + 1);
      setUserInput("");
      setIsCorrect(null);
      if (inputRef.current) inputRef.current.focus();
    } else {
      setShowResult(true);
    }
  };

  // Restart the game with newly shuffled challenges
  const restartGame = () => {
    const indices = Array.from({ length: challenges.length }, (_, i) => i);
    setChallengeOrder(shuffleArray(indices));
    setCurrentChallenge(0);
    setUserInput("");
    setIsCorrect(null);
    setShowResult(false);
    setCompletedChallenges(0);
    setPoints(0);
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 100);
  };

  // Handle keyboard input
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      checkAnswer();
    }
  };

  // Initial start
  useEffect(() => {
    if (challengeOrder.length > 0) {
      startChallenge();
    }
  }, [challengeOrder]);

  // Wait for challenge order to be initialized
  if (challengeOrder.length === 0) {
    return <div>Loading challenges...</div>;
  }

  // Get current challenge
  const currentChallengeData = allChallenges[challengeOrder[currentChallenge]];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-blue-700 flex items-center">
          <FaCode className="mr-2" /> Array Typing Challenge
        </h2>
      </div>

      {!showResult ? (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="mb-4">
            <div className="flex justify-between items-center">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                Challenge {currentChallenge + 1}/{challengeOrder.length}
              </span>
              <div className="flex space-x-3">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                  Completed: {completedChallenges}
                </span>
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-medium">
                  Points: {points}
                </span>
              </div>
            </div>
            <h3 className="text-lg font-bold mt-3">{currentChallengeData.title}</h3>
            <p className="text-gray-700 mt-1">{currentChallengeData.description}</p>
          </div>

          <div className="mt-4">
            <div className="flex items-center mb-2">
              <FaKeyboard className="mr-2 text-gray-600" />
              <label className="font-medium text-gray-700">Type your code:</label>
            </div>
            <textarea
              ref={inputRef}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full p-3 border border-gray-300 rounded-md font-mono text-sm h-24 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Write your JavaScript code here... (Ctrl+Enter to check)"
            />
          </div>

          {isCorrect !== null && (
            <div className={`mt-4 p-3 rounded-md ${isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
              {isCorrect ? (
                <div className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2" />
                  <div>
                    <p className="font-medium text-green-800">Correct!</p>
                    <p className="text-sm mt-1">{currentChallengeData.success}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start">
                  <FaTimes className="text-red-500 mt-1 mr-2" />
                  <div>
                    <p className="font-medium text-red-800">Not quite right</p>
                    <p className="text-sm mt-1">Expected: <code className="bg-gray-100 px-1 py-0.5 rounded">{currentChallengeData.expectedOutput}</code></p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm bg-yellow-50 p-2 rounded-md border border-yellow-200 text-yellow-800 max-w-xs">
              <span className="font-medium">Hint:</span> {currentChallengeData.hint}
            </div>
            
            {isCorrect === null ? (
              <button
                onClick={checkAnswer}
                disabled={userInput.trim() === ""}
                className={`px-3 py-1.5 rounded-md ${
                  userInput.trim() === "" 
                    ? "bg-gray-300 cursor-not-allowed" 
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                Check
              </button>
            ) : (
              <button
                onClick={nextChallenge}
                className={`px-3 py-1.5 text-white rounded-md ${
                  isCorrect 
                    ? "bg-green-600 hover:bg-green-700" 
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {currentChallenge < challengeOrder.length - 1 ? "Next Challenge" : "See Results"}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <FaTrophy className="text-yellow-500 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Challenge Complete!</h3>
          <p className="text-lg mb-2">
            You completed <span className="font-bold text-blue-600">{completedChallenges}</span> out of {challenges.length} challenges.
          </p>
          <p className="text-lg mb-6">
            Total points: <span className="font-bold text-yellow-600">{points}</span>
          </p>

          {completedChallenges === challenges.length ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
              <p className="font-medium text-green-800">Perfect score! You've mastered array operations! 🏅</p>
            </div>
          ) : completedChallenges >= challenges.length / 2 ? (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
              <p className="font-medium text-blue-800">Good job! You're on your way to becoming an array expert! 👍</p>
            </div>
          ) : (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-6">
              <p className="font-medium text-yellow-800">Keep practicing! Arrays will become easier with practice. 💪</p>
            </div>
          )}

          <button
            onClick={restartGame}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium"
          >
            Try Again
          </button>
        </div>
      )}

      <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium mb-2">Array Operations Quick Reference</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="bg-white p-2 rounded border border-gray-100">
            <code className="text-purple-700">const arr = [1, 2, 3];</code>
            <p className="mt-1 text-gray-700">Basic array creation</p>
          </div>
          <div className="bg-white p-2 rounded border border-gray-100">
            <code className="text-purple-700">arr.map(x =&gt; x * 2)</code>
            <p className="mt-1 text-gray-700">Transform each element</p>
          </div>
          <div className="bg-white p-2 rounded border border-gray-100">
            <code className="text-purple-700">arr.filter(x =&gt; x &gt; 1)</code>
            <p className="mt-1 text-gray-700">Keep elements that pass a test</p>
          </div>
          <div className="bg-white p-2 rounded border border-gray-100">
            <code className="text-purple-700">arr.reduce((sum, x) =&gt; sum + x, 0)</code>
            <p className="mt-1 text-gray-700">Accumulate values</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slide6;
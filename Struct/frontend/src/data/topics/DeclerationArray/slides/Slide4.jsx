import React, { useState } from "react";
import { FaGamepad, FaStar, FaRegStar, FaCheckCircle } from "react-icons/fa";

const Slide4 = () => {
  const [showArrayGame, setShowArrayGame] = useState(false);
  const [gameArray, setGameArray] = useState([
    { emoji: "🍎", name: "Apple" },
    { emoji: "🍌", name: "Banana" },
    { emoji: "🍊", name: "Orange" },
    { emoji: "🍇", name: "Grapes" },
    { emoji: "🍓", name: "Strawberry" }
  ]);
  const [correctOrder, setCorrectOrder] = useState([]);
  const [userSelections, setUserSelections] = useState([]);
  const [gameComplete, setGameComplete] = useState(false);
  const [score, setScore] = useState(0);

  // Update the game start function to sort based on fruit names
  const startGame = () => {
    const shuffled = [...gameArray].sort(() => Math.random() - 0.5);
    setGameArray(shuffled);
    // Sort alphabetically by fruit name
    setCorrectOrder([...shuffled].sort((a, b) => a.name.localeCompare(b.name))); 
    setUserSelections([]);
    setGameComplete(false);
    setShowArrayGame(true);
    setScore(0);
  };

  const selectItem = (item, index) => {
    if (userSelections.includes(index)) return;
    
    const newSelections = [...userSelections, index];
    setUserSelections(newSelections);
    
    if (gameArray[index] === correctOrder[userSelections.length]) {
      setScore(score + 1);
    }
    
    if (newSelections.length === gameArray.length) {
      setGameComplete(true);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-lg font-medium text-blue-600">
        Array Creation Methods 🛠️
      </p>
      
      <p>
        There are multiple ways to create arrays in JavaScript. Let's explore some creative methods beyond 
        the basic literal and constructor approaches.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 shadow-md">
          <h3 className="font-medium mb-2">Array.from()</h3>
          <p className="text-sm mb-2">
            Creates a new array from an array-like or iterable object.
          </p>
          <div className="bg-gray-800 text-white p-3 rounded-lg font-mono text-sm shadow-inner">
            <p className="text-yellow-400">// From a string</p>
            <p className="text-green-400">const chars = Array.from("hello");</p>
            <p className="text-blue-400">// ["h", "e", "l", "l", "o"]</p>
            <p></p>
            <p className="text-yellow-400">// With mapping function</p>
            <p className="text-green-400">const squares = Array.from([1, 2, 3], x =&gt; x * x);</p>
            <p className="text-blue-400">// [1, 4, 9]</p>
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg border border-green-200 shadow-md">
          <h3 className="font-medium mb-2">Array.of()</h3>
          <p className="text-sm mb-2">
            Creates a new array from the provided arguments, regardless of type or number.
          </p>
          <div className="bg-gray-800 text-white p-3 rounded-lg font-mono text-sm shadow-inner">
            <p className="text-yellow-400">// Mixed types</p>
            <p className="text-green-400">const mixed = Array.of(1, "two", true, {'{four: 4}' });</p>
            <p className="text-blue-400">// [1, "two", true, {'{four: 4}' }]</p>
            <p></p>
            <p className="text-yellow-400">// Single number (won't create empty slots!)</p>
            <p className="text-green-400">const singleNum = Array.of(5);</p>
            <p className="text-blue-400">// [5] (not [empty × 5])</p>
          </div>
        </div>
      </div>

      <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200 shadow-md">
        <h3 className="font-medium mb-2">Spread Operator</h3>
        <p className="text-sm mb-2">
          The spread (...) operator can create arrays by expanding an iterable into individual elements.
        </p>
        <div className="bg-gray-800 text-white p-3 rounded-lg font-mono text-sm shadow-inner">
          <p className="text-yellow-400">// Create from other arrays</p>
          <p className="text-green-400">const original = [1, 2, 3];</p>
          <p className="text-green-400">const copy = [...original];</p>
          <p></p>
          <p className="text-yellow-400">// Combine arrays</p>
          <p className="text-green-400">const combined = [...[1, 2], ...[3, 4], 5];</p>
          <p className="text-blue-400">// [1, 2, 3, 4, 5]</p>
          <p></p>
          <p className="text-yellow-400">// From iterables</p>
          <p className="text-green-400">const letters = [..."hello"];</p>
          <p className="text-blue-400">// ["h", "e", "l", "l", "o"]</p>
        </div>
      </div>
      
      
    </div>
  );
};

export default Slide4;
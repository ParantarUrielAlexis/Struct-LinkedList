import React, { useState } from "react";
import { FaCode, FaLightbulb, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const Slide2 = () => {
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [feedback, setFeedback] = useState("");

  const checkAnswer = (option) => {
    setQuizAnswer(option);
    if (option === 2) {
      setFeedback("+20 points. Correct! Square brackets [] create an array literal in JavaScript.");
    } else {
      setFeedback("Not quite! The square brackets [] notation is the most common way to create array literals.");
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-lg font-medium text-blue-600">
        Array Literal Notation 📝
      </p>
      
      <p>
        The most common and straightforward way to create arrays in JavaScript is using <strong>array literal notation</strong> with square brackets.
      </p>
      
      <div className="bg-blue-50 p-5 rounded-lg border border-blue-200 shadow-md">
        <h3 className="font-medium mb-3 text-blue-700">Creating Arrays with Literals</h3>
        <div className="bg-gray-800 text-white p-4 rounded-lg font-mono text-sm shadow-inner">
          <p className="text-yellow-400">// Empty array</p>
          <p className="text-green-400">const emptyArray = [];</p>
          <p></p>
          <p className="text-yellow-400">// Array of numbers</p>
          <p className="text-green-400">const scores = [95, 87, 76, 92];</p>
          <p></p>
          <p className="text-yellow-400">// Array of strings</p>
          <p className="text-green-400">const fruits = ["apple", "banana", "orange"];</p>
          <p></p>
          <p className="text-yellow-400">// Mixed types (numbers, strings, booleans)</p>
          <p className="text-green-400">const mixed = [42, "hello", true, null];</p>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-5 rounded-lg border border-indigo-200 shadow-md mt-4">
        <h3 className="font-medium mb-3 flex items-center">
          <FaLightbulb className="text-yellow-500 mr-2" />
          Try It Yourself!
        </h3>
        
        <p className="mb-3 text-sm">Which of the following creates a valid array of colors in JavaScript?</p>
        
        <div className="space-y-2">
          <button 
            onClick={() => checkAnswer(1)}
            className={`w-full text-left p-3 rounded-md border ${
              quizAnswer === 1 
                ? "bg-red-100 border-red-300" 
                : "bg-white hover:bg-gray-50 border-gray-200"
            } transition`}
          >
            <code>const colors = array("red", "green", "blue");</code>
            {quizAnswer === 1 && <FaTimesCircle className="inline ml-2 text-red-500" />}
          </button>
          
          <button 
            onClick={() => checkAnswer(2)}
            className={`w-full text-left p-3 rounded-md border ${
              quizAnswer === 2 
                ? "bg-green-100 border-green-300" 
                : "bg-white hover:bg-gray-50 border-gray-200"
            } transition`}
          >
            <code>const colors = ["red", "green", "blue"];</code>
            {quizAnswer === 2 && <FaCheckCircle className="inline ml-2 text-green-500" />}
          </button>
          
          <button 
            onClick={() => checkAnswer(3)}
            className={`w-full text-left p-3 rounded-md border ${
              quizAnswer === 3 
                ? "bg-red-100 border-red-300" 
                : "bg-white hover:bg-gray-50 border-gray-200"
            } transition`}
          >
            <code>{'const colors = {"red", "green", "blue"};'}</code>
            {quizAnswer === 3 && <FaTimesCircle className="inline ml-2 text-red-500" />}
          </button>
        </div>
        
        {feedback && (
          <div className={`mt-3 p-3 rounded-md ${quizAnswer === 2 ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
            {feedback}
          </div>
        )}
      </div>
    </div>
  );
};

export default Slide2;
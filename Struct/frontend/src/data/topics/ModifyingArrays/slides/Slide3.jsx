import React, { useState, useEffect } from "react";
import { FaTrophy, FaLightbulb, FaExclamationTriangle } from "react-icons/fa";

const Slide3 = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);

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

  // Shuffle array function using Fisher-Yates algorithm
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Initialize quiz with shuffled questions
  useEffect(() => {
    // Shuffle all 20 questions first
    const shuffledQuestions = shuffleArray(allQuestions);
    // Take only the first 10 questions from the shuffled array
    setQuizQuestions(shuffledQuestions.slice(0, 10));
  }, []);

  const handleAnswer = (selectedIndex) => {
    setSelectedAnswer(selectedIndex);
    
    if (selectedIndex === quizQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  // Add a new function to handle moving to the next question
  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowHint(false);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    // Shuffle questions again when resetting
    setQuizQuestions(shuffleArray(allQuestions));
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setShowHint(false);
  };

  // If questions haven't loaded yet, show loading
  if (quizQuestions.length === 0) {
    return <div>Loading quiz...</div>;
  }

  return (
    <div className="space-y-4">
      <p className="text-lg font-medium text-blue-600">
        Array Access Challenge 🏆
      </p>
      
      {!showResult ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
              Question {currentQuestion + 1} of {quizQuestions.length}
            </span>
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
              Score: {score}
            </span>
          </div>

          <h3 className="text-lg font-medium mb-4">
            {quizQuestions[currentQuestion].question}
          </h3>
          
          <div className="space-y-2">
            {quizQuestions[currentQuestion].options.map((option, index) => (
              <button
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
              >
                {option}
              </button>
            ))}
          </div>

          {selectedAnswer !== null && (
            <div className={`mt-4 p-3 rounded ${
              selectedAnswer === quizQuestions[currentQuestion].correctAnswer
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}>
              <p className="font-medium">{
                selectedAnswer === quizQuestions[currentQuestion].correctAnswer
                  ? "Correct! ✅"
                  : "Incorrect ❌"
              }</p>
              <p className="text-sm mt-1">{quizQuestions[currentQuestion].explanation}</p>
            </div>
          )}

          {/* Add this button below the explanation when an answer is selected */}
          {selectedAnswer !== null && (
            <div className="mt-4 flex justify-end">
              <button 
                onClick={handleNextQuestion}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
              >
                {currentQuestion < quizQuestions.length - 1 ? "Next Question" : "See Results"}
              </button>
            </div>
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
            <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm flex">
                <FaLightbulb className="text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                <span>Remember that array indices start at 0. Think about what position the element is in, then subtract 1 to get its index.</span>
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <FaTrophy className="text-yellow-500 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Quiz Complete!</h3>
          <p className="text-lg mb-4">
            Your score: <span className="font-bold text-blue-600">{score}</span> out of {quizQuestions.length}
          </p>
          
          {score === quizQuestions.length ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
              <p className="font-medium text-green-800">Perfect score! You're an array accessing master! 🏅</p>
            </div>
          ) : score >= quizQuestions.length * 0.75 ? (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
              <p className="font-medium text-blue-800">Excellent job! You have a strong grasp of array indexing! 🌟</p>
            </div>
          ) : score >= quizQuestions.length / 2 ? (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
              <p className="font-medium text-blue-800">Good job! Keep practicing to become an array expert. 👍</p>
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
          
          <div className="mt-6 space-x-3">
            <button 
              onClick={resetQuiz}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      
    </div>
  );
};

export default Slide3;
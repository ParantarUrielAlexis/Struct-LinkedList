// Array Methods Educational Component with Interactive Game
import React, { useState, useEffect } from "react";
import axios from 'axios';

const Slide3 = () => {
  // State management for interactive examples
  const [activeMethod, setActiveMethod] = useState("map");
  const [mapInput, setMapInput] = useState([1, 2, 3, 4, 5]);
  const [mapCode, setMapCode] = useState("num => num * 2");
  const [mapResult, setMapResult] = useState([]);
  const [filterInput, setFilterInput] = useState([1, 2, 3, 4, 5, 6, 7, 8]);
  const [filterCode, setFilterCode] = useState("num => num % 2 === 0");
  const [filterResult, setFilterResult] = useState([]);
  const [reduceInput, setReduceInput] = useState([1, 2, 3, 4, 5]);
  const [reduceCode, setReduceCode] = useState("(sum, num) => sum + num");
  const [reduceInitial, setReduceInitial] = useState("0");
  const [reduceResult, setReduceResult] = useState(null);
  const [chainInput, setChainInput] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const [chainResult, setChainResult] = useState(null);
  const [error, setError] = useState("");
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
 
    
  // Game state management
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(10);
  const [gameEnded, setGameEnded] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [timerActive, setTimerActive] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [currentQuestions, setCurrentQuestions] = useState([]);
  
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
        quiz_type: 'array_methods' // Optional: specify quiz type
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

  // Full set of 20 questions
  const allQuestions = [
    {
      text: "Convert an array of temperatures from Celsius to Fahrenheit",
      correctAnswer: "map()",
      userAnswer: null
    },
    {
      text: "Find all products that are in stock (stock > 0)",
      correctAnswer: "filter()",
      userAnswer: null
    },
    {
      text: "Calculate the total revenue from an array of order objects",
      correctAnswer: "reduce()",
      userAnswer: null
    },
    {
      text: "Extract names from an array of user objects",
      correctAnswer: "map()",
      userAnswer: null
    },
    {
      text: "Create a lookup object from an array of items",
      correctAnswer: "reduce()",
      userAnswer: null
    },
    {
      text: "Keep only numbers > 10 from an array",
      correctAnswer: "filter()",
      userAnswer: null
    },
    {
      text: "Calculate average age from an array of users",
      correctAnswer: "reduce()",
      userAnswer: null
    },
    {
      text: "Format dates to MM/DD/YYYY from ISO strings",
      correctAnswer: "map()",
      userAnswer: null
    },
    {
      text: "Find the most expensive product in an array",
      correctAnswer: "reduce()",
      userAnswer: null
    },
    {
      text: "Get only active users from a user array",
      correctAnswer: "filter()",
      userAnswer: null
    },
    {
      text: "Double each number in an array",
      correctAnswer: "map()",
      userAnswer: null
    },
    {
      text: "Sum up all values in a shopping cart",
      correctAnswer: "reduce()",
      userAnswer: null
    },
    {
      text: "Find users who are admins",
      correctAnswer: "filter()",
      userAnswer: null
    },
    {
      text: "Convert array of objects to array of IDs",
      correctAnswer: "map()",
      userAnswer: null
    },
    {
      text: "Group an array of objects by a property",
      correctAnswer: "reduce()",
      userAnswer: null
    },
    {
      text: "Find all links that are external (start with http)",
      correctAnswer: "filter()",
      userAnswer: null
    },
    {
      text: "Calculate the maximum value in an array",
      correctAnswer: "reduce()",
      userAnswer: null
    },
    {
      text: "Add a property to each object in an array",
      correctAnswer: "map()",
      userAnswer: null
    },
    {
      text: "Remove null or undefined values from an array",
      correctAnswer: "filter()",
      userAnswer: null
    },
    {
      text: "Flatten an array of arrays into a single array",
      correctAnswer: "reduce()",
      userAnswer: null
    }
  ];

  // Fisher-Yates shuffle algorithm
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Timer effect
  useEffect(() => {
    let interval;
    
    if (gameStarted && timerActive && !gameEnded && !showCorrectAnswer) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            // Time's up for this question
            handleTimeUp();
            return 10;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [gameStarted, timerActive, gameEnded, showCorrectAnswer]);

  // Effect for showing correct answer for 3 seconds
  useEffect(() => {
    let timeout;
    
    if (showCorrectAnswer) {
      timeout = setTimeout(() => {
        setShowCorrectAnswer(false);
        moveToNextQuestion();
      }, 3000);
    }
    
    return () => clearTimeout(timeout);
  }, [showCorrectAnswer]);

  // Start game
  const startGame = () => {
    // Select 10 random questions from the pool of 20
    const shuffled = shuffleArray(allQuestions);
    const selected = shuffled.slice(0, 10);
    
    setCurrentQuestions(selected);
    setGameStarted(true);
    setTimerActive(true);
    setCurrentQuestion(0);
    setScore(0);
    setUserAnswers([]);
    setTimer(10);
    setGameEnded(false);
    setShowCorrectAnswer(false);
  };

  // Handle time up (no answer selected)
  const handleTimeUp = () => {
    setTimerActive(false);
    
    // Record no answer
    const currentQ = currentQuestions[currentQuestion];
    
    setUserAnswers([...userAnswers, {
      question: currentQ.text,
      userAnswer: null,
      correctAnswer: currentQ.correctAnswer,
      isCorrect: false
    }]);
    
    // Show correct answer
    setShowCorrectAnswer(true);
  };

  // Handle answer selection
  const handleAnswer = (answer) => {
    setTimerActive(false);
    
    // Update score if correct
    const isCorrect = answer === currentQuestions[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore(prevScore => prevScore + 20);
    }
    
    // Record answer without showing previous answers
    setUserAnswers([...userAnswers, {
      question: currentQuestions[currentQuestion].text,
      userAnswer: answer,
      correctAnswer: currentQuestions[currentQuestion].correctAnswer,
      isCorrect: isCorrect
    }]);
    
    // Show correct answer
    setShowCorrectAnswer(true);
  };

  // Move to next question
  // const moveToNextQuestion = () => {
  //   if (currentQuestion < currentQuestions.length - 1) {
  //     // Reset timer and go to next question
  //     setTimer(10);
  //     setCurrentQuestion(prev => prev + 1);
  //     setTimerActive(true);
  //   } else {
  //     // Game over
  //     setGameEnded(true);
  //   }
  // };

  const moveToNextQuestion = async () => {
  if (currentQuestion < currentQuestions.length - 1) {
    // Reset timer and go to next question
    setTimer(10);
    setCurrentQuestion(prev => prev + 1);
    setTimerActive(true);
  } else {
    // Game over - submit score before setting gameEnded
    setGameEnded(true);
    
    // Submit score to backend
    const result = await submitQuizScore(score);
    
    if (result.success) {
      setScoreSubmitted(true);
      console.log(`Added ${score} points to your total!`);
    } else {
      console.error("Failed to submit score:", result.error);
      setScoreSubmitted(false);
    }
  }
};

  // Reset game
  const resetGame = () => {
    setGameStarted(false);
    setCurrentQuestion(0);
    setScore(0);
    setTimer(10);
    setGameEnded(false);
    setUserAnswers([]);
    setShowCorrectAnswer(false);
    setCurrentQuestions([]);

    setScoreSubmitted(false);
  };

  // Render correct symbols
  const renderAnswerSymbol = (isCorrect) => {
    return isCorrect ? 
      <span className="text-green-600 ml-1">✓</span> : 
      <span className="text-red-600 ml-1">✗</span>;
  };

  // Render method span with color
  const renderMethodSpan = (method) => {
    const colors = {
      "map()": "text-blue-600 font-medium",
      "filter()": "text-green-600 font-medium", 
      "reduce()": "text-purple-600 font-medium"
    };
    
    return <span className={colors[method]}>{method}</span>;
  };
  const methodInfo = {
    map: {
      title: "map()",
      description: "Creates a new array by applying a function to each element in the original array.",
      syntax: "array.map(callback(element, index, array))",
      details: [
        "Transforms every element in an array",
        "Same number of items in result array as original array",
        "Original array is not modified",
        "Returns a new array"
      ],
      useCases: [
        "Formatting data from an API",
        "Converting values (e.g., dollars to euros)",
        "Creating JSX elements from data",
        "Extracting specific properties from objects"
      ]
    },
    filter: {
      title: "filter()",
      description: "Creates a new array with elements that pass a test implemented by the provided function.",
      syntax: "array.filter(callback(element, index, array))",
      details: [
        "Removes elements that don't pass a condition",
        "Result array can be smaller than original array",
        "Original array is not modified",
        "Callback must return true or false"
      ],
      useCases: [
        "Removing invalid data entries",
        "Implementing search functionality",
        "Filtering items by property (e.g., category)",
        "Removing duplicates when combined with other methods"
      ]
    },
    reduce: {
      title: "reduce()",
      description: "Executes a reducer function on each element, resulting in a single output value.",
      syntax: "array.reduce(callback(accumulator, currentValue, index, array), initialValue)",
      details: [
        "Processes array into a single value",
        "Accumulator keeps track of the result between iterations",
        "Initial value sets the starting accumulator value",
        "Result can be any data type (number, string, object, array)"
      ],
      useCases: [
        "Summing values in an array",
        "Creating a tally/count of items",
        "Converting an array to an object",
        "Flattening nested arrays"
      ]
    }
  };

  // Examples with explanations
  const codeExamples = {
    map: [
      {
        title: "Simple multiplication",
        code: "num => num * 2",
        input: [1, 2, 3, 4],
        output: [2, 4, 6, 8],
        explanation: "Doubles each number in the array"
      },
      {
        title: "String manipulation",
        code: "str => str.toUpperCase()",
        input: ["apple", "banana", "cherry"],
        output: ["APPLE", "BANANA", "CHERRY"],
        explanation: "Converts each string to uppercase"
      },
      {
        title: "Object property extraction",
        code: "user => user.name",
        input: [
          { name: "John", age: 30 },
          { name: "Jane", age: 25 },
          { name: "Bob", age: 40 }
        ],
        output: ["John", "Jane", "Bob"],
        explanation: "Extracts just the name property from each object"
      }
    ],
    filter: [
      {
        title: "Even numbers",
        code: "num => num % 2 === 0",
        input: [1, 2, 3, 4, 5, 6],
        output: [2, 4, 6],
        explanation: "Keeps only even numbers"
      },
      {
        title: "String length filter",
        code: "str => str.length > 5",
        input: ["apple", "banana", "cherry", "strawberry"],
        output: ["banana", "strawberry"],
        explanation: "Keeps only strings longer than 5 characters"
      },
      {
        title: "Object property filter",
        code: "user => user.age >= 30",
        input: [
          { name: "John", age: 30 },
          { name: "Jane", age: 25 },
          { name: "Bob", age: 40 }
        ],
        output: [
          { name: "John", age: 30 },
          { name: "Bob", age: 40 }
        ],
        explanation: "Keeps only users who are 30 or older"
      }
    ],
    reduce: [
      {
        title: "Sum of numbers",
        code: "(sum, num) => sum + num",
        input: [1, 2, 3, 4, 5],
        initialValue: 0,
        output: 15,
        explanation: "Adds all numbers together, starting from 0"
      },
      {
        title: "String concatenation",
        code: "(result, str) => result + str",
        input: ["Hello", " ", "World", "!"],
        initialValue: "",
        output: "Hello World!",
        explanation: "Joins all strings together, starting with an empty string"
      },
      {
        title: "Creating an object from array",
        code: "(obj, item) => { obj[item.id] = item.value; return obj; }",
        input: [
          { id: "a", value: 1 },
          { id: "b", value: 2 },
          { id: "c", value: 3 }
        ],
        initialValue: "{}",
        output: { a: 1, b: 2, c: 3 },
        explanation: "Converts an array of objects into a single object with id as keys"
      }
    ]
  };

  // Run the map example
  const runMapExample = () => {
    try {
      const func = eval(mapCode);
      const result = mapInput.map(func);
      setMapResult(result);
      setError("");
    } catch (err) {
      setError(`Map error: ${err.message}`);
    }
  };
  
  // Run the filter example
  const runFilterExample = () => {
    try {
      const func = eval(filterCode);
      const result = filterInput.filter(func);
      setFilterResult(result);
      setError("");
    } catch (err) {
      setError(`Filter error: ${err.message}`);
    }
  };
  
  // Run the reduce example
  const runReduceExample = () => {
    try {
      const func = eval(reduceCode);
      const initialVal = eval(reduceInitial);
      const result = reduceInput.reduce(func, initialVal);
      setReduceResult(result);
      setError("");
    } catch (err) {
      setError(`Reduce error: ${err.message}`);
    }
  };
  
  // Run the chaining example
  const runChainExample = () => {
    try {
      // Example of method chaining
      const result = chainInput
        .filter(num => num % 2 === 0)    // Get even numbers
        .map(num => num * 2)             // Double them
        .reduce((sum, num) => sum + num, 0); // Sum them up
      setChainResult(result);
      setError("");
    } catch (err) {
      setError(`Chain error: ${err.message}`);
    }
  };

  // Run examples on component mount
  useEffect(() => {
    runMapExample();
    runFilterExample();
    runReduceExample();
    runChainExample();
  }, []);

  // Load a specific example
  const loadExample = (method, index) => {
    const example = codeExamples[method][index];
    
    if (method === "map") {
      setMapInput(example.input);
      setMapCode(example.code);
    } else if (method === "filter") {
      setFilterInput(example.input);
      setFilterCode(example.code);
    } else if (method === "reduce") {
      setReduceInput(example.input);
      setReduceCode(example.code);
      setReduceInitial(JSON.stringify(example.initialValue));
    }
  };

  // Try to parse and stringify input
  const parseInput = (input, setter) => {
    try {
      const parsed = JSON.parse(input);
      setter(parsed);
      setError("");
    } catch (err) {
      setError("Invalid JSON format");
    }
  };

  return (
    <div className="p-6 bg-gray-50">
      {/* Array Methods Challenge Game */}
      <div className="bg-white rounded-lg shadow-md p-5 mb-6">
      <h3 className="text-xl font-bold text-indigo-600 mb-4">Array Methods: Beat the Clock Challenge</h3>
      
      {/* Game intro - shown when game hasn't started */}
      {!gameStarted && !gameEnded && (
        <div className="game-intro mb-8 border-b pb-6">
          <p className="font-bold text-gray-700 mb-2">Game Instructions:</p>
          <div className="bg-indigo-50 p-4 rounded-md mb-4">
            <p className="text-gray-700 mb-2">
              Test your knowledge of JavaScript array methods against the clock!
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-600">
              <li>10 questions total (randomly selected from a pool of 20)</li>
              <li>10 seconds per question</li>
              <li>20 points for each correct answer</li>
              <li>Choose between <span className="text-blue-600 font-medium">map()</span>, 
                  <span className="text-green-600 font-medium"> filter()</span>, or 
                  <span className="text-purple-600 font-medium"> reduce()</span></li>
              <li>Correct answer will be shown for 3 seconds before the next question</li>
            </ul>
          </div>
          
          <div className="flex justify-center mb-4">
            <button 
              onClick={startGame}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-bold text-lg shadow-lg transition"
            >
              Start Challenge
            </button>
          </div>
        </div>
      )}
      
      {/* Active game interface */}
      {gameStarted && !gameEnded && (
        <div className="mb-10">
          <p className="font-bold text-gray-700 mb-4">Question {currentQuestion + 1} of 10:</p>
          
          {/* Timer and score display */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <div className="text-2xl font-bold mr-2">Q{currentQuestion + 1}/10</div>
              <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full font-medium">
                Score: {score}
              </div>
            </div>
            
            {!showCorrectAnswer && (
              <div className="bg-red-100 px-4 py-2 rounded-full flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <div className="text-xl font-bold text-red-600">{timer}</div>
              </div>
            )}
            
            {showCorrectAnswer && (
              <div className="mt-4 text-center">
                <span className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full">
                  Next question in 3 seconds...
                </span>
              </div>
            )}
          </div>
          
          {/* Question display */}
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 mb-4">
            <h4 className="text-lg font-medium text-gray-800 mb-6">
              {currentQuestions[currentQuestion]?.text}
            </h4>
            
            <div className="grid grid-cols-3 gap-3">
              {/* map() button */}
              <button 
                onClick={() => !showCorrectAnswer && handleAnswer("map()")}
                className={`border-2 font-bold py-4 px-4 rounded-lg transition
                  ${showCorrectAnswer && currentQuestions[currentQuestion]?.correctAnswer === "map()" 
                    ? "bg-green-500 text-white border-green-600" 
                    : "bg-white text-blue-700 border-blue-300 hover:bg-blue-50"
                  }`}
                disabled={showCorrectAnswer}
              >
                map()
              </button>
              
              {/* filter() button */}
              <button 
                onClick={() => !showCorrectAnswer && handleAnswer("filter()")}
                className={`border-2 font-bold py-4 px-4 rounded-lg transition
                  ${showCorrectAnswer && currentQuestions[currentQuestion]?.correctAnswer === "filter()" 
                    ? "bg-green-500 text-white border-green-600" 
                    : "bg-white text-green-700 border-green-300 hover:bg-green-50"
                  }`}
                disabled={showCorrectAnswer}
              >
                filter()
              </button>
              
              {/* reduce() button */}
              <button 
                onClick={() => !showCorrectAnswer && handleAnswer("reduce()")}
                className={`border-2 font-bold py-4 px-4 rounded-lg transition
                  ${showCorrectAnswer && currentQuestions[currentQuestion]?.correctAnswer === "reduce()" 
                    ? "bg-green-500 text-white border-green-600" 
                    : "bg-white text-purple-700 border-purple-300 hover:bg-purple-50"
                  }`}
                disabled={showCorrectAnswer}
              >
                reduce()
              </button>
            </div>
            
            {/* Feedback text */}
            {showCorrectAnswer && (
              <div className="mt-6 flex flex-col items-center">
                {/* Correct/Incorrect indicator */}
                {userAnswers[userAnswers.length - 1]?.isCorrect ? (
                  <div className="flex items-center text-lg font-medium text-green-600 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Correct!
                  </div>
                ) : (
                  <div className="flex items-center text-lg font-medium text-red-600 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {userAnswers[userAnswers.length - 1]?.userAnswer ? 
                      "Incorrect!" : 
                      "Time's up!"}
                  </div>
                )}
                
                {/* Next question countdown */}
                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-medium">
                  Next question in 3 seconds...
                </span>
              </div>
            )}
          </div>
          
          
          
          {/* Progress bar */}
          <div className="bg-gray-200 rounded-full h-2.5 mb-2">
            <div 
              className="bg-indigo-600 h-2.5 rounded-full" 
              style={{width: `${((currentQuestion + 1) / 10) * 100}%`}}
            ></div>
          </div>
          <div className="text-xs text-gray-500 text-right">Question {currentQuestion + 1} of 10</div>
        </div>
      )}
      
      {/* Results screen */}
      {gameEnded && (
        <div className="game-results">
          <p className="font-bold text-gray-700 mb-4">Final Results:</p>
          <p className="font-bold text-gray-700 mb-4">Final Results:</p>
            {scoreSubmitted ? (
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-medium">
                ✅ {score} points added to your total!
              </div>
            ) : (
              <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg font-medium">
                Score submission failed. Please try again.
              </div>
            )}

          {!scoreSubmitted && gameEnded && (
            <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg font-medium">
              Score submission failed. Please try again.
            </div>
          )}
          <div className="text-center mb-6">
            <div className="inline-block bg-indigo-100 rounded-full p-3 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-2xl font-bold text-gray-800 mb-1">Challenge Complete!</h4>
            <div className="text-3xl font-bold text-indigo-600 mb-2">
              Your Score: {score}/200
            </div>
            <div className="text-gray-500">
              You answered {score/20} out of 10 questions correctly
            </div>
          </div>
          
          {/* Answer review */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 mb-4">
            <h5 className="font-medium text-gray-700 mb-3">Your Answers:</h5>
            <div className="max-h-80 overflow-y-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left pb-2">Question</th>
                    <th className="text-left pb-2">Your Answer</th>
                    <th className="text-left pb-2">Correct Answer</th>
                  </tr>
                </thead>
                <tbody>
                  {userAnswers.map((answer, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="py-2 pr-2">{idx + 1}. {answer.question}</td>
                      <td className="py-2 px-2">
                        {answer.userAnswer ? renderMethodSpan(answer.userAnswer) : <span className="text-gray-400">No answer</span>}
                        {renderAnswerSymbol(answer.isCorrect)}
                      </td>
                      <td className="py-2 px-2">{renderMethodSpan(answer.correctAnswer)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="flex justify-between">
            <button 
              onClick={resetGame}
              className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-5 py-2 rounded-md font-medium"
            >
              Back to Start
            </button>
            <button 
              onClick={startGame}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md font-medium"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
      
      {/* Method Reference - shown at all times */}
      <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 mb-6 border border-indigo-100">
        <h3 className="font-bold text-indigo-800 mb-3">Method Cheat Sheet</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white p-3 rounded shadow-sm border border-blue-100">
            <div className="font-bold text-blue-600 mb-1">map()</div>
            <p className="text-gray-700">
              Transforms each element into a new form. Returns array of same length.
            </p>
          </div>
          <div className="bg-white p-3 rounded shadow-sm border border-green-100">
            <div className="font-bold text-green-600 mb-1">filter()</div>
            <p className="text-gray-700">
              Keeps elements that pass a condition. Returns subset of original array.
            </p>
          </div>
          <div className="bg-white p-3 rounded shadow-sm border border-purple-100">
            <div className="font-bold text-purple-600 mb-1">reduce()</div>
            <p className="text-gray-700">
              Combines elements into a single result. Returns one value.
            </p>
          </div>
        </div>
      </div>
    </div>
      
      
      {/* Real-world use cases */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-medium text-blue-600 mb-3">Data Transformation</h3>
          <div className="bg-gray-50 p-3 rounded-md font-mono text-xs mb-3">
            <div className="mb-1 text-gray-500">// API data to UI components</div>
            <div>
              apiData<br />
              <span className="text-blue-600 ml-2">.map(item =&gt; ({"{"})</span><br />
              <span className="ml-4">id: item.id,</span><br />
              <span className="ml-4">name: item.user_name,</span><br />
              <span className="ml-4">role: item.user_role,</span><br />
              <span className="text-blue-600 ml-2">{"}"}) )</span>
            </div>
          </div>
          <p className="text-gray-600 text-sm">
            Use map() to transform raw API data into the format your UI components expect.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-medium text-green-600 mb-3">Data Filtering</h3>
          <div className="bg-gray-50 p-3 rounded-md font-mono text-xs mb-3">
            <div className="mb-1 text-gray-500">// Search functionality</div>
            <div>
              products<br />
              <span className="text-green-600 ml-2">.filter(product ={">"} </span><br />
              <span className="ml-4">product.name</span><br />
              <span className="ml-6">.toLowerCase()</span><br />
              <span className="ml-6">.includes(searchText)</span><br />
              <span className="text-green-600 ml-2">)</span>
            </div>
          </div>
          <p className="text-gray-600 text-sm">
            Use filter() to implement search, sorting, and category filtering in applications.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-medium text-purple-600 mb-3">Data Aggregation</h3>
          <div className="bg-gray-50 p-3 rounded-md font-mono text-xs mb-3">
            <div className="mb-1 text-gray-500">// Shopping cart total</div>
            <div>
              cartItems<br />
              <span className="text-purple-600 ml-2">.reduce((total, item) ={">"} </span><br />
              <span className="ml-4">total + (item.price *</span><br />
              <span className="ml-8">item.quantity),</span><br />
              <span className="ml-4">0)</span>
            </div>
          </div>
          <p className="text-gray-600 text-sm">
            Use reduce() for calculating totals, preparing data for charts, or building complex objects.
          </p>
        </div>
      </div>
      
      {/* Performance tips and warnings */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h3 className="text-lg font-semibold text-indigo-600 mb-3">Best Practices and Tips</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 p-3 rounded-md">
            <h4 className="font-medium text-green-800 mb-2">Best Practices</h4>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              <li>Keep callback functions small and focused</li>
              <li>Consider using named functions for complex transformations</li>
              <li>Use appropriate method for the job (map vs. filter vs. reduce)</li>
              <li>Always pass an initial value to reduce() for type safety</li>
              <li>Use early returns in filter() for better readability</li>
            </ul>
          </div>
          
          <div className="bg-red-50 p-3 rounded-md">
            <h4 className="font-medium text-red-800 mb-2">Common Pitfalls</h4>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              <li>Forgetting to return a value from map() or filter() callbacks</li>
              <li>Mutating the original array inside callbacks</li>
              <li>Using reduce() when map() or filter() would be more appropriate</li>
              <li>Creating unnecessarily deep chains that hurt readability</li>
              <li>Performance issues with very large arrays (consider chunking)</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Show any errors */}
      {error && (
        <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          <strong>Error: </strong> {error}
        </div>
      )}
      
      <div className="text-center text-sm text-gray-500 mt-8">
        Master these three array methods, and you'll write cleaner, more maintainable JavaScript code.
      </div>

      
    </div>
    );
};

export default Slide3;
import React, { useState, useEffect } from "react";
import { FaGamepad, FaLightbulb } from "react-icons/fa";

const Slide4 = () => {
  // Example datasets
  const datasets = {
    users: [
      { id: 1, name: "Alex", age: 28, role: "developer", active: true },
      { id: 2, name: "Beth", age: 34, role: "designer", active: true },
      { id: 3, name: "Carlos", age: 24, role: "developer", active: false },
      { id: 4, name: "Diana", age: 32, role: "manager", active: true },
      { id: 5, name: "Erik", age: 41, role: "developer", active: true }
    ],
    products: [
      { id: 101, name: "Laptop", price: 999, inStock: true, categories: ["electronics", "work"] },
      { id: 102, name: "Phone", price: 699, inStock: true, categories: ["electronics", "mobile"] },
      { id: 103, name: "Monitor", price: 499, inStock: false, categories: ["electronics"] },
      { id: 104, name: "Desk", price: 249, inStock: true, categories: ["furniture", "work"] },
      { id: 105, name: "Chair", price: 149, inStock: true, categories: ["furniture"] }
    ],
    nestedData: [
      { id: 'A1', items: [10, 20, 30] },
      { id: 'B2', items: [15, 25] },
      { id: 'C3', items: [] },
      { id: 'D4', items: [5, 15, 25, 35] }
    ]
  };

  // Interactive example states
  const [activeMethod, setActiveMethod] = useState('find');
  const [dataSet, setDataSet] = useState('users');
  
  const [findQuery, setFindQuery] = useState('item => item.role === "developer" && item.active');
  const [findResult, setFindResult] = useState(null);
  
  const [findIndexQuery, setFindIndexQuery] = useState('item => item.name === "Diana"');
  const [findIndexResult, setFindIndexResult] = useState(null);
  
  const [someQuery, setSomeQuery] = useState('item => item.price > 500');
  const [someResult, setSomeResult] = useState(null);
  
  const [everyQuery, setEveryQuery] = useState('item => item.age > 20');
  const [everyResult, setEveryResult] = useState(null);
  
  const [flatMapQuery, setFlatMapQuery] = useState('item => item.items');
  const [flatMapResult, setFlatMapResult] = useState([]);
  
  // Game state
  const [showArrayGame, setShowArrayGame] = useState(false);
  const [currentChallenges, setCurrentChallenges] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [points, setPoints] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  
  // Fill-in-the-blank challenges
  const allChallenges = [
    {
      question: "To find the first product that costs more than $500 and is in stock:",
      method: 'find',
      data: 'products',
      beforeBlank: "products.find(item => item.price > 500 && ",
      afterBlank: ")",
      answer: "item.inStock",
      hint: "Check if the inStock property is true"
    },
    {
      question: "To check if there's at least one developer who is not active:",
      method: 'some',
      data: 'users',
      beforeBlank: "users.some(item => item.role === \"developer\" && ",
      afterBlank: ")",
      answer: "!item.active",
      hint: "Negate the active property with !"
    },
    {
      question: "To get the position of the first furniture item in the products array:",
      method: 'findIndex',
      data: 'products',
      beforeBlank: "products.findIndex(item => item.categories.",
      afterBlank: "(\"furniture\"))",
      answer: "includes",
      hint: "Use the method that checks if an array contains a specific value"
    },
    {
      question: "To check if all users are at least 21 years old:",
      method: 'every',
      data: 'users',
      beforeBlank: "users.every(user => ",
      afterBlank: ")",
      answer: "user.age >= 21",
      hint: "Compare the age property to 21 with a greater than or equal to operator"
    },
    {
      question: "To extract all item numbers from the nested data:",
      method: 'flatMap',
      data: 'nestedData',
      beforeBlank: "nestedData.flatMap(item => ",
      afterBlank: ")",
      answer: "item.items",
      hint: "Return the items array from each object"
    },
    {
      question: "To find the first user with 'designer' role:",
      method: 'find',
      data: 'users',
      beforeBlank: "users.find(user => user.role === ",
      afterBlank: ")",
      answer: "\"designer\"",
      hint: "Use quotes around the string value"
    },
    {
      question: "To check if any nested data object has an empty items array:",
      method: 'some',
      data: 'nestedData',
      beforeBlank: "nestedData.some(item => ",
      afterBlank: ")",
      answer: "item.items.length === 0",
      hint: "Check if the length of the items array is 0"
    },
    {
      question: "To find the index of a product named 'Monitor':",
      method: 'findIndex',
      data: 'products',
      beforeBlank: "products.findIndex(item => ",
      afterBlank: ")",
      answer: "item.name === \"Monitor\"",
      hint: "Compare the name property to 'Monitor'"
    },
    {
      question: "To check if all products have a price below $1000:",
      method: 'every',
      data: 'products',
      beforeBlank: "products.every(item => ",
      afterBlank: ")",
      answer: "item.price < 1000",
      hint: "Use the less than operator < with the price property"
    },
    {
      question: "To extract all nested data IDs into a flat array:",
      method: 'flatMap',
      data: 'nestedData',
      beforeBlank: "nestedData.flatMap(item => ",
      afterBlank: ")",
      answer: "[item.id]",
      hint: "Return each ID inside an array using square brackets"
    },
    {
      question: "To find products with multiple categories:",
      method: 'find',
      data: 'products',
      beforeBlank: "products.find(item => ",
      afterBlank: ")",
      answer: "item.categories.length > 1",
      hint: "Check if the categories array has more than 1 element"
    },
    {
      question: "To check if any product costs exactly $699:",
      method: 'some',
      data: 'products',
      beforeBlank: "products.some(item => ",
      afterBlank: ")",
      answer: "item.price === 699",
      hint: "Use the strict equality operator === to check the price"
    }
  ];

  // Run examples when inputs change
  useEffect(() => {
    try {
      const data = datasets[dataSet];
      const findFn = new Function('item', `return ${findQuery}`);
      setFindResult(data.find(findFn));
      
      const findIndexFn = new Function('item', `return ${findIndexQuery}`);
      setFindIndexResult(data.findIndex(findIndexFn));
      
      const someFn = new Function('item', `return ${someQuery}`);
      setSomeResult(data.some(someFn));
      
      const everyFn = new Function('item', `return ${everyQuery}`);
      setEveryResult(data.every(everyFn));
      
      if (dataSet === 'nestedData') {
        const flatMapFn = new Function('item', `return ${flatMapQuery}`);
        setFlatMapResult(data.flatMap(flatMapFn));
      }
    } catch (error) {
      console.error("Error running examples:", error);
    }
  }, [findQuery, findIndexQuery, someQuery, everyQuery, flatMapQuery, dataSet]);

  // Start game
  const startGame = () => {
    const shuffled = [...allChallenges].sort(() => Math.random() - 0.5);
    setCurrentChallenges(shuffled.slice(0, 10));
    setCurrentIndex(0);
    setPoints(0);
    setUserAnswer('');
    setFeedback('');
    setShowHint(false);
    setShowCorrectAnswer(false);
    setGameComplete(false);
    setShowArrayGame(true);
  };

  // Check user's answer
  const checkAnswer = () => {
    const challenge = currentChallenges[currentIndex];
    
    // Simple string comparison for the fill-in-the-blank challenges
    if (userAnswer.trim() === challenge.answer) {
      setFeedback('Correct!');
      // Add 20 points for a correct answer
      setPoints(points + 20);
      setShowCorrectAnswer(false);
    } else {
      setFeedback('Incorrect.');
      setShowCorrectAnswer(true);
    }
    
    // Always move to the next question after a delay
    setTimeout(() => {
      if (currentIndex < currentChallenges.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setUserAnswer('');
        setFeedback('');
        setShowHint(false);
        setShowCorrectAnswer(false);
      } else {
        setGameComplete(true);
      }
    }, 2000);
  };

  return (
    <div>
      <p className="text-blue-600 text-lg font-medium">Array Search & Extraction Methods 🔍</p>
      
      <p className="mt-2">
        There are multiple ways to search for elements and extract data from arrays in JavaScript. Let's explore these powerful methods beyond the basic iteration approaches.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-medium">find() & findIndex()</h3>
          <p className="text-sm mt-2">Creates a new array from an array-like or iterable object.</p>

          <div className="bg-gray-800 text-white p-3 rounded mt-2 text-sm font-mono">
            <div className="text-yellow-300">// find() returns the element</div>
            <div className="text-green-400">const dev = users.find(user ={">"} user.role === "developer");</div>
            <div className="text-gray-400">// {'{id: 1, name: "Alex", role: "developer", ...}'}</div>
            <div className="mt-2 text-yellow-300">// findIndex() returns the position</div>
            <div className="text-green-400">const pos = users.findIndex(user ={">"} user.active === false);</div>
            <div className="text-gray-400">// 2</div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="font-medium">some() & every()</h3>
          <p className="text-sm mt-2">Creates a new array from the provided arguments, regardless of type or number.</p>

          <div className="bg-gray-800 text-white p-3 rounded mt-2 text-sm font-mono">
            <div className="text-yellow-300">// some() checks if ANY element passes</div>
            <div className="text-green-400">const hasExpensive = products.some(p ={">"} p.price {">"} 500);</div>
            <div className="text-gray-400">// true</div>
            <div className="mt-2 text-yellow-300">// every() checks if ALL elements pass</div>
            <div className="text-green-400">const allInStock = products.every(p ={">"} p.inStock);</div>
            <div className="text-gray-400">// false</div>
          </div>
        </div>
      </div>

      <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200 mt-4">
        <h3 className="font-medium">flatMap()</h3>
        <p className="text-sm mt-2">The flatMap() method combines map() and flat() to extract and flatten nested data.</p>

        <div className="bg-gray-800 text-white p-3 rounded mt-2 text-sm font-mono">
          <div className="text-yellow-300">// Create from other arrays</div>
          <div className="text-green-400">const nestedData = [</div>
          <div className="text-green-400">  {"{id: 'A', items: [1, 2, 3]}"}, </div>
          <div className="text-green-400">  {"{id: 'B', items: [4, 5]}"}</div>
          <div className="text-green-400">];</div>
          <div className="text-green-400">const allItems = nestedData.flatMap(obj ={">"} obj.items);</div>
          <div className="text-gray-400">// [1, 2, 3, 4, 5]</div>
        </div>
      </div>
      
      {/* Interactive examples section */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mt-4 shadow-sm">
        <h3 className="font-medium text-gray-700 mb-3">Try It Yourself</h3>
        
        {/* Method tabs */}
        <div className="flex space-x-2 mb-4 flex-wrap">
          {['find', 'findIndex', 'some', 'every', 'flatMap'].map((method) => (
            <button 
              key={method}
              className={`px-3 py-1 rounded-md ${activeMethod === method ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'}`}
              onClick={() => {
                setActiveMethod(method);
                if (method === 'flatMap') setDataSet('nestedData');
              }}
            >
              {method}()
            </button>
          ))}
        </div>
        
        {/* Data selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Working with:</label>
          <div className="flex space-x-2">
            {Object.keys(datasets).map((name) => (
              <button 
                key={name}
                className={`px-2 py-1 rounded ${dataSet === name ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-gray-100 text-gray-600'}`}
                onClick={() => activeMethod !== 'flatMap' || name === 'nestedData' ? setDataSet(name) : null}
                disabled={activeMethod === 'flatMap' && name !== 'nestedData'}
              >
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Dynamic content based on selected method */}
        {activeMethod === 'find' && (
          <div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Find condition:</label>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 font-mono">item =&gt;</span>
                <input
                  type="text"
                  className="border border-gray-300 rounded p-1.5 flex-grow font-mono text-sm"
                  value={findQuery.replace(/.*=>/, '').trim()}
                  onChange={(e) => setFindQuery(`item => ${e.target.value}`)}
                />
              </div>
            </div>
            
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Result:</label>
              <pre className="bg-gray-50 p-2 rounded border text-xs overflow-x-auto">
                {findResult !== undefined ? JSON.stringify(findResult, null, 2) : "undefined"}
              </pre>
            </div>
          </div>
        )}
        
        {activeMethod === 'findIndex' && (
          <div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Find index condition:</label>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 font-mono">item =&gt;</span>
                <input
                  type="text"
                  className="border border-gray-300 rounded p-1.5 flex-grow font-mono text-sm"
                  value={findIndexQuery.replace(/.*=>/, '').trim()}
                  onChange={(e) => setFindIndexQuery(`item => ${e.target.value}`)}
                />
              </div>
            </div>
            
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Result:</label>
              <pre className="bg-gray-50 p-2 rounded border text-xs">
                {findIndexResult}
              </pre>
              {findIndexResult !== -1 && (
                <div className="mt-1 text-xs text-gray-600">
                  Found at position {findIndexResult}:
                  <pre className="bg-blue-50 p-1 mt-1 rounded">
                    {JSON.stringify(datasets[dataSet][findIndexResult], null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeMethod === 'some' && (
          <div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Some condition:</label>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 font-mono">item =&gt;</span>
                <input
                  type="text"
                  className="border border-gray-300 rounded p-1.5 flex-grow font-mono text-sm"
                  value={someQuery.replace(/.*=>/, '').trim()}
                  onChange={(e) => setSomeQuery(`item => ${e.target.value}`)}
                />
              </div>
            </div>
            
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Result:</label>
              <div className={`p-2 rounded font-medium text-center ${someResult ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {someResult ? 'TRUE' : 'FALSE'}
              </div>
            </div>
          </div>
        )}
        
        {activeMethod === 'every' && (
          <div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Every condition:</label>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 font-mono">item =&gt;</span>
                <input
                  type="text"
                  className="border border-gray-300 rounded p-1.5 flex-grow font-mono text-sm"
                  value={everyQuery.replace(/.*=>/, '').trim()}
                  onChange={(e) => setEveryQuery(`item => ${e.target.value}`)}
                />
              </div>
            </div>
            
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Result:</label>
              <div className={`p-2 rounded font-medium text-center ${everyResult ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {everyResult ? 'TRUE - All items match' : 'FALSE - Not all items match'}
              </div>
            </div>
          </div>
        )}
        
        {activeMethod === 'flatMap' && (
          <div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">FlatMap function:</label>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 font-mono">item =&gt;</span>
                <input
                  type="text"
                  className="border border-gray-300 rounded p-1.5 flex-grow font-mono text-sm"
                  value={flatMapQuery.replace(/.*=>/, '').trim()}
                  onChange={(e) => setFlatMapQuery(`item => ${e.target.value}`)}
                />
              </div>
            </div>
            
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Result:</label>
              <pre className="bg-gray-50 p-2 rounded border text-xs overflow-x-auto">
                {JSON.stringify(flatMapResult, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
      
      {/* Array Method Challenge game - FILL-IN-THE-BLANKS VERSION with 10 questions */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-lg border border-purple-200 shadow-sm mt-4 text-center">
        <h3 className="font-medium mb-3 flex items-center justify-center">
          <FaGamepad className="text-purple-500 mr-2" />
          Searching and Extraction Techniques Mini-Challenge
        </h3>
        
        <p className="mb-4 text-sm">
          Fill in the blanks to complete each array method! You'll get 10 random challenges to solve.
        </p>
        
        {!showArrayGame ? (
          <button 
            onClick={startGame}
            className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-6 rounded shadow-sm transition-colors"
          >
            Start Challenge
          </button>
        ) : !gameComplete ? (
          <div className="animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium">Question: {currentIndex + 1}/10</span>
              <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                {points} points
              </div>
            </div>
            
            <div className="bg-white p-4 rounded shadow-sm mb-4 text-left">
              <p className="text-blue-800 font-medium mb-2">
                {currentChallenges[currentIndex]?.question}
              </p>
              
              {/* Fill-in-the-blank UI */}
              <div className="bg-gray-50 p-3 rounded border border-gray-200 mb-4 font-mono text-sm">
                <div className="flex flex-wrap items-center">
                  <span className="text-blue-600 mr-1">{currentChallenges[currentIndex]?.beforeBlank}</span>
                  <input 
                    type="text"
                    className="border border-blue-300 px-2 py-1 rounded bg-blue-50 text-blue-800 w-40 my-1"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="your code here"
                    disabled={feedback !== ''}
                  />
                  <span className="text-blue-600 ml-1">{currentChallenges[currentIndex]?.afterBlank}</span>
                </div>
              </div>
              
              <div className="flex justify-between">
                <button 
                  className={`px-3 py-1 rounded text-sm flex items-center ${showHint ? 'bg-yellow-100 text-yellow-700' : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700'}`}
                  onClick={() => setShowHint(true)}
                  disabled={showHint || feedback !== ''}
                >
                  <FaLightbulb className="mr-1" /> {showHint ? 'Hint shown' : 'Show hint'}
                </button>
                
                <button 
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-1 rounded shadow-sm"
                  onClick={checkAnswer}
                  disabled={feedback !== ''}
                >
                  Submit Answer
                </button>
              </div>
              
              {showHint && (
                <div className="mt-3 p-2 bg-yellow-50 border border-yellow-100 rounded text-sm text-yellow-800">
                  <span className="font-medium">Hint:</span> {currentChallenges[currentIndex]?.hint}
                </div>
              )}
              
              {feedback && (
                <div className={`mt-3 p-2 rounded ${feedback === 'Correct!' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  <p>{feedback}</p>
                  {showCorrectAnswer && (
                    <p className="mt-1 font-medium">
                      Correct answer: <span className="font-mono">{currentChallenges[currentIndex]?.answer}</span>
                    </p>
                  )}
                </div>
              )}
              
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Working with:</p>
                <pre className="bg-gray-50 p-2 rounded border text-xs overflow-x-auto max-h-32">
                  {JSON.stringify(currentChallenges[currentIndex] ? 
                    datasets[currentChallenges[currentIndex].data] : {}, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        ) : (
          <div className={`p-4 rounded-lg ${
            points === 200 
              ? "bg-green-100 border border-green-200" 
              : "bg-amber-50 border border-amber-200"
          }`}>
            {points === 200 ? (
              <p className="font-medium mb-3">
                Perfect! You completed all challenges!
              </p>
            ) : (
              <p className="font-medium mb-3">
                You got {points/20} out of 10 challenges correct!
              </p>
            )}
            
            <button 
              onClick={startGame} 
              className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded text-sm"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
      
      {/* Method comparison quick reference */}
      <div className="mt-4 bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <h3 className="font-medium text-gray-700 mb-3">Quick Reference</h3>
        
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-2 px-3 text-left text-gray-700">Method</th>
              <th className="py-2 px-3 text-left text-gray-700">Purpose</th>
              <th className="py-2 px-3 text-left text-gray-700">Returns</th>
              <th className="py-2 px-3 text-left text-gray-700">Use When</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="py-2 px-3 font-medium">find()</td>
              <td className="py-2 px-3">Find a specific item</td>
              <td className="py-2 px-3">First matching element or undefined</td>
              <td className="py-2 px-3">You need the actual element that matches</td>
            </tr>
            <tr>
              <td className="py-2 px-3 font-medium">findIndex()</td>
              <td className="py-2 px-3">Find position of an item</td>
              <td className="py-2 px-3">Index (number) or -1</td>
              <td className="py-2 px-3">You need the position in an array</td>
            </tr>
            <tr>
              <td className="py-2 px-3 font-medium">some()</td>
              <td className="py-2 px-3">Test if ANY elements match</td>
              <td className="py-2 px-3">Boolean (true/false)</td>
              <td className="py-2 px-3">Checking if at least one item meets a condition</td>
            </tr>
            <tr>
              <td className="py-2 px-3 font-medium">every()</td>
              <td className="py-2 px-3">Test if ALL elements match</td>
              <td className="py-2 px-3">Boolean (true/false)</td>
              <td className="py-2 px-3">Verifying that all items meet a requirement</td>
            </tr>
            <tr>
              <td className="py-2 px-3 font-medium">flatMap()</td>
              <td className="py-2 px-3">Transform and flatten</td>
              <td className="py-2 px-3">New flattened array</td>
              <td className="py-2 px-3">Working with nested arrays or extracting data</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Slide4;
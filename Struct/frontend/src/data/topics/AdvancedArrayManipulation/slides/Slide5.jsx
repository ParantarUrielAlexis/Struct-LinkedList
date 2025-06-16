import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FaLightbulb, FaChartLine, FaMemory, FaRocket, FaTrophy, FaGamepad, FaCheck, FaTimes, FaBolt, FaClock, FaSearch, FaSort } from 'react-icons/fa';

const Slide5 = () => {
  // State for interactive examples
  const [dataSize, setDataSize] = useState(10000);
  const [executionTime, setExecutionTime] = useState({});
  const [activeTab, setActiveTab] = useState('complexity');
  const [showBenchmark, setShowBenchmark] = useState(false);
  const [runningBenchmark, setRunningBenchmark] = useState(false);
  const [memoryDemo, setMemoryDemo] = useState({ regular: 0, typed: 0 });
  
  // State for the Array Optimizer game
  const [gameActive, setGameActive] = useState(false);
  const [gameLevel, setGameLevel] = useState(1);
  const [gameScore, setGameScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOptions, setGameOptions] = useState([]);
  const [currentProblem, setCurrentProblem] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [gameEnded, setGameEnded] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [completedProblems, setCompletedProblems] = useState(0);
  const [points, setPoints] = useState(0);
  const [allProblems, setAllProblems] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const timerRef = useRef(null);

  // Ref for chart canvas
  const chartRef = useRef(null);

  // Sample dataset for benchmarks
  const generateLargeArray = (size) => {
    return Array.from({ length: size }, () => Math.floor(Math.random() * 1000));
  };

  // Memoized large array to prevent regeneration on every render
  const largeArray = useMemo(() => generateLargeArray(dataSize), [dataSize]);

  // Game challenges database
  // First, let's add more questions to each level array
  const optimizationProblems = [
    // Level 1: Basic time complexity (expanded)
    [
      {
        scenario: "You need to check if a specific number exists in an array of 10,000 elements.",
        options: [
          { text: "Use array.includes(value)", complexity: "O(n)", isOptimal: true, explanation: "Linear search that stops when found" },
          { text: "Loop through entire array with forEach", complexity: "O(n)", isOptimal: false, explanation: "forEach always processes all elements even after finding a match" },
          { text: "Convert to Set then check with set.has(value)", complexity: "O(n) + O(1)", isOptimal: false, explanation: "Creating the Set is O(n), but only worth it for multiple lookups" }
        ],
        category: "search"
      },
      {
        scenario: "You need to add a new element to an array.",
        options: [
          { text: "Use array.push(element)", complexity: "O(1)", isOptimal: true, explanation: "Adding to the end is constant time" },
          { text: "Use array.unshift(element)", complexity: "O(n)", isOptimal: false, explanation: "Adding to the beginning requires shifting all elements" },
          { text: "Use array = [...array, element]", complexity: "O(n)", isOptimal: false, explanation: "Creates a new array copy which is O(n)" }
        ],
        category: "modification"
      },
      {
        scenario: "You need to filter out certain elements from an array.",
        options: [
          { text: "Use array.filter(callback)", complexity: "O(n)", isOptimal: true, explanation: "Single pass through the array" },
          { text: "Use nested loops to check each element", complexity: "O(n²)", isOptimal: false, explanation: "Nested loops are unnecessarily complex for filtering" },
          { text: "Sort first then filter", complexity: "O(n log n) + O(n)", isOptimal: false, explanation: "Sorting is unnecessary and more expensive" }
        ],
        category: "filtering"
      },
      {
        scenario: "You need to find the index of an element in an array.",
        options: [
          { text: "Use array.indexOf(element)", complexity: "O(n)", isOptimal: true, explanation: "Linear search that returns as soon as element is found" },
          { text: "Use a for loop with a counter", complexity: "O(n)", isOptimal: true, explanation: "Also a linear search that can break early" },
          { text: "Use array.findIndex() with complex callback", complexity: "O(n)", isOptimal: false, explanation: "More overhead for simple lookups compared to indexOf" }
        ],
        category: "search"
      },
      {
        scenario: "You need to check if all elements in an array meet a condition.",
        options: [
          { text: "Use array.every(callback)", complexity: "O(n)", isOptimal: true, explanation: "Stops as soon as it finds a false condition" },
          { text: "Filter and compare lengths", complexity: "O(n)", isOptimal: false, explanation: "Always processes the entire array, less efficient" },
          { text: "Use a for loop with a break", complexity: "O(n)", isOptimal: true, explanation: "Can exit early like every()" }
        ],
        category: "validation"
      },
      {
        scenario: "You need to create a copy of an array.",
        options: [
          { text: "Use array.slice()", complexity: "O(n)", isOptimal: true, explanation: "Efficient shallow copy" },
          { text: "Use spread operator [...array]", complexity: "O(n)", isOptimal: true, explanation: "Modern and readable shallow copy" },
          { text: "Use JSON.parse(JSON.stringify(array))", complexity: "O(n)", isOptimal: false, explanation: "Much slower deep copy, only needed for nested objects" }
        ],
        category: "manipulation"
      },
      {
        scenario: "You need to check if an array contains duplicate elements.",
        options: [
          { text: "Convert to Set and compare sizes", complexity: "O(n)", isOptimal: true, explanation: "Single pass through array" },
          { text: "Use nested loops to compare each element", complexity: "O(n²)", isOptimal: false, explanation: "Quadratic complexity is inefficient" },
          { text: "Sort first then check adjacent elements", complexity: "O(n log n)", isOptimal: false, explanation: "Sorting is unnecessary overhead" }
        ],
        category: "search"
      }
    ],
    // Level 2: More complex operations (expanded)
    [
      {
        scenario: "You need to find the intersection of two large arrays.",
        options: [
          { text: "Convert arrays to Sets and use Set intersection", complexity: "O(n+m)", isOptimal: true, explanation: "Using Sets gives O(1) lookup time" },
          { text: "Use nested for loops to compare elements", complexity: "O(n×m)", isOptimal: false, explanation: "Comparing each element with every other element is inefficient" },
          { text: "Sort both arrays then compare sequentially", complexity: "O(n log n + m log m)", isOptimal: false, explanation: "Sorting is unnecessary overhead" }
        ],
        category: "search"
      },
      {
        scenario: "You need to sort an array of 10,000 numeric values.",
        options: [
          { text: "Use array.sort((a,b) => a-b)", complexity: "O(n log n)", isOptimal: true, explanation: "JavaScript's native sort uses an efficient algorithm" },
          { text: "Implement bubble sort", complexity: "O(n²)", isOptimal: false, explanation: "Bubble sort is very inefficient for large arrays" },
          { text: "First filter out duplicates, then sort", complexity: "O(n) + O(k log k)", isOptimal: false, explanation: "Removing duplicates doesn't help sorting performance significantly" }
        ],
        category: "sorting"
      },
      {
        scenario: "You need to check if any element in the array meets a condition.",
        options: [
          { text: "Use array.some(callback)", complexity: "O(n)", isOptimal: true, explanation: "Stops checking once it finds a match" },
          { text: "Use array.filter(callback).length > 0", complexity: "O(n)", isOptimal: false, explanation: "Filter processes the entire array before checking length" },
          { text: "Use a for loop with a break", complexity: "O(n)", isOptimal: true, explanation: "Manual loop with break also stops when found" }
        ],
        category: "search"
      },
      {
        scenario: "You need to transform each element of an array.",
        options: [
          { text: "Use array.map(callback)", complexity: "O(n)", isOptimal: true, explanation: "Designed for array transformations with clean syntax" },
          { text: "Use for loop and push to new array", complexity: "O(n)", isOptimal: false, explanation: "More verbose and prone to errors" },
          { text: "Use forEach with external array", complexity: "O(n)", isOptimal: false, explanation: "Less readable than map for transformations" }
        ],
        category: "manipulation"
      },
      {
        scenario: "You need to find the maximum value in an array of numbers.",
        options: [
          { text: "Use Math.max(...array)", complexity: "O(n)", isOptimal: false, explanation: "Spreads the array which has size limitations" },
          { text: "Use array.reduce((max, val) => Math.max(max, val))", complexity: "O(n)", isOptimal: true, explanation: "Single pass through the array without spreading" },
          { text: "Sort array and take last element", complexity: "O(n log n)", isOptimal: false, explanation: "Sorting is unnecessary overhead for finding maximum" }
        ],
        category: "search"
      },
      {
        scenario: "You need to group array elements by a property.",
        options: [
          { text: "Use array.reduce with an object accumulator", complexity: "O(n)", isOptimal: true, explanation: "Single pass with O(1) property access" },
          { text: "Use nested loops to separate groups", complexity: "O(n²)", isOptimal: false, explanation: "Nested loops are inefficient for grouping" },
          { text: "Sort first then group adjacent elements", complexity: "O(n log n)", isOptimal: false, explanation: "Sorting adds unnecessary complexity" }
        ],
        category: "manipulation"
      },
      {
        scenario: "You need to find if two arrays contain the same elements (regardless of order).",
        options: [
          { text: "Convert both to Sets and compare size and elements", complexity: "O(n+m)", isOptimal: true, explanation: "Efficient way to compare unique elements" },
          { text: "Sort both arrays then compare sequentially", complexity: "O(n log n + m log m)", isOptimal: false, explanation: "Sorting is more expensive than using Sets" },
          { text: "Count occurrences in both arrays using objects", complexity: "O(n+m)", isOptimal: true, explanation: "Handles duplicates correctly with linear complexity" }
        ],
        category: "comparison"
      }
    ],
    // Level 3: Memory optimization and advanced problems (expanded)
    [
      {
        scenario: "You're working with a large array of numbers (1 million integers) and need to perform many mathematical operations.",
        options: [
          { text: "Use a TypedArray (Int32Array)", complexity: "Memory efficient", isOptimal: true, explanation: "TypedArrays use less memory for numeric data" },
          { text: "Use a regular JavaScript array", complexity: "Memory intensive", isOptimal: false, explanation: "Regular arrays use more memory per number" },
          { text: "Use Map to store indices and values", complexity: "Very memory intensive", isOptimal: false, explanation: "Map has higher overhead than needed for simple numeric data" }
        ],
        category: "memory"
      },
      {
        scenario: "You need to make a copy of a large array before modifying it.",
        options: [
          { text: "Use array.slice()", complexity: "O(n), memory efficient", isOptimal: true, explanation: "Creates a shallow copy efficiently" },
          { text: "Use JSON.parse(JSON.stringify(array))", complexity: "O(n), memory intensive", isOptimal: false, explanation: "Very slow for large arrays and uses a lot of memory" },
          { text: "Use array.splice(0)", complexity: "O(n), mutates original", isOptimal: false, explanation: "This modifies the original array rather than creating a copy" }
        ],
        category: "memory"
      },
      {
        scenario: "You need to flatten a nested array structure.",
        options: [
          { text: "Use array.flat() or array.flatMap()", complexity: "O(n), optimized", isOptimal: true, explanation: "Built-in methods optimized for flattening" },
          { text: "Use nested loops and concatenation", complexity: "O(n), memory intensive", isOptimal: false, explanation: "Multiple concatenations create unnecessary intermediate arrays" },
          { text: "Use reduce with concatenation", complexity: "O(n²), problematic", isOptimal: false, explanation: "Each concat creates a new array, leading to quadratic behavior" }
        ],
        category: "manipulation"
      },
      {
        scenario: "You need to efficiently search in a very large sorted array.",
        options: [
          { text: "Use binary search algorithm", complexity: "O(log n)", isOptimal: true, explanation: "Logarithmic complexity is optimal for sorted arrays" },
          { text: "Use array.indexOf()", complexity: "O(n)", isOptimal: false, explanation: "Linear search doesn't utilize the sorting" },
          { text: "Use array.find()", complexity: "O(n)", isOptimal: false, explanation: "Also linear search that doesn't leverage sorting" }
        ],
        category: "search"
      },
      {
        scenario: "You need to find the most frequently occurring element in a large array.",
        options: [
          { text: "Use an object to count occurrences", complexity: "O(n), space O(k)", isOptimal: true, explanation: "Single pass with efficient lookups" },
          { text: "Sort the array and count adjacent elements", complexity: "O(n log n)", isOptimal: false, explanation: "Sorting is unnecessary overhead" },
          { text: "Use nested loops to count each element", complexity: "O(n²)", isOptimal: false, explanation: "Quadratic time complexity is inefficient" }
        ],
        category: "search"
      },
      {
        scenario: "You need to remove duplicate elements from a large array.",
        options: [
          { text: "Use Set: [...new Set(array)]", complexity: "O(n)", isOptimal: true, explanation: "Most efficient way to remove duplicates" },
          { text: "Use filter with indexOf comparison", complexity: "O(n²)", isOptimal: false, explanation: "indexOf inside filter creates nested loops" },
          { text: "Sort first then remove adjacent duplicates", complexity: "O(n log n)", isOptimal: false, explanation: "Sorting adds unnecessary overhead" }
        ],
        category: "manipulation"
      },
      {
        scenario: "You need to implement a queue data structure with arrays.",
        options: [
          { text: "Use push() and shift()", complexity: "push: O(1), shift: O(n)", isOptimal: false, explanation: "shift() is inefficient for large arrays" },
          { text: "Maintain start/end indices in a circular buffer", complexity: "O(1) operations", isOptimal: true, explanation: "Most efficient array-based queue implementation" },
          { text: "Use unshift() and pop()", complexity: "unshift: O(n), pop: O(1)", isOptimal: false, explanation: "unshift() is inefficient for large arrays" }
        ],
        category: "datastructure"
      },
      // Additional problems
      {
        scenario: "You need to merge two sorted arrays into a single sorted array.",
        options: [
          { text: "Use a two-pointer approach", complexity: "O(n+m)", isOptimal: true, explanation: "Linear time complexity utilizing the pre-sorted nature" },
          { text: "Concatenate arrays and sort result", complexity: "O((n+m)log(n+m))", isOptimal: false, explanation: "Ignores the fact that inputs are already sorted" },
          { text: "Use nested loops to place each element", complexity: "O(n*m)", isOptimal: false, explanation: "Quadratic complexity is unnecessary" }
        ],
        category: "sorting"
      },
      {
        scenario: "You need to reverse an array in-place.",
        options: [
          { text: "Swap elements from outside to center", complexity: "O(n), in-place", isOptimal: true, explanation: "Efficient in-place implementation" },
          { text: "Use array.reverse()", complexity: "O(n), in-place", isOptimal: true, explanation: "Built-in method that's optimized" },
          { text: "Create new reversed array with map/reduce", complexity: "O(n), extra memory", isOptimal: false, explanation: "Unnecessary memory usage" }
        ],
        category: "manipulation"
      },
      {
        scenario: "You need to implement a stack data structure.",
        options: [
          { text: "Use push() and pop()", complexity: "O(1) operations", isOptimal: true, explanation: "Both operations are constant time" },
          { text: "Use unshift() and shift()", complexity: "O(n) operations", isOptimal: false, explanation: "Both operations require reindexing elements" },
          { text: "Use a linked list implementation", complexity: "O(1) operations, extra overhead", isOptimal: false, explanation: "Unnecessary complexity for a simple stack" }
        ],
        category: "datastructure"
      }
    ]
  ];

  // Function to run benchmarks for different array methods
  const runBenchmark = () => {
    setRunningBenchmark(true);
    
    // Simulate delay for UI feedback
    setTimeout(() => {
      const results = {};
      const testSizes = [10000, 50000, 100000];
      
      // Test forEach vs for loop
      testSizes.forEach(size => {
        const testArray = generateLargeArray(size);
        
        // Benchmark for loop
        const forStart = performance.now();
        let forSum = 0;
        for (let i = 0; i < testArray.length; i++) {
          forSum += testArray[i];
        }
        const forEnd = performance.now();
        
        // Benchmark forEach
        const forEachStart = performance.now();
        let forEachSum = 0;
        testArray.forEach(item => {
          forEachSum += item;
        });
        const forEachEnd = performance.now();
        
        // Benchmark filter
        const filterStart = performance.now();
        const filtered = testArray.filter(item => item > 500);
        const filterEnd = performance.now();
        
        // Benchmark find
        const findStart = performance.now();
        const found = testArray.find(item => item === 500);
        const findEnd = performance.now();
        
        // Benchmark some
        const someStart = performance.now();
        const hasValue = testArray.some(item => item > 990);
        const someEnd = performance.now();
        
        // Benchmark includes
        const includesStart = performance.now();
        const includes = testArray.includes(500);
        const includesEnd = performance.now();
        
        results[size] = {
          forLoop: forEnd - forStart,
          forEach: forEachEnd - forEachStart,
          filter: filterEnd - filterStart,
          find: findEnd - findStart,
          some: someEnd - someStart,
          includes: includesEnd - includesStart
        };
      });
      
      setExecutionTime(results);
      renderChart(results[dataSize]);
      setRunningBenchmark(false);
    }, 500);
  };

  // Function to demonstrate memory usage difference
  const runMemoryDemo = () => {
    const size = 1_000_000;
    
    // Regular array memory usage (approximate calculation)
    const regularArray = new Array(size).fill(0);
    const regularArraySize = size * 8; // 8 bytes per number in a regular JS array (approximate)
    
    // TypedArray memory usage
    const typedArray = new Float64Array(size);
    const typedArraySize = size * 8; // 8 bytes per number in Float64Array
    
    setMemoryDemo({
      regular: regularArraySize / (1024 * 1024), // Convert to MB
      typed: typedArraySize / (1024 * 1024)
    });
  };

  // Draw chart for benchmark results
  const renderChart = (data) => {
    if (!chartRef.current || !data) return;
    
    const ctx = chartRef.current.getContext('2d');
    const labels = Object.keys(data);
    const values = Object.values(data);
    
    // Clear previous chart
    ctx.clearRect(0, 0, chartRef.current.width, chartRef.current.height);
    
    // Chart dimensions
    const chartWidth = chartRef.current.width - 60;
    const chartHeight = chartRef.current.height - 60;
    const barWidth = chartWidth / labels.length * 0.6;
    const spacing = chartWidth / labels.length * 0.4;
    const maxValue = Math.max(...values) * 1.1;
    
    // Draw axes
    ctx.beginPath();
    ctx.moveTo(30, 20);
    ctx.lineTo(30, 20 + chartHeight);
    ctx.lineTo(30 + chartWidth, 20 + chartHeight);
    ctx.stroke();
    
    // Draw bars
    values.forEach((value, index) => {
      const barHeight = (value / maxValue) * chartHeight;
      const x = 30 + (barWidth + spacing) * index;
      const y = 20 + chartHeight - barHeight;
      
      // Bar
      ctx.fillStyle = `hsl(${210 + index * 30}, 70%, 60%)`;
      ctx.fillRect(x, y, barWidth, barHeight);
      
      // Label
      ctx.fillStyle = "#333";
      ctx.font = "10px Arial";
      ctx.textAlign = "center";
      ctx.fillText(labels[index], x + barWidth / 2, 20 + chartHeight + 15);
      
      // Value
      ctx.fillText(value.toFixed(2) + "ms", x + barWidth / 2, y - 5);
    });
  };

  // Game functions
  const startGame = () => {
    // Create a pool of all questions by combining and flattening the arrays
    const allQuestions = [
      ...optimizationProblems[0], 
      ...optimizationProblems[1],
      ...optimizationProblems[2]
    ];
    
    // Make a copy to avoid modifying the original
    let questionPool = [...allQuestions];
    
    // Shuffle the entire pool
    questionPool.sort(() => Math.random() - 0.5);
    
    // If we don't have enough questions, duplicate some (should be rare given our expanded set)
    while (questionPool.length < 30) {
      // Add more shuffled questions if needed
      const extraQuestions = [...allQuestions].sort(() => Math.random() - 0.5);
      questionPool = [...questionPool, ...extraQuestions];
    }
    
    // Take exactly 30 questions - this ensures no duplicates in our game session
    const selectedQuestions = questionPool.slice(0, 30);
    
    // Store the selected questions for this game session
    setAllProblems(selectedQuestions);
    setGameActive(true);
    setCompletedProblems(0);
    setPoints(0);
    setTimeLeft(120); // 2 minutes
    setGameEnded(false);
    setCorrectAnswers(0);
    
    // Set first problem
    setCurrentProblem(selectedQuestions[0]);
    setGameOptions([...selectedQuestions[0].options].sort(() => Math.random() - 0.5));
    setSelectedOption(null);
    setShowResult(false);
    
    // Start timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          endGame();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const nextProblem = () => {
    // Get problems for current level (array index is level-1)
    const levelProblems = optimizationProblems[gameLevel - 1];
    
    // Select random problem
    const problem = levelProblems[Math.floor(Math.random() * levelProblems.length)];
    
    // Set current problem and shuffle options
    setCurrentProblem(problem);
    setGameOptions([...problem.options].sort(() => Math.random() - 0.5));
    setSelectedOption(null);
    setShowResult(false);
  };

  const selectOption = (index) => {
    if (showResult) return;
    
    setSelectedOption(index);
    setShowResult(true);
    
    const selected = gameOptions[index];
    const isCorrect = selected.isOptimal;
    
    setLastResult({
      isCorrect,
      explanation: selected.explanation
    });
    
    // Handle correct/incorrect answer with points and time adjustments
    if (isCorrect) {
      // Add 10 points for correct answer
      setPoints(prevPoints => prevPoints + 10);
      // Add 10 seconds for correct answer
      setTimeLeft(time => Math.min(time + 10, 120)); // Cap at 2 minutes max
      setCorrectAnswers(prev => prev + 1);
    } else {
      // Deduct 15 seconds for wrong answers
      setTimeLeft(time => Math.max(0, time - 15));
    }
    
    // After a delay, move to next problem
    setTimeout(() => {
      const nextProblemCount = completedProblems + 1;
      setCompletedProblems(nextProblemCount);
      
      if (nextProblemCount >= 30) {
        // End game when all problems are completed
        endGame();
      } else {
        // Move to next problem - using the pre-selected array ensures no repeats
        const nextProblem = allProblems[nextProblemCount];
        setCurrentProblem(nextProblem);
        setGameOptions([...nextProblem.options].sort(() => Math.random() - 0.5));
        setSelectedOption(null);
        setShowResult(false);
      }
    }, 2000);
  };

  const endGame = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setGameEnded(true);
  };

  // Run memory demo on component mount
  useEffect(() => {
    runMemoryDemo();
    
    // Run initial benchmark if tab is complexity
    if (activeTab === 'complexity' && !Object.keys(executionTime).length) {
      runBenchmark();
    }
    
    // Load high score from localStorage
    const savedHighScore = localStorage.getItem('arrayOptimizerHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
    
    // Cleanup timer on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Update chart when execution time or active tab changes
  useEffect(() => {
    if (activeTab === 'complexity' && Object.keys(executionTime).length && executionTime[dataSize]) {
      renderChart(executionTime[dataSize]);
    }
  }, [executionTime, activeTab, dataSize]);

  return (
    <div className="p-4 bg-gradient-to-b from-blue-50 to-white">
      <h2 className="text-2xl font-bold text-blue-700 mb-2">
        <FaRocket className="inline-block mr-2" /> 
        Optimizing Array Performance for Large Datasets
      </h2>
      
      <p className="text-gray-600 mb-6">
        As your data grows, optimizing how you work with arrays becomes increasingly important.
        This guide explores techniques to make your array operations faster and more memory-efficient.
      </p>
      
      {/* Main content tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('complexity')}
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === 'complexity' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FaChartLine className="inline-block mr-1" /> Time Complexity
          </button>
          <button
            onClick={() => setActiveTab('memory')}
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === 'memory' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FaMemory className="inline-block mr-1" /> Memory Optimization
          </button>
          <button
            onClick={() => setActiveTab('game')}
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === 'game' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FaGamepad className="inline-block mr-1" /> Array Optimizer Game
          </button>
        </nav>
      </div>
      
      {/* Time complexity content */}
      {activeTab === 'complexity' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Understanding Time Complexity
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Common Complexities:</h4>
                <div className="space-y-2">
                  <div className="flex items-center bg-green-50 p-2 rounded">
                    <div className="w-20 font-mono text-green-600">O(1)</div>
                    <div>Constant time - Direct access, not affected by size</div>
                  </div>
                  <div className="flex items-center bg-green-50 p-2 rounded">
                    <div className="w-20 font-mono text-green-600">O(log n)</div>
                    <div>Logarithmic - Binary search in sorted arrays</div>
                  </div>
                  <div className="flex items-center bg-yellow-50 p-2 rounded">
                    <div className="w-20 font-mono text-yellow-600">O(n)</div>
                    <div>Linear - Single loop through array</div>
                  </div>
                  <div className="flex items-center bg-orange-50 p-2 rounded">
                    <div className="w-20 font-mono text-orange-600">O(n log n)</div>
                    <div>Linearithmic - Efficient sorting algorithms</div>
                  </div>
                  <div className="flex items-center bg-red-50 p-2 rounded">
                    <div className="w-20 font-mono text-red-600">O(n²)</div>
                    <div>Quadratic - Nested loops, inefficient sorting</div>
                  </div>
                </div>
              </div>
            
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h4 className="font-medium text-blue-800 mb-2">Time-efficient Array Methods</h4>
                <ul className="space-y-1 text-blue-700 text-sm">
                  <li>
                    <span className="font-mono bg-blue-100 px-1 rounded">find()</span> & 
                    <span className="font-mono bg-blue-100 px-1 rounded">some()</span>: 
                    Short-circuit when match is found
                  </li>
                  <li>
                    <span className="font-mono bg-blue-100 px-1 rounded">includes()</span>: 
                    Often faster than manual loops for simple lookups
                  </li>
                  <li>
                    <span className="font-mono bg-blue-100 px-1 rounded">Set</span> for O(1) lookups 
                    when checking for existence
                  </li>
                  <li>
                    <span className="font-mono bg-blue-100 px-1 rounded">for</span> loop is faster than 
                    <span className="font-mono bg-blue-100 px-1 rounded">forEach()</span> for simple operations
                  </li>
                  <li>
                    Avoid nested loops when possible (O(n²) complexity)
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-5">
              <h4 className="font-medium text-gray-700 mb-3">Method Performance Benchmark</h4>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <label className="text-sm text-gray-600 mr-2">
                    Array Size:
                  </label>
                  <select
                    value={dataSize}
                    onChange={e => setDataSize(Number(e.target.value))}
                    className="border rounded-md px-2 py-1 text-sm"
                    disabled={runningBenchmark}
                  >
                    <option value={10000}>10,000 elements</option>
                    <option value={50000}>50,000 elements</option>
                    <option value={100000}>100,000 elements</option>
                  </select>
                </div>
                
                <button
                  onClick={runBenchmark}
                  disabled={runningBenchmark}
                  className={`px-3 py-1 rounded-md text-sm ${
                    runningBenchmark 
                      ? 'bg-gray-200 text-gray-500' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {runningBenchmark ? 'Running...' : 'Run Benchmark'}
                </button>
              </div>
              
              <div className="border rounded-lg bg-gray-50 p-2">
                <canvas 
                  ref={chartRef} 
                  width={600} 
                  height={250}
                  className="w-full"
                />
                
                {Object.keys(executionTime).length === 0 && (
                  <div className="h-[250px] flex items-center justify-center text-gray-500">
                    {runningBenchmark ? 'Running benchmark...' : 'No benchmark data yet'}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Efficient Array Access Patterns
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-red-50 border-l-4 border-red-400 p-3">
                <h4 className="font-medium text-red-700">Inefficient Pattern</h4>
                <pre className="bg-white p-2 mt-1 rounded text-sm overflow-auto">
{`// O(n²) complexity - avoid when possible
const results = [];
for (let i = 0; i < array.length; i++) {
  for (let j = 0; j < array.length; j++) {
    if (array[i] + array[j] === 10) {
      results.push([i, j]);
    }
  }
}`}
                </pre>
              </div>
              
              <div className="bg-green-50 border-l-4 border-green-400 p-3">
                <h4 className="font-medium text-green-700">Efficient Alternative</h4>
                <pre className="bg-white p-2 mt-1 rounded text-sm overflow-auto">
{`// O(n) complexity using hash map
const results = [];
const complements = {};
for (let i = 0; i < array.length; i++) {
  const complement = 10 - array[i];
  if (complements[complement] !== undefined) {
    results.push([complements[complement], i]);
  }
  complements[array[i]] = i;
}`}
                </pre>
              </div>
            </div>
            
            <div className="mt-4 bg-blue-50 p-4 rounded-md">
              <h4 className="font-medium text-blue-700 flex items-center">
                <FaLightbulb className="text-yellow-500 mr-2" /> Pro Tips
              </h4>
              <ul className="mt-2 space-y-2 text-blue-800">
                <li>
                  <strong>Early returns:</strong> Exit loops as soon as you have your answer
                </li>
                <li>
                  <strong>Avoid recalculating:</strong> Cache values you'll use repeatedly
                </li>
                <li>
                  <strong>Use appropriate data structures:</strong> Maps for key-value lookups, Sets for unique values
                </li>
                <li>
                  <strong>Binary search:</strong> On sorted arrays, binary search is O(log n) vs O(n) for linear search
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
      
      {/* Memory optimization content */}
      {activeTab === 'memory' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Memory Efficient Array Patterns
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Mutation Pitfalls</h4>
                <div className="space-y-3">
                  <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
                    <p className="text-yellow-800 font-medium mb-2">
                      Problem with Array References
                    </p>
                    <pre className="bg-white p-2 rounded text-sm overflow-auto">
{`const original = [1, 2, 3];
const copy = original; // Not a copy!
copy.push(4);
console.log(original); // [1, 2, 3, 4]`}
                    </pre>
                  </div>
                  
                  <div className="bg-green-50 p-3 rounded-md border border-green-200">
                    <p className="text-green-800 font-medium mb-2">
                      Creating True Copies
                    </p>
                    <pre className="bg-white p-2 rounded text-sm overflow-auto">
{`// Shallow copies:
const copy1 = [...original];
const copy2 = original.slice();
const copy3 = Array.from(original);

// Deep copy (for nested arrays)
const deepCopy = JSON.parse(
  JSON.stringify(original)
);`}
                    </pre>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-medium text-gray-700 mb-2">Reusing Arrays</h4>
                  <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                    <p className="text-blue-800 font-medium mb-2">
                      Update in-place when possible:
                    </p>
                    <pre className="bg-white p-2 rounded text-sm overflow-auto">
{`// Avoid: creating a new array
let newArr = arr.map(x => x * 2);

// Better: reusing existing array
for (let i = 0; i < arr.length; i++) {
  arr[i] = arr[i] * 2;
}`}
                    </pre>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2">TypedArrays for Numeric Data</h4>
                <div className="bg-indigo-50 p-3 rounded-md border border-indigo-200 mb-4">
                  <p className="text-indigo-800 font-medium mb-2">
                    Why use TypedArrays?
                  </p>
                  <ul className="list-disc ml-5 text-indigo-700 space-y-1">
                    <li>More memory-efficient for numeric data</li>
                    <li>Fixed-size, contiguous memory allocation</li>
                    <li>Faster operations for numeric calculations</li>
                    <li>Better performance for WebGL and Canvas operations</li>
                  </ul>
                </div>
                
                <div className="bg-indigo-50 p-3 rounded-md border border-indigo-200">
                  <p className="text-indigo-800 font-medium mb-2">
                    Available TypedArrays:
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-white p-1 rounded">Int8Array</div>
                    <div className="bg-white p-1 rounded">Uint8Array</div>
                    <div className="bg-white p-1 rounded">Int16Array</div>
                    <div className="bg-white p-1 rounded">Uint16Array</div>
                    <div className="bg-white p-1 rounded">Int32Array</div>
                    <div className="bg-white p-1 rounded">Uint32Array</div>
                    <div className="bg-white p-1 rounded">Float32Array</div>
                    <div className="bg-white p-1 rounded">Float64Array</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-5">
              <h4 className="font-medium text-gray-700 mb-3">Memory Usage Comparison</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border rounded-md p-4">
                  <div className="text-center mb-2">Regular Array</div>
                  <div className="bg-gray-100 w-full h-6 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-500 h-full" 
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                  <div className="text-center mt-2 text-sm">
                    {memoryDemo.regular.toFixed(2)} MB
                  </div>
                  <div className="text-gray-500 text-xs text-center mt-1">
                    JavaScript objects with full object overhead
                  </div>
                </div>
                
                <div className="bg-white border rounded-md p-4">
                  <div className="text-center mb-2">TypedArray (Float64Array)</div>
                  <div className="bg-gray-100 w-full h-6 rounded-full overflow-hidden">
                    <div 
                      className="bg-green-500 h-full" 
                      style={{ width: `${(memoryDemo.typed / memoryDemo.regular) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-center mt-2 text-sm">
                    {memoryDemo.typed.toFixed(2)} MB
                  </div>
                  <div className="text-gray-500 text-xs text-center mt-1">
                    Raw binary data with minimal overhead
                  </div>
                </div>
              </div>
              
              <div className="mt-4 bg-gray-50 p-4 rounded-md border">
                <h5 className="font-medium mb-2">TypedArray Example</h5>
                <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-auto">
{`// Create a typed array with 1 million elements
const floatArray = new Float64Array(1_000_000);

// Set values
for (let i = 0; i < floatArray.length; i++) {
  floatArray[i] = Math.random() * 100;
}

// Perform calculations directly
let sum = 0;
for (let i = 0; i < floatArray.length; i++) {
  sum += floatArray[i];
}

console.log("Average:", sum / floatArray.length);`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Game content */}
      {activeTab === 'game' && (
        <div className="bg-white p-5 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-indigo-700 mb-3 flex items-center">
            <FaGamepad className="mr-2 text-indigo-600" /> Array Battle Arena
          </h3>
          
          {!gameActive ? (
            <div className="text-center py-6 relative">
              {/* Game splash screen with animated background */}
              <div className="absolute inset-0 overflow-hidden opacity-10 z-0">
                <div className="animate-pulse absolute top-10 left-10 w-20 h-20 bg-blue-500 rounded-full"></div>
                <div className="animate-pulse absolute top-40 left-40 w-16 h-16 bg-green-500 rounded-full delay-300"></div>
                <div className="animate-pulse absolute top-20 right-20 w-24 h-24 bg-yellow-500 rounded-full delay-500"></div>
                <div className="animate-pulse absolute bottom-20 right-30 w-20 h-20 bg-pink-500 rounded-full delay-700"></div>
                <div className="animate-pulse absolute bottom-30 left-20 w-16 h-16 bg-purple-500 rounded-full delay-1000"></div>
              </div>

              <div className="relative z-10">
                <div className="mb-4 transform hover:scale-110 transition-transform inline-block">
                  <div className="relative">
                    <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6 rounded-full w-24 h-24 flex items-center justify-center shadow-lg">
                      <FaBolt className="text-4xl animate-pulse" />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-yellow-400 text-xs font-bold text-indigo-900 rounded-full w-8 h-8 flex items-center justify-center border-2 border-white shadow-md">
                      {highScore > 0 ? Math.floor(highScore / 10) : 'LV1'}
                    </div>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 mb-2">ARRAY BATTLE ARENA</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  Master the art of array optimization! Battle against inefficient code and earn points by selecting the most optimized solutions.
                </p>
                
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-lg max-w-md mx-auto mb-6 shadow-inner">
                  <h4 className="font-medium text-indigo-700 mb-2">Battle Instructions:</h4>
                  <ul className="text-left text-indigo-600 space-y-2 text-sm">
                    <li className="flex items-start">
                      <div className="bg-indigo-200 rounded-full w-6 h-6 flex items-center justify-center text-indigo-700 mr-2 flex-shrink-0">1</div> 
                      <span>Answer 30 optimization challenges as fast as you can</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-indigo-300 rounded-full w-6 h-6 flex items-center justify-center text-indigo-700 mr-2 flex-shrink-0">2</div> 
                      <span>You start with 2 minutes on the clock</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-indigo-400 rounded-full w-6 h-6 flex items-center justify-center text-indigo-100 mr-2 flex-shrink-0">3</div> 
                      <span>Each wrong answer deducts 10 seconds</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-indigo-500 rounded-full w-6 h-6 flex items-center justify-center text-indigo-100 mr-2 flex-shrink-0">4</div> 
                      <span>Earn points for each correct answer</span>
                    </li>
                  </ul>
                </div>
                
                <button
                  onClick={startGame}
                  className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-8 py-3 rounded-md font-bold text-lg transition shadow-md hover:shadow-lg group"
                >
                  <span className="relative z-10">ENTER BATTLE</span>
                  <span className="absolute inset-0 h-full w-full scale-0 rounded-md transition-all duration-300 group-hover:scale-100 group-hover:bg-white/10"></span>
                </button>
              </div>
            </div>
          ) : gameEnded ? (
            <div className="text-center py-8 max-w-md mx-auto relative">
              <div className="absolute inset-0 overflow-hidden opacity-10 z-0">
                {/* Background animation elements */}
                {Array.from({length: 20}).map((_, i) => (
                  <div 
                    key={i} 
                    className="absolute w-3 h-3 rounded-full animate-float"
                    style={{
                      backgroundColor: ['#FF6B6B', '#4ECDC4', '#FFD166', '#6A0572'][Math.floor(Math.random() * 4)],
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animationDuration: `${Math.random() * 3 + 2}s`,
                      animationDelay: `${Math.random() * 2}s`
                    }}
                  ></div>
                ))}
              </div>
              
              <div className="relative z-10">
                <div className="mb-6">
                  <div className="inline-block rounded-full p-5 bg-indigo-100">
                    <div className="text-6xl">{completedProblems >= 30 ? '🏆' : '🛡️'}</div>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold mb-3 text-indigo-800">
                  {completedProblems >= 30 ? 'Battle Complete!' : 'Battle Ended'}
                </h3>
                
                <div className="grid grid-cols-3 gap-2 mb-6 bg-indigo-50 p-4 rounded-lg shadow-inner">
                  <div>
                    <div className="text-gray-500 text-xs uppercase">Completed</div>
                    <div className="text-xl font-semibold text-indigo-700">{completedProblems} / 30</div>
                    <div className="text-xs text-gray-500">
                      challenges
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-gray-500 text-xs uppercase">Points</div>
                    <div className="text-xl font-semibold text-indigo-700">
                      {points}
                    </div>
                    <div className="text-xs text-gray-500">
                      earned
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-gray-500 text-xs uppercase">Accuracy</div>
                    <div className="text-xl font-semibold text-indigo-700">
                      {completedProblems > 0 ? Math.round((correctAnswers / completedProblems) * 100) : 0}%
                    </div>
                    <div className="text-xs text-gray-500">
                      Success rate
                    </div>
                  </div>
                </div>
                
                {timeLeft <= 0 && completedProblems < 30 && (
                  <div className="bg-orange-100 border border-orange-200 text-orange-800 p-3 rounded-md mb-6">
                    <div className="font-bold">Out of time!</div>
                    <div>You completed {completedProblems} out of 30 challenges</div>
                  </div>
                )}
                
                {completedProblems === 30 && (
                  <div className="bg-green-100 border border-green-200 text-green-800 p-3 rounded-md mb-6 animate-pulse">
                    <div className="font-bold">Perfect Completion!</div>
                    <div>You answered all 30 challenges with {timeLeft}s to spare!</div>
                  </div>
                )}
                
                <div className="flex justify-center space-x-3">
                  <button
                    onClick={startGame}
                    className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-5 py-2 rounded-md font-medium transition"
                  >
                    Battle Again
                  </button>
                  
                  <button
                    onClick={() => setGameActive(false)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-md font-medium transition"
                  >
                    Main Menu
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative">
              {/* Animated background for battle arena */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-blue-50 opacity-50 z-0 overflow-hidden">
                <div className="absolute top-10 left-10 w-16 h-16 rounded-full bg-indigo-200 opacity-30 animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-20 h-20 rounded-full bg-blue-200 opacity-40 animate-pulse delay-700"></div>
              </div>

              {/* Game UI header */}
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-4">
                  <div className="bg-gradient-to-r from-indigo-100 to-indigo-200 px-4 py-2 rounded-md shadow-inner">
                    <div className="text-xs text-indigo-700 font-semibold uppercase">Question</div>
                    <div className="flex items-center">
                      <span className="font-bold text-xl text-indigo-800">{completedProblems + 1}</span>
                      <span className="text-indigo-400 ml-1">/30</span>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 px-4 py-2 rounded-md shadow-inner relative">
                    <div className="text-xs text-yellow-700 font-semibold uppercase">Points</div>
                    <div className="font-bold text-xl text-yellow-800">
                      {points}
                      {lastResult?.isCorrect && (
                        <span className="absolute -right-2 -top-2 text-sm bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center animate-bounce">
                          +10
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className={`px-4 py-2 rounded-md shadow-inner relative ${
                    timeLeft <= 30 
                      ? 'bg-gradient-to-r from-red-100 to-red-200 animate-pulse' 
                      : 'bg-gradient-to-r from-blue-100 to-blue-200'
                  }`}>
                    <div className="text-xs text-gray-700 font-semibold uppercase">Time</div>
                    <div className={`font-bold text-xl ${
                      timeLeft <= 30 ? 'text-red-600' : 'text-blue-700'
                    }`}>
                      <FaClock className="inline-block mr-1" />
                      {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                      {showResult && (
                        <span className={`absolute -right-2 -top-2 text-xs w-8 h-8 flex items-center justify-center rounded-full ${
                          lastResult?.isCorrect 
                            ? 'bg-blue-500 text-white animate-bounce' 
                            : 'bg-red-500 text-white animate-pulse'
                        }`}>
                          {lastResult?.isCorrect ? '+10s' : '-15s'}
                        </span>
                      )}
                    </div>
                    
                    {/* Time bar */}
                    <div className="absolute bottom-0 left-0 h-1 bg-blue-400" style={{
                      width: `${(timeLeft / 120) * 100}%`,
                      transition: 'width 1s linear'
                    }}></div>
                  </div>
                </div>
                
                {/* Battle screen */}
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-5 rounded-lg mb-4 shadow-md relative overflow-hidden">
                  {/* Challenge title with thematic icon */}
                  <div className="flex items-center mb-4">
                    <div className="p-2 rounded-full mr-3 bg-blue-100 text-blue-700">
                      {currentProblem?.category === 'search' ? <FaSearch className="text-xl" /> :
                       currentProblem?.category === 'memory' ? <FaMemory className="text-xl" /> :
                       currentProblem?.category === 'sorting' ? <FaSort className="text-xl" /> : 
                       <FaChartLine className="text-xl" />}
                    </div>
                    <h4 className="font-bold text-lg text-blue-800">
                      {currentProblem?.category === 'search' ? 'Search Optimization' :
                       currentProblem?.category === 'memory' ? 'Memory Management' :
                       currentProblem?.category === 'sorting' ? 'Sorting Battle' : 
                       'Code Optimization'}
                    </h4>
                  </div>
                  
                  <div className="p-4 mb-4 rounded-md bg-white bg-opacity-70">
                    <p className="text-gray-800 font-medium">
                      {currentProblem?.scenario}
                    </p>
                  </div>
                  
                  <div className="text-sm font-semibold mb-3 flex items-center">
                    <span className="text-blue-700">
                      Select your battle strategy:
                    </span>
                    {timeLeft <= 30 && !showResult && (
                      <span className="ml-2 text-red-600 text-xs animate-pulse">
                        Hurry! Time running out!
                      </span>
                    )}
                  </div>
                  
                  {/* Options as battle cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {gameOptions.map((option, index) => (
                      <div
                        key={index}
                        onClick={() => !showResult && selectOption(index)}
                        className={`relative cursor-pointer transform transition-all border-2 p-3 rounded-md ${
                          showResult && selectedOption === index
                            ? option.isOptimal
                              ? 'border-green-400 bg-green-50 scale-105 shadow-md'
                              : 'border-red-400 bg-red-50'
                            : showResult
                              ? 'border-transparent bg-white bg-opacity-60 hover:bg-opacity-80'
                              : 'border-transparent bg-white bg-opacity-80 hover:bg-opacity-100 hover:scale-102 hover:shadow-sm'
                        }`}
                      >
                        {/* Card content */}
                        <div className="font-medium mb-1">
                          {option.text}
                        </div>
                        
                        <div className={`text-xs inline-block px-2 py-0.5 rounded-full ${
                          option.complexity.includes('O(1)') ? 'bg-green-100 text-green-700' :
                          option.complexity.includes('O(n)') && !option.complexity.includes('O(n²)') ? 'bg-yellow-100 text-yellow-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {option.complexity}
                        </div>
                        
                        {/* Result overlay - updated to show correct time adjustments */}
                        {showResult && selectedOption === index && (
                          <div className={`absolute inset-0 flex flex-col justify-center items-center rounded-md bg-opacity-90 ${
                            option.isOptimal ? 'bg-green-50' : 'bg-red-50'
                          }`}>
                            <div className={`text-4xl mb-2 ${option.isOptimal ? 'text-green-500' : 'text-red-500'}`}>
                              {option.isOptimal ? '✓' : '✗'}
                            </div>
                            <div className={`text-sm text-center px-4 mb-1 ${
                              option.isOptimal ? 'text-green-700' : 'text-red-700'
                            }`}>
                              {option.explanation}
                            </div>
                            
                            {/* Show point and time changes */}
                            <div className="flex items-center justify-center space-x-2 mt-1">
                              {option.isOptimal ? (
                                <>
                                  <span className="text-green-600 text-xs font-bold bg-green-100 px-2 py-0.5 rounded-full">
                                    +10 points
                                  </span>
                                  <span className="text-blue-600 text-xs font-bold bg-blue-100 px-2 py-0.5 rounded-full">
                                    +10 sec
                                  </span>
                                </>
                              ) : (
                                <span className="text-red-600 text-xs font-bold bg-red-100 px-2 py-0.5 rounded-full animate-pulse">
                                  -15 sec
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Highlight optimal solution after selection */}
                        {showResult && option.isOptimal && selectedOption !== index && (
                          <div className="absolute top-1 right-1">
                            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Game progress bar */}
                <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden mb-2">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      gameLevel === 1 
                        ? 'bg-indigo-500' 
                        : gameLevel === 2 
                          ? 'bg-purple-500' 
                          : 'bg-red-500'
                    }`}
                    style={{ width: `${(gameScore % (gameLevel * 30)) / (gameLevel * 30) * 100}%` }}
                  ></div>
                  
                  {/* Level up indicator */}
                  {gameLevel < 3 && (
                    <div className="absolute top-0 right-0 bottom-0 border-l-2 border-yellow-400 border-dashed" style={{
                      left: `${100 - (100 / gameLevel)}%`
                    }}>
                      <div className="absolute -right-3 -top-1 text-xs text-yellow-800 font-bold">
                        LV{gameLevel + 1}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="text-xs text-gray-500 text-right">
                  {gameLevel < 3 ? `Next level: ${gameScore % (gameLevel * 30)}/${gameLevel * 30} points` : 'Final level'}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Quick reference guide */}
      <div className="mt-6 bg-gradient-to-r from-indigo-50 to-blue-50 p-5 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-indigo-800 mb-3">
          Performance Quick Reference
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-indigo-700 mb-2">Time Complexity Best Practices</h4>
            <ul className="space-y-1 text-indigo-600">
              <li className="flex items-center">
                <FaCheck className="text-green-500 mr-1" /> Use Set or Object for O(1) lookups
              </li>
              <li className="flex items-center">
                <FaCheck className="text-green-500 mr-1" /> Return early from loops when possible
              </li>
              <li className="flex items-center">
                <FaCheck className="text-green-500 mr-1" /> Binary search for sorted data
              </li>
              <li className="flex items-center">
                <FaCheck className="text-green-500 mr-1" /> Cache calculated values
              </li>
              <li className="flex items-center">
                <FaTimes className="text-red-500 mr-1" /> Avoid unnecessary nested loops
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-indigo-700 mb-2">Memory Optimization Best Practices</h4>
            <ul className="space-y-1 text-indigo-600">
              <li className="flex items-center">
                <FaCheck className="text-green-500 mr-1" /> Use TypedArrays for numeric data
              </li>
              <li className="flex items-center">
                <FaCheck className="text-green-500 mr-1" /> Update arrays in-place when possible
              </li>
              <li className="flex items-center">
                <FaCheck className="text-green-500 mr-1" /> Properly clone arrays to avoid mutations
              </li>
              <li className="flex items-center">
                <FaCheck className="text-green-500 mr-1" /> Preallocate arrays with known size
              </li>
              <li className="flex items-center">
                <FaTimes className="text-red-500 mr-1" /> Avoid excessive array copies and concatenations
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slide5;
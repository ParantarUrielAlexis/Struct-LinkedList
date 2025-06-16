import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaGraduationCap, FaFolderOpen, FaBook, FaGlasses, 
  FaCode, FaStar, FaLightbulb, FaChevronRight, FaCheck,
  FaExternalLinkAlt, FaGithub, FaYoutube, FaTrophy, FaQuestion,
  FaMedal, FaGamepad, FaArrowRight, FaRegSmileBeam, FaRegSmile, FaRegMeh
} from 'react-icons/fa';

const Slide8 = () => {
  const [activeTab, setActiveTab] = useState('summary');
  const [expandedSection, setExpandedSection] = useState(null);
  const [completedItems, setCompletedItems] = useState([]);

  // Game states
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);

  // Toggle completion status of a checklist item
  const toggleCompletion = (itemId) => {
    if (completedItems.includes(itemId)) {
      setCompletedItems(completedItems.filter(id => id !== itemId));
    } else {
      setCompletedItems([...completedItems, itemId]);
    }
  };

  // Calculate completion percentage
  const calculateProgress = () => {
    const totalItems = checklistItems.length;
    return Math.round((completedItems.length / totalItems) * 100);
  };

  // Checklist items for self-assessment
  const checklistItems = [
    { id: 1, text: "I can create, modify, and manipulate arrays efficiently" },
    { id: 2, text: "I understand how to use advanced array methods (map, filter, reduce, etc.)" },
    { id: 3, text: "I can implement complex search operations on arrays" },
    { id: 4, text: "I can sort arrays using custom comparison functions" },
    { id: 5, text: "I understand how to work with multidimensional and nested arrays" },
    { id: 6, text: "I can apply array manipulation techniques to solve real-world problems" },
    { id: 7, text: "I know how to optimize array operations for better performance" },
    { id: 8, text: "I can choose the appropriate array method for specific tasks" }
  ];

  // Knowledge check quiz questions
  const quizQuestions = [
    {
      id: 1,
      question: "Which array method would be best for transforming each element into a new value?",
      options: [
        "forEach()",
        "map()",
        "filter()",
        "reduce()"
      ],
      correctIndex: 1,
      explanation: "map() creates a new array with the results of calling a function on every element in the calling array.",
      topic: "transformation"
    },
    {
      id: 2,
      question: "What's the output of: [1, 2, 3, 4, 5].filter(num => num % 2 === 0)?",
      options: [
        "[2, 4]",
        "[1, 3, 5]",
        "[false, true, false, true, false]",
        "2"
      ],
      correctIndex: 0,
      explanation: "filter() creates a new array with elements that pass the test. Only 2 and 4 are even numbers, so they're the only ones included.",
      topic: "filtering"
    },
    {
      id: 3,
      question: "Which statement about the sort() method is INCORRECT?",
      options: [
        "It modifies the original array in place",
        "It converts elements to strings by default",
        "It requires a comparison function for object sorting",
        "It always sorts in ascending order and cannot be reversed"
      ],
      correctIndex: 3,
      explanation: "sort() can easily be reversed by either writing a custom comparison function or by chaining reverse() after sorting.",
      topic: "sorting"
    },
    {
      id: 4,
      question: "To find the first element that meets a condition, which method is most appropriate?",
      options: [
        "indexOf()",
        "includes()",
        "find()",
        "some()"
      ],
      correctIndex: 2,
      explanation: "find() returns the first element in an array that satisfies the provided testing function.",
      topic: "searching"
    },
    {
      id: 5,
      question: "How would you access the value 'c' in this nested array: [['a', 'b'], ['c', 'd']]?",
      options: [
        "array[1][0]",
        "array[0][1]",
        "array[1, 0]",
        "array[0][2]"
      ],
      correctIndex: 0,
      explanation: "In nested arrays, you access elements using multiple bracket notations. [1][0] means the first element (index 0) of the second array (index 1).",
      topic: "nested arrays"
    },
    {
      id: 6,
      question: "Which method is best for calculating a single value from all elements in an array?",
      options: [
        "map()",
        "filter()",
        "reduce()",
        "forEach()"
      ],
      correctIndex: 2,
      explanation: "reduce() executes a reducer function on each element, resulting in a single output value.",
      topic: "aggregation"
    },
    {
      id: 7,
      question: "What's the most efficient way to check if ANY element in an array meets a condition?",
      options: [
        "Using a for loop with a break statement",
        "filter() then check length > 0",
        "some()",
        "find() then check if undefined"
      ],
      correctIndex: 2,
      explanation: "some() tests whether at least one element passes the test and stops as soon as it finds one, making it the most efficient option.",
      topic: "optimization"
    },
    {
      id: 8,
      question: "Which method would flatten this array [1, [2, [3, 4]]] into [1, 2, 3, 4]?",
      options: [
        "flatten()",
        "flat()",
        "spread()",
        "concat()"
      ],
      correctIndex: 1,
      explanation: "flat() creates a new array with all sub-array elements concatenated recursively up to the specified depth.",
      topic: "nested arrays"
    },
    {
      id: 9,
      question: "What's the result of [1, 2, 3].concat([4, 5])?",
      options: [
        "[1, 2, 3, 4, 5]",
        "[[1, 2, 3], [4, 5]]",
        "[1, 2, 3, [4, 5]]",
        "Error"
      ],
      correctIndex: 0,
      explanation: "concat() merges two or more arrays, returning a new array without modifying the existing ones.",
      topic: "modification"
    },
    {
      id: 10,
      question: "Which array method both maps and flattens in one operation?",
      options: [
        "mapFlat()",
        "flatMap()",
        "reduceMap()",
        "spreadMap()"
      ],
      correctIndex: 1,
      explanation: "flatMap() maps each element using a mapping function, then flattens the result into a new array.",
      topic: "transformation"
    }
  ];

  // Function to shuffle an array (Fisher-Yates algorithm)
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Start the quiz game
  const startGame = () => {
    setGameStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setGameComplete(false);
    
    // Randomly select and shuffle 5 questions
    const gameQuestions = shuffleArray(quizQuestions).slice(0, 5);
    setShuffledQuestions(gameQuestions);
  };

  // Handle answer selection
  const handleAnswerSelect = (index) => {
    if (showAnswer) return; // Prevent changing answer after reveal
    
    setSelectedAnswer(index);
    setShowAnswer(true);
    
    if (index === shuffledQuestions[currentQuestion].correctIndex) {
      setScore(score + 1);
    }
  };

  // Move to next question
  const nextQuestion = () => {
    if (currentQuestion < shuffledQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    } else {
      setGameComplete(true);
    }
  };

  // Reset the game
  const resetGame = () => {
    setGameStarted(false);
    setGameComplete(false);
  };

  // Get skill level text based on score
  const getSkillLevel = () => {
    const percentage = (score / shuffledQuestions.length) * 100;
    if (percentage >= 80) return "Array Master";
    if (percentage >= 60) return "Array Expert";
    if (percentage >= 40) return "Array Practitioner";
    return "Array Novice";
  };

  // Get emoji for score
  const getScoreEmoji = () => {
    const percentage = (score / shuffledQuestions.length) * 100;
    if (percentage >= 80) return <FaRegSmileBeam className="text-yellow-500" />;
    if (percentage >= 50) return <FaRegSmile className="text-blue-500" />;
    return <FaRegMeh className="text-gray-500" />;
  };

  // Key takeaways from each previous slide
  const slideTakeaways = [
    {
      id: 1,
      title: "Introduction to Advanced Array Manipulation",
      key: "fundamentals",
      points: [
        "Arrays are versatile data structures that store ordered collections",
        "JavaScript provides numerous built-in methods for array manipulation",
        "Understanding array methods improves code efficiency and readability"
      ]
    },
    {
      id: 2,
      title: "Complex Modification - Adding and Removing Elements",
      key: "modification",
      points: [
        "splice() can add, remove, and replace elements at any position",
        "Understanding array mutability vs. immutability is crucial",
        "Efficient element manipulation preserves data integrity"
      ]
    },
    {
      id: 3,
      title: "Transforming Arrays - Functional Programming Techniques",
      key: "transformation",
      points: [
        "map() transforms each element without mutating the original array",
        "filter() creates a new array with elements meeting specific conditions",
        "reduce() is powerful for aggregating array data into a single value"
      ]
    },
    {
      id: 4,
      title: "Searching and Extraction Techniques",
      key: "searching",
      points: [
        "find() returns the first element matching a condition",
        "some() and every() test if elements meet certain criteria",
        "includes() checks for specific values in an array"
      ]
    },
    {
      id: 5,
      title: "Sorting and Recording Arrays Efficiently",
      key: "sorting",
      points: [
        "sort() arranges elements based on a comparison function",
        "Custom sorting enables complex data organization",
        "Proper sorting can significantly improve search operations"
      ]
    },
    {
      id: 6,
      title: "Working with Multidimensional Arrays & Nested Data",
      key: "nested",
      points: [
        "Multidimensional arrays represent complex data structures",
        "Nested array operations require careful indexing",
        "Methods like flat() and flatMap() help with nested array manipulation"
      ]
    },
    {
      id: 7,
      title: "Array Best Practices",
      key: "practices",
      points: [
        "Choose array methods that clearly express your intent",
        "Avoid unnecessary array copies and mutations",
        "Consider performance implications when working with large arrays"
      ]
    }
  ];

  return (
    <div className="p-4 bg-gradient-to-b from-blue-50 to-white">
      <h2 className="text-2xl font-bold text-blue-800 mb-2">
        Conclusion and Learning Takeaways
      </h2>

      <p className="text-gray-600 mb-6">
        Congratulations on completing the Advanced Array Manipulation module! Let's review what you've learned and test your knowledge.
      </p>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('summary')}
            className={`py-2 px-4 font-medium text-sm flex items-center ${
              activeTab === 'summary' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FaGlasses className="mr-2" /> Module Summary
          </button>
          
        </nav>
      </div>
      
      {/* Module Summary Tab */}
      {activeTab === 'summary' && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <div className="bg-white p-5 rounded-lg shadow-sm border overflow-hidden">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <FaGlasses className="mr-2 text-blue-600" /> 
              Key Takeaways
            </h3>
            
            <div className="space-y-4">
              {slideTakeaways.map(slide => (
                <div key={slide.id} className="border rounded-md overflow-hidden">
                  <button 
                    onClick={() => setExpandedSection(expandedSection === slide.key ? null : slide.key)}
                    className="w-full text-left px-4 py-3 flex justify-between items-center hover:bg-gray-50"
                  >
                    <div className="font-medium text-gray-800">
                      {slide.title}
                    </div>
                    <FaChevronRight className={`text-gray-400 transform transition-transform ${
                      expandedSection === slide.key ? 'rotate-90' : ''
                    }`} />
                  </button>
                  
                  {expandedSection === slide.key && (
                    <div className="bg-blue-50 p-4 border-t">
                      <ul className="space-y-2">
                        {slide.points.map((point, idx) => (
                          <li key={idx} className="flex">
                            <FaCheck className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
                            <span className="text-blue-800">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-5 p-4 bg-yellow-50 rounded-md border border-yellow-200">
              <h4 className="font-medium text-yellow-800 mb-2 flex items-center">
                <FaLightbulb className="mr-2 text-yellow-600" /> 
                Remember
              </h4>
              <p className="text-yellow-700">
                Array manipulation is foundational to modern JavaScript development. The methods and techniques you've learned will help you write more efficient, readable, and maintainable code for data processing tasks.
              </p>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-lg shadow-sm border overflow-hidden">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Connection to Real-World Applications
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-md p-4 bg-gradient-to-br from-blue-50 to-blue-100">
                <h4 className="font-medium text-blue-800 mb-2">Web Development</h4>
                <p className="text-blue-700 text-sm">
                  Manage UI state, process API responses, and handle user data efficiently with array methods.
                </p>
              </div>
              
              <div className="border rounded-md p-4 bg-gradient-to-br from-green-50 to-green-100">
                <h4 className="font-medium text-green-800 mb-2">Data Analysis</h4>
                <p className="text-green-700 text-sm">
                  Transform, filter, and aggregate datasets to extract meaningful insights and visualizations.
                </p>
              </div>
              
              <div className="border rounded-md p-4 bg-gradient-to-br from-purple-50 to-purple-100">
                <h4 className="font-medium text-purple-800 mb-2">Machine Learning</h4>
                <p className="text-purple-700 text-sm">
                  Preprocess training data, manipulate feature vectors, and prepare inputs for ML models.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
      
      
    </div>
  );
};

export default Slide8;
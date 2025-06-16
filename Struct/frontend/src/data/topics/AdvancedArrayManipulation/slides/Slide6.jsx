import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FaLayerGroup, FaCode, FaChevronRight, FaChevronDown, FaTree, FaExpandAlt, FaCube, FaCubes, FaProjectDiagram, FaGamepad, FaTrophy, FaStar, FaArrowRight, FaRedo, FaLightbulb } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Slide6 = () => {
  const [activeTab, setActiveTab] = useState('accessing');
  const [expandedExample, setExpandedExample] = useState(null);
  const [showOutput, setShowOutput] = useState({});
  const outputRef = useRef(null);
  const [gameActive, setGameActive] = useState(false);
  const [gameLevel, setGameLevel] = useState(1);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [gameInput, setGameInput] = useState('');
  const [gameOutput, setGameOutput] = useState(null);
  const [gameError, setGameError] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [gameStats, setGameStats] = useState({
    level: 1,
    solved: 0,
    attempts: 0,
    hintsUsed: 0
  });
  const [gameCompleted, setGameCompleted] = useState(false);

  // Sample nested data
  const nestedArray = [
    [1, 2, [3, 4]],
    [5, [6, [7, 8]]],
    9,
    [[10, 11], 12]
  ];

  // Sample tree data for visualization
  const folderStructure = {
    name: 'project',
    type: 'folder',
    children: [
      {
        name: 'src',
        type: 'folder',
        children: [
          {
            name: 'components',
            type: 'folder',
            children: [
              { name: 'Header.js', type: 'file' },
              { name: 'Footer.js', type: 'file' }
            ]
          },
          { name: 'App.js', type: 'file' }
        ]
      },
      {
        name: 'public',
        type: 'folder',
        children: [
          { name: 'index.html', type: 'file' },
          { name: 'styles.css', type: 'file' }
        ]
      }
    ]
  };

  // Code examples
  const examples = {
    accessing: [
      {
        id: 'basic',
        title: 'Basic Access',
        code: `const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

// Access an element (row 1, column 2)
const element = matrix[1][2]; // 6

// Access an entire row
const secondRow = matrix[1]; // [4, 5, 6]

// Modify an element
matrix[0][1] = 20; // matrix becomes [[1, 20, 3], [4, 5, 6], [7, 8, 9]]`,
        output: `element: 6
secondRow: [4, 5, 6]
matrix after modification: [[1, 20, 3], [4, 5, 6], [7, 8, 9]]`
      },
      {
        id: 'deepnested',
        title: 'Deep Nesting Access',
        code: `const deepArray = [1, [2, [3, [4, 5]]]];

// Accessing deeply nested elements
const value1 = deepArray[1]; // [2, [3, [4, 5]]]
const value2 = deepArray[1][1]; // [3, [4, 5]]
const value3 = deepArray[1][1][1]; // [4, 5]
const value4 = deepArray[1][1][1][0]; // 4

// Error-prone access
// If any level could be undefined, use optional chaining
const safeValue = deepArray[1]?.[1]?.[1]?.[1]; // 5`,
        output: `value1: [2, [3, [4, 5]]]
value2: [3, [4, 5]]
value3: [4, 5]
value4: 4
safeValue: 5`
      },
      {
        id: 'dynamic',
        title: 'Dynamic Access',
        code: `const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

// Using variables for access
const row = 2;
const col = 0;
const value = matrix[row][col]; // 7

// Handling out-of-bounds access safely
function safeGet(arr, indices) {
  let result = arr;
  
  for (const idx of indices) {
    if (result === undefined || result === null || 
        idx < 0 || idx >= result.length) {
      return undefined;
    }
    result = result[idx];
  }
  
  return result;
}

const safeValue = safeGet(matrix, [3, 2]); // undefined
const validValue = safeGet(matrix, [1, 1]); // 5`,
        output: `value: 7
safeValue: undefined
validValue: 5`
      }
    ],
    flattening: [
      {
        id: 'flatmethod',
        title: 'Using flat() Method',
        code: `const nested = [1, [2, 3], [4, [5, 6]]];

// Default flattening (depth = 1)
const flattened1 = nested.flat();
// [1, 2, 3, 4, [5, 6]]

// With specific depth
const flattened2 = nested.flat(2);
// [1, 2, 3, 4, 5, 6]

// Infinite depth flattening
const deepNested = [1, [2, [3, [4, [5]]]]];
const fullyFlattened = deepNested.flat(Infinity);
// [1, 2, 3, 4, 5]`,
        output: `flattened1: [1, 2, 3, 4, [5, 6]]
flattened2: [1, 2, 3, 4, 5, 6]
fullyFlattened: [1, 2, 3, 4, 5]`
      },
      {
        id: 'flatmap',
        title: 'flatMap() for Transform & Flatten',
        code: `const entries = [
  { name: 'Alice', scores: [90, 85, 92] },
  { name: 'Bob', scores: [75, 80] },
  { name: 'Charlie', scores: [88, 95, 90, 92] }
];

// Extract all scores into one flat array
const allScores = entries.flatMap(entry => entry.scores);
// [90, 85, 92, 75, 80, 88, 95, 90, 92]

// Equivalent to, but more efficient than:
// const allScores = entries.map(e => e.scores).flat();

// Calculate average scores with mapping
const scoreDetails = entries.flatMap(entry => {
  const avg = entry.scores.reduce((a, b) => a + b) / entry.scores.length;
  return { name: entry.name, average: avg };
});
// [{name: 'Alice', average: 89}, ...]`,
        output: `allScores: [90, 85, 92, 75, 80, 88, 95, 90, 92]
scoreDetails: [
  {name: 'Alice', average: 89},
  {name: 'Bob', average: 77.5},
  {name: 'Charlie', average: 91.25}
]`
      },
      {
        id: 'manual',
        title: 'Manual Flattening',
        code: `const nested = [1, [2, 3], [4, [5, 6]]];

// Manual flattening with reduce (depth = 1)
const flattened = nested.reduce((result, item) => {
  return result.concat(Array.isArray(item) ? item : [item]);
}, []);
// [1, 2, 3, 4, [5, 6]]

// Recursive deep flattening
function deepFlatten(arr) {
  return arr.reduce((result, item) => {
    if (Array.isArray(item)) {
      return result.concat(deepFlatten(item));
    }
    return result.concat(item);
  }, []);
}

const fullyFlattened = deepFlatten(nested);
// [1, 2, 3, 4, 5, 6]`,
        output: `flattened: [1, 2, 3, 4, [5, 6]]
fullyFlattened: [1, 2, 3, 4, 5, 6]`
      }
    ],
    structured: [
      {
        id: 'reduction',
        title: 'Structured Reduction',
        code: `const employeeTree = {
  name: 'John (CEO)',
  children: [
    {
      name: 'Sarah (CTO)',
      children: [
        { name: 'Alex (Dev)', salary: 80000 },
        { name: 'Jamie (Dev)', salary: 85000 }
      ],
      salary: 120000
    },
    {
      name: 'Michael (CFO)',
      children: [
        { name: 'Taylor (Accountant)', salary: 70000 }
      ],
      salary: 110000
    }
  ],
  salary: 150000
};

// Calculate total salary budget using recursion
function calculateTotalSalary(node) {
  let total = node.salary || 0;
  
  if (node.children) {
    total += node.children.reduce((sum, child) => 
      sum + calculateTotalSalary(child), 0);
  }
  
  return total;
}

const totalSalary = calculateTotalSalary(employeeTree);
// 615000`,
        output: `totalSalary: 615000`
      },
      {
        id: 'traversal',
        title: 'Recursive Traversal Patterns',
        code: `const fileTree = {
  name: 'project',
  type: 'folder',
  children: [
    {
      name: 'src',
      type: 'folder',
      children: [
        {
          name: 'components',
          type: 'folder',
          children: [
            { name: 'Header.js', type: 'file', size: 1500 },
            { name: 'Footer.js', type: 'file', size: 1200 }
          ]
        },
        { name: 'App.js', type: 'file', size: 3000 }
      ]
    },
    {
      name: 'public',
      type: 'folder',
      children: [
        { name: 'index.html', type: 'file', size: 2000 },
        { name: 'styles.css', type: 'file', size: 5000 }
      ]
    }
  ]
};

// Find all files with their full paths
function findAllFiles(node, currentPath = '') {
  const path = currentPath ? \`\${currentPath}/\${node.name}\` : node.name;
  
  if (node.type === 'file') {
    return [{ path, size: node.size }];
  }
  
  if (!node.children) return [];
  
  return node.children.flatMap(child => 
    findAllFiles(child, path));
}

const allFiles = findAllFiles(fileTree);`,
        output: `allFiles: [
  {path: 'project/src/components/Header.js', size: 1500},
  {path: 'project/src/components/Footer.js', size: 1200},
  {path: 'project/src/App.js', size: 3000},
  {path: 'project/public/index.html', size: 2000},
  {path: 'project/public/styles.css', size: 5000}
]`
      },
      {
        id: 'mapreduce',
        title: 'Map-Reduce for Nested Data',
        code: `const orders = [
  {
    id: 'A1',
    customer: 'Alice',
    items: [
      { product: 'Book', price: 15, quantity: 2 },
      { product: 'Pen', price: 5, quantity: 3 }
    ]
  },
  {
    id: 'B2',
    customer: 'Bob',
    items: [
      { product: 'Notebook', price: 10, quantity: 1 },
      { product: 'Backpack', price: 45, quantity: 1 }
    ]
  }
];

// Calculate total value of all orders
const totalOrderValue = orders.reduce((total, order) => {
  const orderTotal = order.items.reduce((sum, item) => 
    sum + (item.price * item.quantity), 0);
  return total + orderTotal;
}, 0);

// Group products by customer
const productsByCustomer = orders.reduce((result, order) => {
  // Map customer to their products
  result[order.customer] = order.items.map(item => item.product);
  return result;
}, {});`,
        output: `totalOrderValue: 95
productsByCustomer: {
  "Alice": ["Book", "Pen"],
  "Bob": ["Notebook", "Backpack"]
}`
      }
    ]
  };

  const runExample = (id) => {
    // Simulate running the code
    setShowOutput(prev => ({...prev, [id]: !prev[id]}));
  };

  // FolderTree component for visualization
  const FolderTree = ({ data, level = 0 }) => {
    const [expanded, setExpanded] = useState(level < 1);
    
    const toggleExpand = (e) => {
      e.stopPropagation();
      setExpanded(!expanded);
    };
    
    return (
      <div className="ml-4">
        <div 
          className={`flex items-center cursor-pointer py-1 ${data.type === 'folder' ? 'text-blue-700' : 'text-gray-700'}`}
          onClick={data.children ? toggleExpand : undefined}
        >
          {data.children && (
            expanded ? <FaChevronDown className="mr-1 text-xs" /> : <FaChevronRight className="mr-1 text-xs" />
          )}
          
          {data.type === 'folder' ? (
            <FaFolder className="mr-1 text-yellow-500" />
          ) : (
            <FaFile className="mr-1 text-gray-500" />
          )}
          
          <span>{data.name}</span>
        </div>
        
        {expanded && data.children && (
          <div className="border-l border-gray-300 pl-2">
            {data.children.map((child, idx) => (
              <FolderTree 
                key={idx} 
                data={child} 
                level={level + 1} 
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  // Components used in FolderTree
  const FaFolder = (props) => <FaCube {...props} />;
  const FaFile = (props) => <FaCode {...props} />;
  
  // Visualization of a nested array
  const NestedArrayViz = ({ data, depth = 0 }) => {
    const color = ["bg-blue-100", "bg-green-100", "bg-yellow-100", "bg-red-100"][depth % 4];
    const border = ["border-blue-300", "border-green-300", "border-yellow-300", "border-red-300"][depth % 4];
    
    if (!Array.isArray(data)) {
      return (
        <div className={`inline-flex items-center justify-center h-10 w-10 ${color} ${border} border rounded-md m-1`}>
          {data}
        </div>
      );
    }
    
    return (
      <div className={`inline-flex flex-wrap items-center ${color} ${border} border rounded-md p-1 m-1`}>
        {data.map((item, i) => (
          <NestedArrayViz key={i} data={item} depth={depth + 1} />
        ))}
      </div>
    );
  };

  // Code block component with highlighting and "run" button
  const CodeBlock = ({ id, title, code, output }) => {
    return (
      <div className="mb-6 border rounded-md overflow-hidden bg-white shadow-sm">
        <div className="flex justify-between items-center bg-gray-50 px-4 py-2 border-b">
          <h4 className="font-medium text-gray-700">{title}</h4>
          <button 
            onClick={() => runExample(id)}
            className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
          >
            {showOutput[id] ? 'Hide Result' : 'Run Example'}
          </button>
        </div>
        
        <pre className="p-4 text-sm bg-gray-900 text-gray-100 overflow-x-auto">
          <code>{code}</code>
        </pre>
        
        {showOutput[id] && (
          <div className="bg-gray-50 border-t px-4 py-3">
            <div className="text-xs text-gray-500 mb-1">Output:</div>
            <pre className="text-sm overflow-x-auto bg-white p-2 rounded border">
              <code className="text-green-700">{output}</code>
            </pre>
          </div>
        )}
      </div>
    );
  };

  // Game challenges
  const challenges = [
    {
      id: 1,
      description: 'Extract the first key from the nested array.',
      input: [[1, 2, 3], [4, 5, 6]],
      output: 1,
      hint: 'Think about how to access the first element in a nested array.',
      code: `const extractFirstKey = (data) => {
  // Your code here
};`
    },
    {
      id: 2,
      description: 'Get all values from the second level of the nested array.',
      input: [[1, 2, 3], [4, 5, 6]],
      output: [2, 5],
      hint: 'You need to access the second element of each sub-array.',
      code: `const getAllValues = (data) => {
  // Your code here
};`
    },
    {
      id: 3,
      description: 'Find the sum of all values in the nested array.',
      input: [[1, 2, 3], [4, 5, 6]],
      output: 21,
      hint: 'Consider how you would sum values in a regular array.',
      code: `const sumAllValues = (data) => {
  // Your code here
};`
    },
    {
      id: 4,
      description: 'Flatten the nested array into a single-level array.',
      input: [[1, 2, 3], [4, 5, 6]],
      output: [1, 2, 3, 4, 5, 6],
      hint: 'There is a built-in method that can help with this.',
      code: `const flattenArray = (data) => {
  // Your code here
};`
    },
    {
      id: 5,
      description: 'Create an object mapping each key to its depth in the array.',
      input: [[1, 2, 3], [4, 5, 6]],
      output: { '1': 1, '2': 1, '3': 1, '4': 2, '5': 2, '6': 2 },
      hint: 'You will need to iterate over the array and keep track of the depth.',
      code: `const mapKeysToDepth = (data) => {
  // Your code here
};`
    }
  ];

  // Start the game
  const startGame = () => {
    setGameActive(true);
    setGameLevel(1);
    setGameStats({ level: 1, solved: 0, attempts: 0, hintsUsed: 0 });
    setGameCompleted(false);
    setGameInput('');
    setGameOutput(null);
    setGameError(null);
    setShowHint(false);
    
    // Load the first challenge
    setCurrentChallenge(challenges[0]);
  };

  // Reset the current challenge
  const resetChallenge = () => {
    setGameInput('');
    setGameOutput(null);
    setGameError(null);
    setShowHint(false);
  };

  // Get the title for each level
  const getLevelTitle = (level) => {
    switch (level) {
      case 1: return 'The Beginning';
      case 2: return 'The Explorer';
      case 3: return 'The Adventurer';
      case 4: return 'The Pathfinder';
      case 5: return 'The Master';
      default: return '';
    }
  };

  // Move to the next level
  const nextLevel = () => {
    const nextLevel = gameLevel + 1;
    
    if (nextLevel > 5) {
      // Game completed
      setGameCompleted(true);
      return;
    }
    
    setGameLevel(nextLevel);
    setGameStats(prev => ({ ...prev, level: nextLevel }));
    setGameInput('');
    setGameOutput(null);
    setGameError(null);
    setShowHint(false);
    
    // Load the new challenge
    setCurrentChallenge(challenges[nextLevel - 1]);
  };

  // Run the user's code
  const runCode = () => {
    // Simple sandbox for running user code
    try {
      // eslint-disable-next-line no-new-func
      const userFunction = new Function('data', gameInput);
      
      // Test the function with the challenge input
      const result = userFunction(currentChallenge.input);
      
      // Check if the result matches the expected output
      if (JSON.stringify(result) === JSON.stringify(currentChallenge.output)) {
        setGameOutput({ success: true, result });
        setGameStats(prev => ({ ...prev, solved: prev.solved + 1 }));
      } else {
        setGameOutput({ success: false, result });
      }
    } catch (error) {
      setGameError(error.message);
    }
  };

  return (
    <div className="p-4 bg-gradient-to-b from-indigo-50 to-white">
      <h2 className="text-2xl font-bold text-indigo-800 mb-2">
        <FaLayerGroup className="inline-block mr-2" /> 
        Working with Multidimensional Arrays & Nested Data
      </h2>
      
      <p className="text-gray-600 mb-6">
        Modern applications frequently deal with complex, nested data structures. 
        This guide explores how to efficiently access, flatten, and process hierarchical array data.
      </p>
      
      {/* Array visualization */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium text-indigo-700 mb-3 flex items-center">
          <FaCubes className="mr-2" /> Visualizing Nested Arrays
        </h3>
        
        <div className="bg-gray-50 p-4 rounded-md overflow-x-auto">
          <NestedArrayViz data={nestedArray} />
        </div>
        
        <div className="mt-3 text-sm text-gray-600">
          <pre className="bg-gray-900 text-gray-100 p-2 rounded-md">
            <code>const nestedArray = [ [1, 2, [3, 4]], [5, [6, [7, 8]]], 9, [[10, 11], 12] ];</code>
          </pre>
        </div>
      </div>
      
      {/* Main content tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('accessing')}
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === 'accessing' 
                ? 'border-b-2 border-indigo-500 text-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FaChevronRight className="inline-block mr-1" /> Accessing Nested Arrays
          </button>
          <button
            onClick={() => setActiveTab('flattening')}
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === 'flattening' 
                ? 'border-b-2 border-indigo-500 text-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FaExpandAlt className="inline-block mr-1" /> Flattening Arrays
          </button>
          <button
            onClick={() => setActiveTab('structured')}
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === 'structured' 
                ? 'border-b-2 border-indigo-500 text-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FaProjectDiagram className="inline-block mr-1" /> Structured Iteration
          </button>
          <button
            onClick={() => setActiveTab('game')}
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === 'game' 
                ? 'border-b-2 border-indigo-500 text-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FaGamepad className="inline-block mr-1" /> Array Escape Room
          </button>
        </nav>
      </div>
      
      {/* Content for accessing nested arrays */}
      {activeTab === 'accessing' && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <div className="bg-white p-5 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Accessing Elements in Nested Arrays
            </h3>
            
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
              <h4 className="text-blue-700 font-medium mb-1">Key Concepts</h4>
              <ul className="list-disc ml-5 text-blue-800 space-y-1">
                <li>Use chained bracket notation <code className="bg-blue-100 px-1 rounded text-blue-900">[row][col]</code> for multidimensional access</li>
                <li>Each bracket accesses one deeper level of nesting</li>
                <li>Be aware of array boundaries to avoid <code className="bg-blue-100 px-1 rounded text-blue-900">undefined</code> errors</li>
                <li>Consider using optional chaining <code className="bg-blue-100 px-1 rounded text-blue-900">?.</code> for safer deep access</li>
              </ul>
            </div>
            
            {examples.accessing.map(example => (
              <CodeBlock 
                key={example.id}
                id={example.id}
                title={example.title}
                code={example.code}
                output={example.output}
              />
            ))}
          </div>
        </motion.div>
      )}
      
      {/* Content for flattening arrays */}
      {activeTab === 'flattening' && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <div className="bg-white p-5 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Flattening Nested Arrays
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-green-50 border-l-4 border-green-400 p-4">
                <h4 className="text-green-700 font-medium mb-1">Benefits of Flattening</h4>
                <ul className="list-disc ml-5 text-green-800 space-y-1">
                  <li>Simplifies data processing</li>
                  <li>Makes array methods easier to apply</li>
                  <li>Improves code readability</li>
                  <li>Helps with data transformation pipelines</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 border-l-4 border-purple-400 p-4">
                <h4 className="text-purple-700 font-medium mb-1">Flattening Methods</h4>
                <ul className="list-disc ml-5 text-purple-800 space-y-1">
                  <li><code className="bg-purple-100 px-1 rounded">flat(depth)</code> - ES2019 native method</li>
                  <li><code className="bg-purple-100 px-1 rounded">flatMap()</code> - Map and flatten in one step</li>
                  <li>Recursive functions for custom flattening</li>
                  <li>Reduce-based approaches for complex cases</li>
                </ul>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="text-lg font-medium text-gray-700 mb-2">Visualization of Flattening</h4>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="mb-3">
                  <div className="text-sm text-gray-600 mb-2">Original Nested Array:</div>
                  <NestedArrayViz data={[1, [2, 3], [4, [5, 6]]]} />
                </div>
                
                <div className="flex items-center my-2">
                  <div className="bg-gray-300 h-px flex-grow"></div>
                  <div className="px-2 text-gray-500">flat(1)</div>
                  <div className="bg-gray-300 h-px flex-grow"></div>
                </div>
                
                <div className="mb-3">
                  <NestedArrayViz data={[1, 2, 3, 4, [5, 6]]} />
                </div>
                
                <div className="flex items-center my-2">
                  <div className="bg-gray-300 h-px flex-grow"></div>
                  <div className="px-2 text-gray-500">flat(Infinity)</div>
                  <div className="bg-gray-300 h-px flex-grow"></div>
                </div>
                
                <div>
                  <NestedArrayViz data={[1, 2, 3, 4, 5, 6]} />
                </div>
              </div>
            </div>
            
            {examples.flattening.map(example => (
              <CodeBlock 
                key={example.id}
                id={example.id}
                title={example.title}
                code={example.code}
                output={example.output}
              />
            ))}
          </div>
        </motion.div>
      )}
      
      {/* Content for structured iteration */}
      {activeTab === 'structured' && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <div className="bg-white p-5 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Structured Iteration for Hierarchical Data
            </h3>
            
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-lg font-medium text-gray-700 mb-2">Tree Structure Visualization</h4>
                  <div className="bg-gray-50 rounded-md p-4">
                    <FolderTree data={folderStructure} />
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Example of a hierarchical folder structure
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium text-gray-700 mb-2">Common Traversal Patterns</h4>
                  <div className="space-y-2">
                    <div className="bg-indigo-50 border border-indigo-100 rounded-md p-3">
                      <div className="font-medium text-indigo-700 mb-1">Depth-First Traversal</div>
                      <div className="text-indigo-600 text-sm">
                        Explores as far down a branch as possible before backtracking. Implemented with recursion or stack.
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-100 rounded-md p-3">
                      <div className="font-medium text-green-700 mb-1">Breadth-First Traversal</div>
                      <div className="text-green-600 text-sm">
                        Explores all nodes at the present depth before moving to nodes at the next depth. Implemented with a queue.
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 border border-yellow-100 rounded-md p-3">
                      <div className="font-medium text-yellow-700 mb-1">Aggregation & Transformation</div>
                      <div className="text-yellow-600 text-sm">
                        Use reduce patterns to collect, summarize, or transform nested data during traversal.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {examples.structured.map(example => (
              <CodeBlock 
                key={example.id}
                id={example.id}
                title={example.title}
                code={example.code}
                output={example.output}
              />
            ))}
          </div>
        </motion.div>
      )}
      
      {/* Content for game tab */}
      {activeTab === 'game' && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <div className="bg-white p-5 rounded-lg shadow-sm border overflow-hidden">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <FaGamepad className="mr-2 text-indigo-600" /> 
              Array Escape Room Challenge
            </h3>
            
            {!gameActive ? (
              <div className="text-center py-8">
                <div className="mb-4 inline-block p-4 bg-indigo-100 rounded-full">
                  <FaCube className="text-5xl text-indigo-600" />
                </div>
                
                <h4 className="text-xl font-bold text-indigo-800 mb-3">
                  Nested Array Escape Challenge
                </h4>
                
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  You're trapped in a multidimensional array maze! 
                  Solve nested array challenges to find the escape keys and unlock each level.
                </p>
                
                <div className="bg-indigo-50 p-4 rounded-md mb-6 inline-block text-left">
                  <h5 className="font-medium text-indigo-700 mb-2">How to Play:</h5>
                  <ul className="list-disc ml-5 text-indigo-800 space-y-1 text-sm">
                    <li>Each level presents a nested array challenge</li>
                    <li>Write JavaScript code to extract or transform the data</li>
                    <li>Your goal is to match the expected output format</li>
                    <li>Complete all 5 levels to escape the array maze!</li>
                  </ul>
                </div>
                
                <button
                  onClick={() => startGame()}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                >
                  Start Challenge
                </button>
              </div>
            ) : gameCompleted ? (
              <div className="text-center py-10">
                <div className="mb-6 inline-block">
                  <div className="relative">
                    <FaTrophy className="text-6xl text-yellow-500" />
                    <div className="absolute -top-3 -right-3 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                      {gameStats.level}
                    </div>
                  </div>
                </div>
                
                <h4 className="text-2xl font-bold text-indigo-800 mb-3">
                  Array Maze Escaped!
                </h4>
                
                <p className="text-gray-600 mb-6">
                  Congratulations! You've mastered nested arrays and found all escape keys!
                </p>
                
                <div className="bg-indigo-50 p-4 rounded-md mb-6 max-w-md mx-auto">
                  <h5 className="font-medium text-indigo-700 mb-2">Your Stats:</h5>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-white p-2 rounded">
                      <div className="text-gray-500 text-xs">Levels Completed</div>
                      <div className="font-bold text-indigo-800 text-xl">{gameStats.level}</div>
                    </div>
                    <div className="bg-white p-2 rounded">
                      <div className="text-gray-500 text-xs">Challenges Solved</div>
                      <div className="font-bold text-indigo-800 text-xl">{gameStats.solved}</div>
                    </div>
                    <div className="bg-white p-2 rounded">
                      <div className="text-gray-500 text-xs">Total Attempts</div>
                      <div className="font-bold text-indigo-800 text-xl">{gameStats.attempts}</div>
                    </div>
                    <div className="bg-white p-2 rounded">
                      <div className="text-gray-500 text-xs">Hints Used</div>
                      <div className="font-bold text-indigo-800 text-xl">{gameStats.hintsUsed}</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center space-x-3">
                  <button
                    onClick={() => {
                      setGameCompleted(false);
                      setGameActive(false);
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                  >
                    Return to Start
                  </button>
                  <button
                    onClick={() => {
                      setGameCompleted(false);
                      startGame();
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                  >
                    Play Again
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {/* Game level indicator */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="font-medium text-indigo-800">Level {gameLevel}: {getLevelTitle(gameLevel)}</h4>
                    <div className="text-xs text-gray-500">{gameStats.solved} challenges solved | {gameStats.attempts} attempts</div>
                  </div>
                  
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div 
                        key={level}
                        className={`w-3 h-3 mx-1 rounded-full ${
                          level < gameLevel ? 'bg-green-500' :
                          level === gameLevel ? 'bg-indigo-500' : 
                          'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Challenge description */}
                <div className="bg-indigo-50 p-4 rounded-md mb-4">
                  <div className="text-indigo-800 mb-2">{currentChallenge?.description}</div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Input Data:</div>
                    <pre className="bg-white p-2 rounded text-xs overflow-x-auto">
                      <code className="text-indigo-600">{currentChallenge?.inputDisplay}</code>
                    </pre>
                  </div>
                  
                  <div className="mt-2">
                    <div className="text-xs text-gray-500 mb-1">Expected Output:</div>
                    <pre className="bg-white p-2 rounded text-xs overflow-x-auto">
                      <code className="text-green-600">{currentChallenge?.outputDisplay}</code>
                    </pre>
                  </div>
                </div>
                
                {/* Code input area */}
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <div className="text-sm font-medium text-gray-700">Your Code:</div>
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded flex items-center"
                    >
                      <FaLightbulb className="mr-1" /> {showHint ? 'Hide Hint' : 'Show Hint'}
                    </button>
                  </div>
                  
                  {showHint && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-200 p-3 mb-3 text-sm text-yellow-800">
                      <strong>Hint:</strong> {currentChallenge?.hint}
                    </div>
                  )}
                  
                  <div className="relative">
                    <textarea
                      value={gameInput}
                      onChange={(e) => setGameInput(e.target.value)}
                      className="w-full h-32 p-3 border border-gray-300 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      placeholder="Write your JavaScript code here..."
                    />
                  </div>
                </div>
                
                {/* Game controls */}
                <div className="flex justify-between">
                  <button
                    onClick={() => resetChallenge()}
                    className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition flex items-center"
                  >
                    <FaRedo className="mr-1" /> Reset
                  </button>
                  
                  <button
                    onClick={() => runCode()}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                  >
                    Run Code
                  </button>
                </div>
                
                {/* Output area */}
                {(gameOutput !== null || gameError) && (
                  <div className="mt-4 border-t pt-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">Result:</div>
                    
                    {gameError ? (
                      <div className="bg-red-50 border-l-4 border-red-400 p-3">
                        <div className="text-red-700 font-medium">Error</div>
                        <div className="text-sm text-red-600">{gameError}</div>
                      </div>
                    ) : gameOutput?.success ? (
                      <div className="bg-green-50 border-l-4 border-green-400 p-3">
                        <div className="text-green-700 font-medium flex items-center">
                          <FaStar className="mr-1" /> Success! Challenge solved!
                        </div>
                        <div className="text-sm text-green-600 mt-1">Your output matches the expected result.</div>
                        
                        <div className="flex justify-end mt-3">
                          <button
                            onClick={() => nextLevel()}
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition flex items-center"
                          >
                            {gameLevel < 5 ? 'Next Challenge' : 'Complete Game'} <FaArrowRight className="ml-1" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-orange-50 border-l-4 border-orange-400 p-3">
                        <div className="text-orange-700 font-medium">Almost there!</div>
                        <div className="text-sm text-orange-600">Your output doesn't match the expected result yet.</div>
                        
                        <div className="mt-2">
                          <div className="text-xs text-gray-500 mb-1">Your Output:</div>
                          <pre className="bg-white p-2 rounded text-xs overflow-x-auto">
                            <code className="text-gray-800">{gameOutput?.result ? JSON.stringify(gameOutput.result, null, 2) : 'undefined'}</code>
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
      
      {/* Quick reference guide */}
      <div className="mt-6 bg-gradient-to-r from-purple-50 to-indigo-50 p-5 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-indigo-800 mb-3">
          Nested Array Quick Reference
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h4 className="font-medium text-indigo-700 mb-2">Creation & Access</h4>
            <div className="bg-white rounded-md p-3 text-sm">
              <pre className="text-xs overflow-x-auto">
                <code className="text-gray-700">
{`// Creation
const matrix = [
  [1, 2, 3],
  [4, 5, 6]
];

// Access
const val = matrix[1][2]; // 6`}
                </code>
              </pre>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-indigo-700 mb-2">Flattening</h4>
            <div className="bg-white rounded-md p-3 text-sm">
              <pre className="text-xs overflow-x-auto">
                <code className="text-gray-700">
{`// Native flattening
const flat1 = nested.flat();
const flatAll = nested.flat(Infinity);

// With transformation
const results = data.flatMap(item => 
  item.values
);`}
                </code>
              </pre>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-indigo-700 mb-2">Recursive Patterns</h4>
            <div className="bg-white rounded-md p-3 text-sm">
              <pre className="text-xs overflow-x-auto">
                <code className="text-gray-700">
{`// Tree traversal
function process(node) {
  // Handle current node
  
  // Recurse on children
  if (node.children) {
    node.children.forEach(process);
  }
}`}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slide6;
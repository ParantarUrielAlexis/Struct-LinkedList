import React, { useState, useRef } from "react";

const Slide8 = () => {
  // State for active algorithm tab
  const [activeTab, setActiveTab] = useState("insertion");
  // State for tracking which takeaways have been revealed
  const [revealedTakeaways, setRevealedTakeaways] = useState([]);
  // State for tracking quiz answers
  const [quizAnswers, setQuizAnswers] = useState({});
  // State for the feedback message
  const [feedback, setFeedback] = useState("");
  // State for checking if all quizzes are completed
  const [allCompleted, setAllCompleted] = useState(false);
  // Reference for scrolling to comparison table
  const comparisonRef = useRef(null);

  // Sorting algorithm data
  const algorithms = {
    insertion: {
      name: "Insertion Sort",
      description: "Builds the sorted array one element at a time by comparing each element with the already-sorted portion and inserting it at the correct position.",
      takeaways: [
        {
          id: "ins-1",
          title: "How It Works",
          content: "Insertion sort builds the final sorted array one element at a time. It takes elements from the unsorted part and places them at their correct position in the sorted part.",
          emoji: "🔍"
        },
        {
          id: "ins-2",
          title: "Time Complexity",
          content: "Best case: O(n) when array is already sorted. Average and worst case: O(n²) when array is in reverse order.",
          emoji: "⏱️"
        },
        {
          id: "ins-3",
          title: "Space Complexity",
          content: "O(1) - Insertion sort is an in-place sorting algorithm requiring constant extra space.",
          emoji: "💾"
        },
        {
          id: "ins-4",
          title: "Best Used For",
          content: "Small datasets, nearly sorted arrays, online/streaming data processing, or as part of more complex hybrid algorithms.",
          emoji: "✅"
        }
      ],
      code: `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    // Save the current element
    let current = arr[i];
    
    // Find position where current should be inserted
    let j = i - 1;
    while (j >= 0 && arr[j] > current) {
      arr[j + 1] = arr[j];
      j--;
    }
    
    // Insert current in the correct position
    arr[j + 1] = current;
  }
  
  return arr;
}`
    },
    bubble: {
      name: "Bubble Sort",
      description: "Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order, causing the largest elements to 'bubble' to the end.",
      takeaways: [
        {
          id: "bub-1",
          title: "How It Works",
          content: "Bubble sort repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. This causes larger elements to 'bubble' to the end.",
          emoji: "🔄"
        },
        {
          id: "bub-2",
          title: "Time Complexity",
          content: "Best case: O(n) with optimized implementation when already sorted. Average and worst case: O(n²).",
          emoji: "⏱️"
        },
        {
          id: "bub-3",
          title: "Space Complexity",
          content: "O(1) - Bubble sort is an in-place algorithm requiring only a constant amount of extra space.",
          emoji: "💾"
        },
        {
          id: "bub-4",
          title: "Best Used For",
          content: "Educational purposes, very small datasets, or when the array is almost sorted and simplicity is prioritized over efficiency.",
          emoji: "✅"
        }
      ],
      code: `function bubbleSort(arr) {
  let swapped;
  do {
    swapped = false;
    for (let i = 0; i < arr.length - 1; i++) {
      // Compare adjacent elements
      if (arr[i] > arr[i + 1]) {
        // Swap elements if they're in wrong order
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swapped = true;
      }
    }
  } while (swapped);
  
  return arr;
}`
    },
    selection: {
      name: "Selection Sort",
      description: "Repeatedly selects the smallest (or largest) element from the unsorted portion and moves it to the end of the sorted portion.",
      takeaways: [
        {
          id: "sel-1",
          title: "How It Works",
          content: "Selection sort divides the input into a sorted and unsorted region. It repeatedly finds the minimum element from the unsorted region and moves it to the end of the sorted region.",
          emoji: "🔎"
        },
        {
          id: "sel-2",
          title: "Time Complexity",
          content: "Best, average, and worst case: O(n²). Selection sort always scans the entire unsorted portion to find the next element.",
          emoji: "⏱️"
        },
        {
          id: "sel-3",
          title: "Space Complexity",
          content: "O(1) - Selection sort is an in-place algorithm requiring only a constant amount of extra space.",
          emoji: "💾"
        },
        {
          id: "sel-4",
          title: "Best Used For",
          content: "Small datasets where memory write operations are expensive, or when simplicity of implementation is important.",
          emoji: "✅"
        }
      ],
      code: `function selectionSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    // Find the minimum element in the unsorted part
    let minIndex = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    
    // Swap the found minimum with the first unsorted element
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }
  
  return arr;
}`
    }
  };

  // Mini-quizzes to test understanding
  const quizzes = [
    {
      id: "quiz1",
      question: "Which sorting algorithm performs best with nearly sorted data?",
      options: [
        "Selection Sort",
        "Insertion Sort",
        "Bubble Sort",
        "All perform equally"
      ],
      correctAnswer: 1
    },
    {
      id: "quiz2",
      question: "Which sorting algorithm makes the fewest element swaps?",
      options: [
        "Bubble Sort",
        "Selection Sort",
        "Insertion Sort",
        "They all make the same number of swaps"
      ],
      correctAnswer: 1
    },
    {
      id: "quiz3",
      question: "Which of these sorting algorithms is most suitable for educational purposes due to its simplicity?",
      options: [
        "Selection Sort",
        "Insertion Sort",
        "Bubble Sort",
        "Any of the above"
      ],
      correctAnswer: 2
    }
  ];

  // Function to toggle the revealed state of a takeaway
  const toggleTakeaway = (id) => {
    setRevealedTakeaways(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  // Handle quiz answer selection
  const handleQuizAnswer = (quizId, selectedOption) => {
    const quiz = quizzes.find(q => q.id === quizId);
    const isCorrect = selectedOption === quiz.correctAnswer;
    
    setQuizAnswers(prev => ({
      ...prev,
      [quizId]: {
        selectedOption,
        isCorrect
      }
    }));

    // Check if all quizzes are now completed
    setTimeout(() => {
      const allAnswered = quizzes.every(q => quizAnswers[q.id] !== undefined);
      if (allAnswered) {
        const allCorrect = quizzes.every(q => quizAnswers[q.id]?.isCorrect);
        if (allCorrect) {
          setFeedback("Great job! You've mastered the key concepts of elementary sorting algorithms!");
          setAllCompleted(true);
        } else {
          setFeedback("Good effort! Review the incorrect answers to strengthen your understanding.");
        }
      }
    }, 500);
  };

  // Check if a specific quiz has been answered
  const isQuizAnswered = (quizId) => {
    return quizAnswers[quizId] !== undefined;
  };

  // Scroll to comparison table
  const scrollToComparison = () => {
    comparisonRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-2">Elementary Sorting Algorithms: Learning Takeaways</h2>
      <p className="mb-4">
        Review key concepts about different elementary sorting algorithms to solidify your understanding.
        Select an algorithm below to explore its characteristics and implementation.
      </p>
      
      {/* Algorithm selector tabs */}
      <div className="flex overflow-x-auto space-x-1 pb-1 mb-4">
        {Object.entries(algorithms).map(([key, algo]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2 rounded-t-lg font-medium whitespace-nowrap transition
              ${activeTab === key 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {algo.name}
          </button>
        ))}
      </div>
      
      {/* Algorithm description */}
      <div className="bg-blue-50 p-4 rounded-lg mb-4">
        <h3 className="font-bold text-lg">{algorithms[activeTab].name}</h3>
        <p className="text-gray-700">{algorithms[activeTab].description}</p>
      </div>
      
      {/* Interactive Takeaways Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {algorithms[activeTab].takeaways.map(takeaway => (
          <div 
            key={takeaway.id}
            className={`bg-white border rounded-lg shadow-md overflow-hidden transition-all duration-300 
              ${revealedTakeaways.includes(takeaway.id) ? 'h-48' : 'h-20'} 
              hover:shadow-lg cursor-pointer`}
            onClick={() => toggleTakeaway(takeaway.id)}
          >
            <div className="p-4 flex items-center">
              <span className="text-2xl mr-3">{takeaway.emoji}</span>
              <h3 className="font-bold text-gray-800">{takeaway.title}</h3>
            </div>
            <div className={`px-4 pb-4 transition-opacity duration-300 
              ${revealedTakeaways.includes(takeaway.id) ? 'opacity-100' : 'opacity-0'}`}>
              <p className="text-gray-600">{takeaway.content}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Code Implementation */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
        <h3 className="text-lg font-bold mb-2">
          <span className="text-xl mr-2">💻</span>
          Implementation
        </h3>
        
        <div className="bg-gray-900 text-gray-200 p-4 rounded-md font-mono text-sm overflow-auto">
          <pre className="whitespace-pre-wrap">
            {algorithms[activeTab].code}
          </pre>
        </div>
      </div>
      
      {/* Algorithm Comparison Button */}
      
      
     
      
      {/* Algorithm Comparison Table */}
      <div ref={comparisonRef} className="mb-6">
        <h3 className="text-lg font-bold mb-3">
          <span className="text-xl mr-2">📊</span>
          Algorithm Comparison
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Algorithm</th>
                <th className="border p-2 text-left">Best Case</th>
                <th className="border p-2 text-left">Average Case</th>
                <th className="border p-2 text-left">Worst Case</th>
                <th className="border p-2 text-left">Space</th>
                <th className="border p-2 text-left">Stable</th>
                <th className="border p-2 text-left">Best Used For</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-yellow-50">
                <td className="border p-2 font-medium">Insertion Sort</td>
                <td className="border p-2">O(n)</td>
                <td className="border p-2">O(n²)</td>
                <td className="border p-2">O(n²)</td>
                <td className="border p-2">O(1)</td>
                <td className="border p-2">Yes</td>
                <td className="border p-2">Small or nearly sorted datasets</td>
              </tr>
              <tr className="hover:bg-yellow-50">
                <td className="border p-2 font-medium">Bubble Sort</td>
                <td className="border p-2">O(n)</td>
                <td className="border p-2">O(n²)</td>
                <td className="border p-2">O(n²)</td>
                <td className="border p-2">O(1)</td>
                <td className="border p-2">Yes</td>
                <td className="border p-2">Educational purposes, very small datasets</td>
              </tr>
              <tr className="hover:bg-yellow-50">
                <td className="border p-2 font-medium">Selection Sort</td>
                <td className="border p-2">O(n²)</td>
                <td className="border p-2">O(n²)</td>
                <td className="border p-2">O(n²)</td>
                <td className="border p-2">O(1)</td>
                <td className="border p-2">No</td>
                <td className="border p-2">Small datasets, minimize memory writes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Application Tips */}
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h3 className="font-bold flex items-center mb-2">
          <span className="text-xl mr-2">💡</span>
          When to Use Each Algorithm
        </h3>
        <ul className="space-y-2 pl-6 list-disc">
          <li><strong>Insertion Sort:</strong> Best for small arrays or nearly-sorted data; works well as part of hybrid sorting strategies.</li>
          <li><strong>Bubble Sort:</strong> Mainly for educational purposes; use when simplicity is more important than efficiency.</li>
          <li><strong>Selection Sort:</strong> When minimizing the number of memory writes is important (e.g., when write operation is significantly more expensive than read).</li>
          <li><strong>For all:</strong> These elementary sorts are excellent for learning sorting concepts, but for larger datasets in production environments, more efficient algorithms like Merge Sort or Quick Sort would be preferred.</li>
        </ul>
      </div>
      
      {/* Visual Learning */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="font-bold flex items-center mb-2">
          <span className="text-xl mr-2">👁️</span>
          Visual Pattern Recognition
        </h3>
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-2 bg-contain bg-center bg-no-repeat" 
                 style={{backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/0/0f/Insertion-sort-example-300px.gif')"}}>
            </div>
            <p className="text-sm font-medium">Insertion Sort Pattern</p>
          </div>
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-2 bg-contain bg-center bg-no-repeat" 
                 style={{backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/c/c8/Bubble-sort-example-300px.gif')"}}>
            </div>
            <p className="text-sm font-medium">Bubble Sort Pattern</p>
          </div>
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-2 bg-contain bg-center bg-no-repeat" 
                 style={{backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/9/94/Selection-Sort-Animation.gif')"}}>
            </div>
            <p className="text-sm font-medium">Selection Sort Pattern</p>
          </div>
        </div>
        <p className="text-sm text-center mt-3 text-gray-500">
          Note: These animations illustrate the characteristic patterns of each sorting algorithm.
        </p>
      </div>
    </div>
  );
};

export default Slide8;
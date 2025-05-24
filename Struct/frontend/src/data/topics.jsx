import React from "react";
import {
  FaBook,
  FaCode,
  FaGamepad,
  FaLightbulb,
  FaRocket,
} from "react-icons/fa";
import ArrayVisualizer from "../components/ArrayVisualizer";
import ArrayIndexGame from "../components/ArrayIndexGame";

const topics = [
  {
    label: "Introduction to Arrays",
    icon: <FaBook className="text-4xl text-pink-300" />,
    content: [
      {
        title: "What are Arrays?",
        content: (
          <div className="space-y-4">
            <p>
              Arrays are like organized containers that store multiple values
              under a single variable name. Think of an array as a row of boxes
              where each box has:
            </p>

            <ul className="list-disc ml-6 space-y-2">
              <li>
                A <span className="text-blue-600 font-medium">value</span>{" "}
                stored inside it
              </li>
              <li>
                An <span className="text-green-600 font-medium">index</span>{" "}
                that tells you its position
              </li>
            </ul>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="font-medium mb-2">For example:</p>
              <code className="bg-gray-100 p-1 rounded">
                let fruits = ["🍎", "🍌", "🍊", "🍇", "🥭"];
              </code>
            </div>
          </div>
        ),
        hints:
          "Arrays are ideal when you need to store collections of similar items.",
      },
      {
        title: "Array Indexing",
        content: (
          <div className="space-y-4">
            <p>
              Every element in an array has a position number called an{" "}
              <strong>index</strong>. The first element is at index 0, the
              second at index 1, and so on.
            </p>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-center mb-2">
                To access an element, use: <code>arrayName[index]</code>
              </p>
              <div className="flex justify-center mt-4">
                <ArrayVisualizer
                  initialArray={["🍎", "🍌", "🍊", "🍇", "🥭"]}
                  allowModify={false}
                />
              </div>
            </div>
          </div>
        ),
        hints: "Remember that array indexing starts at 0, not 1!",
      },
      {
        title: "Modifying Arrays",
        content: (
          <div className="space-y-4">
            <p>
              Arrays are mutable, which means you can change their values after
              creation. To modify an element, assign a new value using its
              index.
            </p>

            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <p className="font-medium mb-2">Try it yourself:</p>
              <p className="text-sm mb-4">
                Click on any element below, then change its value!
              </p>
              <ArrayVisualizer
                initialArray={[10, 20, 30, 40, 50]}
                onInteraction={(type) => {
                  if (type === "update") {
                    return 5; // Award 5 points for interaction
                  }
                  return 0;
                }}
              />
            </div>
          </div>
        ),
        interactive: (
          <div className="py-2">
            <p className="text-sm mb-2 text-gray-600">Try the code example:</p>
            <div className="bg-gray-800 text-white p-3 rounded font-mono text-sm">
              <p>// Change the third element (index 2)</p>
              <p>array[2] = 99;</p>
              <p className="text-green-400">// Result: [10, 20, 99, 40, 50]</p>
            </div>
          </div>
        ),
        hints:
          "Remember that modifying one element doesn't affect the other elements in the array.",
      },
      {
        title: "Test Your Knowledge",
        content: (
          <div className="space-y-4">
            <p className="font-medium text-center">
              Time for a challenge! Let's see how well you understand array
              indexing.
            </p>
            <ArrayIndexGame
              onScore={(score) => {
                // This would connect to your scoring system
                console.log(`Player earned ${score} points`);
                return score;
              }}
            />
          </div>
        ),
        hints:
          "Take your time and visualize the array indices starting from 0!",
      },
      {
        title: "Arrays in the Real World",
        content: (
          <div className="space-y-4">
            <p>
              Arrays are everywhere in programming! Here are some real-world
              applications:
            </p>

            <ul className="list-disc ml-6 space-y-2">
              <li>
                <span className="font-medium">Image processing</span>: Images
                are stored as arrays of pixels
              </li>
              <li>
                <span className="font-medium">Music playlists</span>: Songs in
                your queue are an array
              </li>
              <li>
                <span className="font-medium">Task lists</span>: Your to-do
                items are stored in arrays
              </li>
              <li>
                <span className="font-medium">Game development</span>: Enemy
                positions, inventory items
              </li>
            </ul>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-center">
              <p>
                <FaLightbulb className="inline-block text-yellow-500 mr-2" />
                Arrays form the foundation for more complex data structures like
                matrices and grids!
              </p>
            </div>
          </div>
        ),
        hints:
          "Understanding arrays well will help you with many other data structures in the future.",
      },
    ],
  },
  {
    label: "Declaration and Initialization",
    icon: <FaCode className="text-4xl text-yellow-300" />,
    content: [
      {
        title: "Array Syntax in C and C++",
        content: (
          <div className="space-y-4">
            <p>Here's how you declare arrays in C and C++:</p>
            <div className="bg-gray-800 text-white p-4 rounded text-sm font-mono space-y-2">
              <p>// Declaration without initialization</p>
              <p>int numbers[5];</p>
              <p>// Declaration with initialization</p>
              <p>int numbers[5] = &#123;10, 20, 30, 40, 50&#125;;</p>
              <p>// Auto size inference</p>
              <p>int numbers[] = &#123;1, 2, 3&#125;;</p>
            </div>
            <p className="text-gray-600">
              The number inside the square brackets defines the size of the
              array.
            </p>
          </div>
        ),
        hints: "Always define a size or use initialization for auto-sizing.",
      },
      {
        title: "Static vs Dynamic Initialization",
        content: (
          <div className="space-y-4">
            <p>There are two main ways to initialize arrays in C/C++:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                <strong>Static Initialization:</strong> Done at compile time.
                <br />
                <code className="bg-gray-100 p-1 rounded text-sm font-mono">
                  int a[3] = &#123;1, 2, 3&#125;;
                </code>
              </li>
              <li>
                <strong>Dynamic Initialization:</strong> Done at runtime using
                memory allocation.
                <br />
                <code className="bg-gray-100 p-1 rounded text-sm font-mono">
                  int* a = new int[3]; <br />
                  a[0] = 1; a[1] = 2;
                </code>
              </li>
            </ul>
          </div>
        ),
        hints:
          "Use dynamic initialization when the array size is unknown at compile time.",
      },
      {
        title: "Default Values of Array Elements",
        content: (
          <div className="space-y-4">
            <p>Default values depend on how and where the array is declared:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                <strong>Global/static arrays:</strong> All elements are
                initialized to <code>0</code>.
              </li>
              <li>
                <strong>Local arrays:</strong> Elements have{" "}
                <em>garbage values</em> unless initialized explicitly.
              </li>
            </ul>
            <div className="bg-yellow-50 p-3 rounded text-sm">
              <p>
                Tip: Always initialize arrays explicitly to avoid undefined
                values in local arrays.
              </p>
            </div>
          </div>
        ),
        hints: "Uninitialized local arrays can lead to unpredictable bugs!",
      },
      {
        title: "Multidimensional Arrays (2D Arrays)",
        content: (
          <div className="space-y-4">
            <p>2D arrays store data in rows and columns (like matrices):</p>
            <div className="bg-gray-800 text-white p-4 rounded text-sm font-mono space-y-2">
              <p>// Declare a 2x3 array</p>
              <p>int matrix[2][3];</p>
              <p>// Initialize with values</p>
              <p>
                int matrix[2][3] = &#123;&#123;1, 2, 3&#125;, &#123;4, 5,
                6&#125;&#125;;
              </p>
            </div>
            <p>
              You access elements using two indices:{" "}
              <code>matrix[row][col]</code>
            </p>
          </div>
        ),
        hints: "Great for working with tables, grids, or matrices!",
      },
    ],
  },

  {
    label: "Array Time Complexity",
    icon: <FaRocket className="text-4xl text-purple-300" />,
    content: [
      {
        title: "Coming Soon",
        content: <p>This topic will be available soon!</p>,
      },
    ],
  },
  {
    label: "Array Algorithms",
icon: <FaGamepad className="text-4xl text-cyan-300" />,
content: [
  // Slide 1 – Overview
  {
    title: "What Are Sorting Algorithms?",
    content: (
      <div className="space-y-4">
        <p>
          Sorting algorithms are methods used to reorder elements in a list or array 
          into a specific sequence, such as ascending or descending order.
        </p>
        <p>Why sort?</p>
        <ul className="list-disc list-inside pl-2">
          <li>Improves search efficiency</li>
          <li>Helps in data organization</li>
          <li>Prepares data for algorithms like binary search</li>
        </ul>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 p-3 rounded border border-blue-100">
            <h4 className="font-medium">Bubble Sort</h4>
            <p className="text-sm">Swaps adjacent elements repeatedly. O(n²)</p>
          </div>
          <div className="bg-green-50 p-3 rounded border border-green-100">
            <h4 className="font-medium">Selection Sort</h4>
            <p className="text-sm">Selects the smallest element and places it correctly. O(n²)</p>
          </div>
          <div className="bg-yellow-50 p-3 rounded border border-yellow-100">
            <h4 className="font-medium">Insertion Sort</h4>
            <p className="text-sm">Inserts elements into their correct position. O(n²)</p>
          </div>
        </div>
      </div>
    ),
    hints: "Sorting is a fundamental concept in computer science and used in many real-world systems.",
  },

  // Slide 2 – Selection Sort
  {
    title: "Tutorial: Selection Sort",
    content: (
      <div className="space-y-4">
        <p>
          Selection Sort works by repeatedly finding the smallest element and swapping it to the front.
        </p>
        <ol className="list-decimal list-inside pl-4">
          <li>Start from index 0</li>
          <li>Find the minimum element in the rest of the array</li>
          <li>Swap it with the current index</li>
          <li>Repeat for the rest of the array</li>
        </ol>
        <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
{`for i in range(len(arr)):
    min_idx = i
    for j in range(i+1, len(arr)):
        if arr[j] < arr[min_idx]:
            min_idx = j
    arr[i], arr[min_idx] = arr[min_idx], arr[i]`}
        </pre>
      </div>
    ),
    hints: "Selection sort is easy to implement but not efficient on large datasets.",
  },

  // Slide 3 – Bubble Sort
  {
    title: "Tutorial: Bubble Sort",
    content: (
      <div className="space-y-4">
        <p>
          Bubble Sort compares adjacent elements and swaps them if they're in the wrong order.
        </p>
        <ol className="list-decimal list-inside pl-4">
          <li>Loop through array</li>
          <li>Compare each pair of adjacent elements</li>
          <li>Swap if the left element is greater than the right</li>
          <li>Repeat until no swaps are needed</li>
        </ol>
        <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
{`for i in range(len(arr)):
    for j in range(0, len(arr)-i-1):
        if arr[j] > arr[j+1]:
            arr[j], arr[j+1] = arr[j+1], arr[j]`}
        </pre>
      </div>
    ),
    hints: "Bubble sort is intuitive but inefficient for large datasets.",
  },

  // Slide 4 – Insertion Sort
  {
    title: "Tutorial: Insertion Sort",
    content: (
      <div className="space-y-4">
        <p>
          Insertion Sort builds the sorted list one element at a time by comparing with previous elements.
        </p>
        <ol className="list-decimal list-inside pl-4">
          <li>Start from index 1</li>
          <li>Compare current element to its predecessors</li>
          <li>Shift larger elements to the right</li>
          <li>Insert current element in the right position</li>
        </ol>
        <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
{`for i in range(1, len(arr)):
    key = arr[i]
    j = i - 1
    while j >= 0 and arr[j] > key:
        arr[j + 1] = arr[j]
        j -= 1
    arr[j + 1] = key`}
        </pre>
      </div>
    ),
    hints: "Efficient for small or nearly sorted datasets.",
  },

  // Slide 5 – Try the Game!
  {
    title: "Try Sorting Visually with SortShift 🎮",
    content: (
      <div className="space-y-4 text-center">
        <p className="text-lg font-medium">Great job learning sorting algorithms!</p>
        <p>Now it's time to put your skills to the test in an interactive game.</p>
        <p className="text-sm text-gray-600">Sort arrays using the correct algorithm in the fastest time possible.</p>
        <button
          className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
          onClick={() => window.open("/sortshift", "_blank")}
        >
          🎮 Play SortShift Game →
        </button>
      </div>
    ),
    hints: "Use your sorting knowledge in a fun and challenging way with the SortShift game!",
  },
],
  },
];

export default topics;

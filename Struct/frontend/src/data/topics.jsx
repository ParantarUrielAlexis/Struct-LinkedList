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
      // {
      //   title: "Common Array Operations",
      //   content: (
      //     <div className="space-y-4">
      //       <p>
      //         Arrays support various operations to add, remove, or manipulate
      //         elements:
      //       </p>

      //       <div className="grid grid-cols-2 gap-4">
      //         <div className="bg-purple-50 p-3 rounded border border-purple-100">
      //           <h4 className="font-bold">push()</h4>
      //           <p className="text-sm">Adds element to the end</p>
      //           <code className="text-xs bg-white p-1 rounded block mt-1">
      //             array.push(60)
      //           </code>
      //         </div>

      //         <div className="bg-purple-50 p-3 rounded border border-purple-100">
      //           <h4 className="font-bold">pop()</h4>
      //           <p className="text-sm">Removes last element</p>
      //           <code className="text-xs bg-white p-1 rounded block mt-1">
      //             array.pop()
      //           </code>
      //         </div>

      //         <div className="bg-purple-50 p-3 rounded border border-purple-100">
      //           <h4 className="font-bold">length</h4>
      //           <p className="text-sm">Gets array size</p>
      //           <code className="text-xs bg-white p-1 rounded block mt-1">
      //             array.length
      //           </code>
      //         </div>

      //         <div className="bg-purple-50 p-3 rounded border border-purple-100">
      //           <h4 className="font-bold">indexOf()</h4>
      //           <p className="text-sm">Finds position of element</p>
      //           <code className="text-xs bg-white p-1 rounded block mt-1">
      //             array.indexOf(30)
      //           </code>
      //         </div>
      //       </div>
      //     </div>
      //   ),
      //   hints:
      //     "Different programming languages might have slightly different methods, but these operations are common across most languages.",
      // },
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
      {
        title: "Coming Soon",
        content: <p>This topic will be available soon!</p>,
      },
    ],
  },
  // You can add more topics here as needed
];

export default topics;

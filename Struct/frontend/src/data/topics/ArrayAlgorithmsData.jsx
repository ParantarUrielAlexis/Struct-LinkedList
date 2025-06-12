import React from "react";
import { FaRobot, FaLightbulb } from "react-icons/fa";

const ArrayAlgorithmsData = {
  label: "Array Algorithms",
  icon: <FaRobot className="text-4xl text-purple-300" />,
  content: [
    {
      title: "Common Array Algorithms",
      content: (
        <div className="space-y-4">
          <p className="text-lg font-medium text-purple-600">
            Solving Problems with Arrays 🧩
          </p>
          
          <p>
            Arrays are powerful tools for solving many programming problems. Let's explore some common algorithms:
          </p>
          
          <div className="bg-purple-50 p-5 rounded-lg border border-purple-200">
            <h3 className="font-medium mb-4 text-center">Array Traversal</h3>
            
            <p className="mb-2 text-sm">
              Traversing means visiting every element in an array to perform some operation:
            </p>
            
            <div className="bg-gray-800 text-white p-3 rounded font-mono text-sm">
              <p>// Find the sum of all elements</p>
              <p className="text-green-400">function sumArray(array) {'{'}</p>
              <p className="text-green-400 ml-4">let sum = 0;</p>
              <p className="text-green-400 ml-4">for (let i = 0; i &lt; array.length; i++) {'{'}</p>
              <p className="text-green-400 ml-8">sum += array[i];</p>
              <p className="text-green-400 ml-4">{'}'}</p>
              <p className="text-green-400 ml-4">return sum;</p>
              <p className="text-green-400">{'}'}</p>
            </div>
            
            <p className="mt-3 text-sm">
              Modern JavaScript gives us more elegant ways to traverse arrays:
            </p>
            
            <div className="bg-gray-800 text-white p-3 rounded font-mono text-sm mt-2">
              <p>// Using reduce to sum an array</p>
              <p className="text-green-400">const sum = array.reduce((total, current) =&gt; total + current, 0);</p>
            </div>
          </div>
          
          <div className="bg-indigo-50 p-5 rounded-lg border border-indigo-200 mt-4">
            <h3 className="font-medium mb-4 text-center">Finding Elements</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <p className="font-medium mb-2">Linear Search</p>
                <p className="text-sm">
                  Checking each element one by one until you find a match or reach the end.
                </p>
                <div className="bg-gray-100 p-2 rounded text-xs mt-2">
                  <code>array.indexOf(item) // Returns index or -1</code><br/>
                  <code>array.includes(item) // Returns true/false</code>
                </div>
              </div>
              
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <p className="font-medium mb-2">Binary Search</p>
                <p className="text-sm">
                  For sorted arrays, it's much faster by dividing the search space in half each time.
                </p>
                <div className="bg-gray-100 p-2 rounded text-xs mt-2">
                  <code>// For sorted arrays only</code><br/>
                  <code>// Time: O(log n) vs O(n) for linear search</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      hints:
        "Understanding array algorithms is crucial for technical interviews and efficient problem-solving!",
    },
    // Add more content sections as needed
  ],
};

export default ArrayAlgorithmsData;
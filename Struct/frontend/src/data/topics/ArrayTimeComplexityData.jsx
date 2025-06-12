import React from "react";
import { FaClock, FaLightbulb } from "react-icons/fa";

const ArrayTimeComplexityData = {
  label: "Array Time Complexity",
  icon: <FaClock className="text-4xl text-green-300" />,
  content: [
    {
      title: "Understanding Array Time Complexity",
      content: (
        <div className="space-y-4">
          <p className="text-lg font-medium text-green-600">
            How Fast Are Array Operations? ⏱️
          </p>
          
          <p>
            When working with arrays, it's important to understand how efficient different operations are.
            This is measured using Big O notation, which describes how an operation's performance scales with input size.
          </p>
          
          <div className="bg-green-50 p-5 rounded-lg border border-green-200">
            <h3 className="font-medium mb-3 text-center">Common Array Operations</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                <p className="font-medium text-green-600 mb-2">Constant Time O(1)</p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Accessing by index: <code>array[5]</code></li>
                  <li>Insert/remove at end: <code>push()/pop()</code></li>
                  <li>Get array length: <code>array.length</code></li>
                </ul>
              </div>
              
              <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                <p className="font-medium text-amber-600 mb-2">Linear Time O(n)</p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Finding an element: <code>indexOf()</code></li>
                  <li>Insert/remove at beginning: <code>unshift()/shift()</code></li>
                  <li>Iterating: <code>forEach(), map(), filter()</code></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mt-4">
            <p className="text-center font-medium mb-2">Why Should You Care?</p>
            <p className="text-sm">
              Understanding time complexity helps you write more efficient code. For example,
              if you need to frequently insert items at the beginning of a collection,
              an array might not be the best choice because it has O(n) complexity for that operation.
            </p>
          </div>
        </div>
      ),
      hints:
        "When working with large datasets, always consider the time complexity of your operations!",
    },
    // Add more content sections as needed
  ],
};

export default ArrayTimeComplexityData;
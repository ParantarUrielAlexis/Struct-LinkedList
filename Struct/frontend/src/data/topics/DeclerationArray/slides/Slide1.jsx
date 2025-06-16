import React, { useState } from "react";
import { FaCode, FaInfoCircle, FaLightbulb } from "react-icons/fa";

const Slide1 = () => {
  const [showFunFact, setShowFunFact] = useState(false);

  return (
    <div className="space-y-4">
      <p className="text-lg font-medium text-blue-600">
        Introduction to Array Declaration 🚀
      </p>
      
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-5 rounded-lg border border-blue-200 shadow-md transform hover:scale-[1.01] transition-transform">
        <p>
          Arrays are one of the most fundamental data structures in programming, allowing us to store 
          multiple values in a single variable. They serve as ordered collections that can hold any type of data.
        </p>
        
        <div className="mt-4 flex flex-wrap gap-4 justify-center">
          {["Ordered 📋", "Indexed 🔢", "Dynamic 🔄", "Versatile 🌈"].map((trait, i) => (
            <div key={i} className="bg-white p-3 rounded-lg shadow-sm border border-blue-100 transform hover:rotate-2 transition-transform">
              <p className="font-medium text-center">{trait}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <h3 className="font-medium text-blue-700 mb-2 flex items-center">
            <FaCode className="mr-2 text-blue-500" /> Declaration Methods
          </h3>
          <ul className="space-y-1 text-sm">
            <li className="flex items-start">
              <span className="bg-blue-100 text-xs rounded-full px-2 py-0.5 mr-2 mt-0.5">1</span>
              Array literal: <code className="bg-gray-100 px-1 rounded ml-1">const arr = [1, 2, 3];</code>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-100 text-xs rounded-full px-2 py-0.5 mr-2 mt-0.5">2</span>
              Array constructor: <code className="bg-gray-100 px-1 rounded ml-1">const arr = new Array(1, 2, 3);</code>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-100 text-xs rounded-full px-2 py-0.5 mr-2 mt-0.5">3</span>
              Empty array: <code className="bg-gray-100 px-1 rounded ml-1">const empty = [];</code>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-100 text-xs rounded-full px-2 py-0.5 mr-2 mt-0.5">4</span>
              Array.of(): <code className="bg-gray-100 px-1 rounded ml-1">const arr = Array.of(1, 2, 3);</code>
            </li>
          </ul>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <h3 className="font-medium text-blue-700 mb-2 flex items-center">
            <FaLightbulb className="mr-2 text-yellow-500" /> Key Points
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Arrays use zero-based indexing (first element is at position 0)
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              JavaScript arrays are dynamically sized (they grow as needed)
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Arrays can store mixed data types in JavaScript
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              The <code className="bg-gray-100 px-1 rounded">length</code> property gives the number of elements
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md font-mono text-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
        <div className="relative">
          <p className="text-yellow-400">// Different ways to declare arrays</p>
          <p className="text-green-400">const fruits = ["apple", "banana", "orange"];</p>
          <p className="text-green-400">const numbers = new Array(1, 2, 3, 4, 5);</p>
          <p className="text-green-400">const mixed = [42, "hello", true, {'{'}name: "Alex"{'}'}];</p>
          <p className="text-blue-400">console.log(fruits.length); // 3</p>
          <p className="text-blue-400">console.log(fruits[0]); // "apple"</p>
        </div>
      </div>

      <button 
        onClick={() => setShowFunFact(!showFunFact)} 
        className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-2 px-4 rounded-md flex items-center justify-center w-full transition-colors"
      >
        <FaLightbulb className="mr-2 text-yellow-500" /> Click for a fun fact!
      </button>
      
      {showFunFact && (
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 animate-fadeIn relative">
          <p className="text-sm">
            <span className="font-bold">Fun Fact:</span> If you create an array with the Array constructor 
            and pass just one number, it creates an empty array with that length! For example, 
            <code className="bg-yellow-100 px-1 rounded mx-1">new Array(3)</code> creates 
            <code className="bg-yellow-100 px-1 rounded mx-1">[empty × 3]</code>, not 
            <code className="bg-yellow-100 px-1 rounded mx-1">[3]</code>. This can be a common source of confusion!
          </p>
          <div className="absolute -top-2 -right-2 bg-yellow-100 rounded-full p-1">
            <FaInfoCircle className="text-yellow-500" />
          </div>
        </div>
      )}
      
      <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
        <h3 className="font-medium text-center mb-2">When to Use Arrays</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <div className="bg-white p-2 rounded border border-indigo-100">
            <p className="font-medium">✅ Use arrays when you need:</p>
            <ul className="list-disc list-inside text-gray-700 text-xs space-y-1 mt-1">
              <li>An ordered collection of items</li>
              <li>Fast access by numeric index</li>
              <li>To iterate through all elements</li>
              <li>Stack or queue functionality</li>
            </ul>
          </div>
          <div className="bg-white p-2 rounded border border-indigo-100">
            <p className="font-medium">❌ Consider alternatives when:</p>
            <ul className="list-disc list-inside text-gray-700 text-xs space-y-1 mt-1">
              <li>You need key-value pairs (use objects)</li>
              <li>You need unique values (use Sets)</li>
              <li>You need very fast lookups (use Maps)</li>
              <li>Data is deeply hierarchical (use trees)</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
        <p className="font-medium">Ready to declare your own arrays?</p>
        <p className="text-sm mt-1">Let's continue to explore the different ways to create arrays in JavaScript!</p>
      </div>
    </div>
  );
};

export default Slide1;
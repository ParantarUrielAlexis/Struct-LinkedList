import React from "react";
import { FaCode, FaLightbulb } from "react-icons/fa";

const ArrayDeclarationData = {
  label: "Array Declaration",
  icon: <FaCode className="text-4xl text-blue-300" />,
  content: [
    {
      title: "Declaring Arrays",
      content: (
        <div className="space-y-4">
          <p className="text-lg font-medium text-blue-600">
            Creating Your First Array 📋
          </p>
          
          <p>
            There are several ways to create arrays in JavaScript. Let's explore the most common methods:
          </p>
          
          <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
            <h3 className="font-medium mb-3">Array Literal Notation</h3>
            <p className="mb-3 text-sm">
              The most common way to create an array is using square brackets:
            </p>
            <div className="bg-gray-800 text-white p-3 rounded font-mono text-sm">
              <p>// Creating an array of numbers</p>
              <p className="text-green-400">const scores = [75, 82, 93, 68, 97];</p>
              <p></p>
              <p>// Creating an array of strings</p>
              <p className="text-green-400">const fruits = ["apple", "banana", "orange"];</p>
            </div>
          </div>
          
          <div className="bg-purple-50 p-5 rounded-lg border border-purple-200 mt-4">
            <h3 className="font-medium mb-3">Array Constructor</h3>
            <p className="mb-3 text-sm">
              You can also use the Array constructor:
            </p>
            <div className="bg-gray-800 text-white p-3 rounded font-mono text-sm">
              <p>// Creating an empty array</p>
              <p className="text-green-400">const emptyArray = new Array();</p>
              <p></p>
              <p>// Creating an array with predefined length</p>
              <p className="text-green-400">const arrayWithSize = new Array(5);</p>
              <p></p>
              <p>// Creating an array with initial values</p>
              <p className="text-green-400">const colors = new Array("red", "green", "blue");</p>
            </div>
          </div>
          
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
            <p className="font-medium flex items-center">
              <FaLightbulb className="text-yellow-500 mr-2" />
              Pro Tip:
            </p>
            <p className="text-sm">
              Array literals (using []) are generally preferred over the constructor syntax
              as they're more concise and less prone to unexpected behavior.
            </p>
          </div>
        </div>
      ),
      hints:
        "Use array literals [1, 2, 3] for most array creation scenarios.",
    },
    // Add more content sections as needed
  ],
};

export default ArrayDeclarationData;
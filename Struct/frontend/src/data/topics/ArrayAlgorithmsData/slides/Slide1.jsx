import React from "react";
import { FaRedo } from "react-icons/fa";

const Slide1 = () => {
  return (
    <div className="space-y-4">
      <p>
        Sorting algorithms are methods used to reorder elements in a list or array 
        into a specific sequence, such as ascending or descending order.
      </p>
      <p>Why are sorting algorithms important?</p>
      <ul className="list-disc list-inside pl-2">
        <li>They improve search efficiency</li>
        <li>They help organize data</li>
        <li>They enable other algorithms (like binary search)</li>
        <li>They're fundamental to computer science education</li>
      </ul>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-blue-50 p-3 rounded border border-blue-100 transform hover:scale-105 transition-transform cursor-pointer">
          <h4 className="font-medium">Selection Sort</h4>
          <p className="text-sm">Repeatedly finds the minimum element and places it at the beginning</p>
          <p className="text-xs mt-1 text-blue-700">Time Complexity: O(n²)</p>
        </div>
        <div className="bg-green-50 p-3 rounded border border-green-100 transform hover:scale-105 transition-transform cursor-pointer">
          <h4 className="font-medium">Bubble Sort</h4>
          <p className="text-sm">Repeatedly compares adjacent elements and swaps them if needed</p>
          <p className="text-xs mt-1 text-green-700">Time Complexity: O(n²)</p>
        </div>
        <div className="bg-yellow-50 p-3 rounded border border-yellow-100 transform hover:scale-105 transition-transform cursor-pointer">
          <h4 className="font-medium">Insertion Sort</h4>
          <p className="text-sm">Builds the sorted array one item at a time</p>
          <p className="text-xs mt-1 text-yellow-700">Time Complexity: O(n²)</p>
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100 animate-pulse">
        <p className="font-medium text-center">In this module, we'll explore these three fundamental sorting algorithms</p>
        <p className="text-sm text-center mt-2">Get ready for interactive animations, games, and hands-on challenges!</p>
      </div>
      
      
    </div>
  );
};

export default Slide1;
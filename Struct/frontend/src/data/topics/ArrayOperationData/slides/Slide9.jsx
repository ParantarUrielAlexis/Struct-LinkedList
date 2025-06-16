import React from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaLightbulb, FaClipboardCheck, FaStar, FaCode, FaPuzzlePiece } from "react-icons/fa";

const Slide9LearningTakeaways = () => {
  const takeaways = [
    {
      title: "Array Fundamentals",
      icon: <FaClipboardCheck className="text-blue-500" />,
      points: [
        "Arrays are ordered collections that store multiple values in a single variable",
        "JavaScript arrays are zero-indexed: the first element is at position [0]",
        "Arrays can contain any data type, including mixed types and other arrays",
        "Array length is dynamic and automatically updated when elements are added or removed"
      ]
    },
    {
      title: "Accessing Elements",
      icon: <FaCode className="text-indigo-500" />,
      points: [
        "Use bracket notation [index] to access individual elements",
        "Negative indices aren't supported natively (arr[-1] doesn't get the last element)",
        "Use array.length - 1 to access the last element",
        "Destructuring provides a concise way to extract multiple values from arrays"
      ]
    },
    {
      title: "Adding & Removing Elements",
      icon: <FaPuzzlePiece className="text-green-500" />,
      points: [
        "push() adds elements to the end, pop() removes from the end",
        "unshift() adds elements to the beginning, shift() removes from the beginning",
        "splice() can add, remove, or replace elements at any position",
        "Be mindful of performance: operations at the beginning (unshift/shift) are slower than at the end (push/pop)"
      ]
    },
    {
      title: "Searching Arrays",
      icon: <FaStar className="text-amber-500" />,
      points: [
        "indexOf() and lastIndexOf() return the position of an element (or -1 if not found)",
        "includes() returns a boolean indicating if an element exists",
        "find() and findIndex() use a callback function to find elements based on conditions",
        "filter() creates a new array with all elements that pass a test condition"
      ]
    },
    {
      title: "Merging & Splitting",
      icon: <FaLightbulb className="text-purple-500" />,
      points: [
        "concat() and spread operator (...) create new arrays by combining existing ones",
        "slice() extracts a portion of an array without modifying the original",
        "splice() can modify arrays by removing or replacing elements",
        "Set objects can be used with spread syntax to remove duplicates when merging arrays"
      ]
    },
    {
      title: "Best Practices",
      icon: <FaCheckCircle className="text-rose-500" />,
      points: [
        "Favor non-mutating methods when you want to preserve the original array",
        "Use modern array methods like map(), filter(), and reduce() for clean, functional code",
        "Pay attention to which methods return new arrays vs. modify existing ones",
        "Consider performance implications when working with large arrays"
      ]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-blue-800 mb-2">Learning Takeaways</h2>
        <p className="text-gray-700 max-w-2xl mx-auto">
          Mastering array operations is fundamental to JavaScript programming. Here's a summary of key concepts covered in this module.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {takeaways.map((takeaway, index) => (
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4">
              <div className="flex items-center">
                <div className="bg-white p-2 rounded-full mr-3">
                  {takeaway.icon}
                </div>
                <h3 className="text-xl font-bold text-white">{takeaway.title}</h3>
              </div>
            </div>
            <div className="p-5">
              <ul className="space-y-2">
                {takeaway.points.map((point, pointIndex) => (
                  <motion.li
                    key={pointIndex}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 + pointIndex * 0.1 }}
                    className="flex items-start"
                  >
                    <div className="flex-shrink-0 h-5 w-5 relative top-0.5 mr-2">
                      <div className="absolute inset-0 bg-blue-500 opacity-20 rounded-full"></div>
                      <div className="absolute inset-0 border-2 border-blue-500 rounded-full"></div>
                      <div className="absolute inset-2 bg-blue-500 rounded-full"></div>
                    </div>
                    <span className="text-gray-700">{point}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-5 border border-amber-100"
      >
        <div className="flex items-start">
          <div className="bg-amber-100 p-3 rounded-full mr-4">
            <FaLightbulb className="text-xl text-amber-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-amber-800 mb-2">Applied Learning</h3>
            <p className="text-gray-700 mb-4">
              Now that you understand these array operations, you can:
            </p>
            <ul className="space-y-2">
              <li className="flex items-center">
                <div className="h-2 w-2 bg-amber-500 rounded-full mr-2"></div>
                <span>Process and transform data collections efficiently</span>
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 bg-amber-500 rounded-full mr-2"></div>
                <span>Build more dynamic and responsive web applications</span>
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 bg-amber-500 rounded-full mr-2"></div>
                <span>Write cleaner, more maintainable code using array methods</span>
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 bg-amber-500 rounded-full mr-2"></div>
                <span>Solve complex problems with data manipulation techniques</span>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Slide9LearningTakeaways;
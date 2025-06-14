import React, { useState } from "react";
import { motion } from "framer-motion";

const Slide2Accessing = () => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showMessage, setShowMessage] = useState("");
  const [inputIndex, setInputIndex] = useState("");
  
  const fruitArray = ["🍎", "🍌", "🍊", "🥝", "🍇", "🍓", "🍍"];
  
  const handleIndexClick = (index) => {
    setSelectedIndex(index);
    setShowMessage(`fruitArray[${index}] = "${fruitArray[index]}"`);
  };
  
  const handleAccessFruit = () => {
    const index = parseInt(inputIndex);
    if (isNaN(index)) {
      setShowMessage("Please enter a valid number");
      return;
    }
    
    if (index >= 0 && index < fruitArray.length) {
      setSelectedIndex(index);
      setShowMessage(`fruitArray[${index}] = "${fruitArray[index]}"`);
    } else {
      setShowMessage(`Index out of bounds! Valid range: 0 to ${fruitArray.length - 1}`);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-orange-600">Accessing Array Elements</h2>
      
      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
        <p className="text-lg mb-2">Array elements are accessed using <span className="font-mono bg-orange-100 px-1 rounded">array[index]</span> syntax.</p>
        <p className="font-bold text-gray-700">Remember: Arrays in JavaScript are zero-indexed!</p>
      </div>
      
      <div className="bg-gray-800 p-5 rounded-lg">
        <div className="mb-6">
          <div className="flex text-center mb-3">
            <div className="w-12 text-xs text-gray-400">Index:</div>
            {fruitArray.map((_, i) => (
              <div key={`index-${i}`} className="w-12 text-xs text-gray-400">{i}</div>
            ))}
          </div>
          
          <div className="flex text-center">
            <div className="w-12 text-xs text-gray-400">Value:</div>
            {fruitArray.map((fruit, i) => (
              <motion.div 
                key={`fruit-${i}`}
                className={`w-12 h-12 flex items-center justify-center text-2xl cursor-pointer rounded ${selectedIndex === i ? 'bg-orange-500' : 'bg-gray-700'}`}
                onClick={() => handleIndexClick(i)}
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {fruit}
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="text-white flex justify-center text-lg font-mono">
          {showMessage && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-700 py-2 px-4 rounded"
            >
              {showMessage}
            </motion.div>
          )}
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-xl font-bold text-orange-600 mb-3">Try It Yourself!</h3>
        <div className="flex space-x-3">
          <div className="flex-1">
            <label className="block text-gray-700 mb-1">Enter an index:</label>
            <input
              type="text"
              value={inputIndex}
              onChange={(e) => setInputIndex(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="0-6"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleAccessFruit}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Access
            </button>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 className="font-bold text-lg text-blue-700 mb-2">Advanced Tip: Negative Indices</h3>
        <p>Many array methods accept negative indices to access elements from the end:</p>
        <pre className="bg-gray-800 text-white p-3 rounded mt-2 text-sm overflow-x-auto">
          const fruits = ["🍎", "🍌", "🍊"];<br/>
          fruits.slice(-2); // Returns ["🍌", "🍊"]
        </pre>
      </div>
    </div>
  );
};

export default Slide2Accessing;
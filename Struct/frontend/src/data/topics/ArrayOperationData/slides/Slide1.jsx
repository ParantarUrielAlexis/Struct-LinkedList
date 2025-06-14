import React, { useState } from "react";
import { motion } from "framer-motion";

const Slide1Introduction = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  const startAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 2000);
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-blue-600">Array Operations: The Swiss Army Knife of Data Handling</h2>
      
      <div className="text-lg">
        <p>Arrays are fundamental data structures that store collections of items, allowing you to:</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { icon: "🔍", title: "Search", desc: "Find specific elements quickly" },
          { icon: "✂️", title: "Modify", desc: "Add, remove, or update elements" },
          { icon: "🔄", title: "Transform", desc: "Convert data between different formats" },
          { icon: "⚡", title: "Optimize", desc: "Improve application performance" }
        ].map((item, idx) => (
          <motion.div 
            key={idx}
            className="bg-blue-50 p-4 rounded-lg shadow-md border-2 border-blue-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{item.icon}</span>
              <div>
                <h3 className="font-bold text-blue-800">{item.title}</h3>
                <p className="text-gray-700">{item.desc}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8">
        <button
          onClick={startAnimation}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full shadow-lg transition-all"
        >
          See Array Magic!
        </button>

        <div className="mt-4 bg-gray-800 rounded-lg p-4 font-mono text-sm text-white overflow-x-auto">
          <p className="text-green-400">// Arrays allow elegant solutions to complex problems:</p>
          <p className="text-white">const numbers = [1, 2, 3, 4, 5];</p>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ 
              opacity: isAnimating ? 1 : 0, 
              x: isAnimating ? 0 : -20 
            }}
            className="text-yellow-300 mt-1"
          >
            {`const sum = numbers.reduce((total, num) => total + num, 0);`}
            <span className="text-pink-400"> // Result: 15</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ 
              opacity: isAnimating ? 1 : 0, 
              x: isAnimating ? 0 : -20,
              transition: { delay: 0.3 } 
            }}
            className="text-yellow-300 mt-1"
          >
            const doubled = numbers.map(num ={">"} num * 2);
            <span className="text-pink-400"> // Result: [2, 4, 6, 8, 10]</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ 
              opacity: isAnimating ? 1 : 0, 
              x: isAnimating ? 0 : -20,
              transition: { delay: 0.6 } 
            }}
            className="text-yellow-300 mt-1"
          >
            const evenNumbers = numbers.filter(num ={">"} num % 2 === 0);
            <span className="text-pink-400"> {/* Result: [2, 4] */}</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Slide1Introduction;
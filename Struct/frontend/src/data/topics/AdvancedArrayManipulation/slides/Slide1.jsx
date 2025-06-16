import React, { useState } from "react";
import { motion } from "framer-motion";

const Slide1 = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [result, setResult] = useState("");
  
  const startAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 2000);
  };

  const demonstrateMethod = (method) => {
    setSelectedMethod(method);
    
    const sampleArray = [3, 7, 2, 9, 5, 1, 8];
    let output = "";
    
    switch(method) {
      case "sort":
        output = `[${sampleArray.sort((a, b) => a - b)}]`;
        break;
      case "find":
        output = `${sampleArray.find(num => num > 5)}`;
        break;
      case "some":
        output = `${sampleArray.some(num => num % 2 === 0)}`;
        break;
      case "every":
        output = `${sampleArray.every(num => num > 0)}`;
        break;
      case "flatMap":
        output = `[${sampleArray.flatMap(num => num % 2 === 0 ? [num, num * 2] : [num])}]`;
        break;
      case "reduce":
        const initialObject = { even: 0, odd: 0 };
        const counted = sampleArray.reduce((result, num) => {
          num % 2 === 0 ? result.even++ : result.odd++;
          return result;
        }, initialObject);
        output = `{ even: ${counted.even}, odd: ${counted.odd} }`;
        break;
      default:
        output = "";
    }
    
    setResult(output);
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-purple-600">Advanced Array Manipulation: Beyond the Basics</h2>
      
      <div className="text-lg">
        <p>Master these powerful techniques to level up your array manipulation skills:</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { 
            icon: "🔄", 
            title: "sort()", 
            desc: "Arrange elements in custom order",
            code: "array.sort((a, b) => a - b)" 
          },
          { 
            icon: "🔍", 
            title: "find()", 
            desc: "Get the first matching element", 
            code: "array.find(el => el > 5)"
          },
          { 
            icon: "❓", 
            title: "some()", 
            desc: "Check if any element matches", 
            code: "array.some(el => el % 2 === 0)"
          },
          { 
            icon: "✓", 
            title: "every()", 
            desc: "Verify all elements match", 
            code: "array.every(el => el > 0)"
          },
          { 
            icon: "📊", 
            title: "flatMap()", 
            desc: "Transform and flatten results", 
            code: "array.flatMap(x => [x, x * 2])"
          },
          { 
            icon: "🔄", 
            title: "reduce()", 
            desc: "Transform array into complex output", 
            code: "array.reduce((acc, val) => {...}, init)"
          }
        ].map((item, idx) => (
          <motion.div 
            key={idx}
            className={`p-4 rounded-lg shadow-md border-2 cursor-pointer ${
              selectedMethod === item.title.replace("()", "") ? 
              "bg-purple-100 border-purple-400" : 
              "bg-purple-50 border-purple-200"
            }`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => demonstrateMethod(item.title.replace("()", ""))}
          >
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{item.icon}</span>
              <div>
                <h3 className="font-bold text-purple-800">{item.title}</h3>
                <p className="text-gray-700">{item.desc}</p>
                <p className="font-mono text-xs mt-1 text-purple-600">{item.code}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8">
        <button
          onClick={startAnimation}
          className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-6 rounded-full shadow-lg transition-all"
        >
          Show Advanced Examples
        </button>

        <div className="mt-6 bg-gray-800 rounded-lg p-4 font-mono text-sm text-white overflow-x-auto">
          <p className="text-green-400">// Advanced array manipulations in action:</p>
          <p className="text-white">const data = [3, 7, 2, 9, 5, 1, 8];</p>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ 
              opacity: isAnimating ? 1 : 0, 
              x: isAnimating ? 0 : -20 
            }}
            className="text-yellow-300 mt-1"
          >
            {`// Chain multiple array methods together`}
            <p className="text-blue-300">
              const processedData = data
                .filter(n ={">"} n {">"} 3)
                .sort((a, b) ={">"} a - b)
                .map(n ={">"} n * 2);
            </p>
            <span className="text-pink-400">// Result: [10, 14, 16, 18]</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ 
              opacity: isAnimating ? 1 : 0, 
              x: isAnimating ? 0 : -20,
              transition: { delay: 0.4 } 
            }}
            className="text-yellow-300 mt-3"
          >
            {`// Use reduce to create a complex data structure`}
            <p className="text-blue-300">
              {`const stats = data.reduce((acc, val) => {
  return {
    sum: acc.sum + val,
    product: acc.product * val, 
    max: Math.max(acc.max, val)
  };
}, { sum: 0, product: 1, max: -Infinity });`}
            </p>
            <span className="text-pink-400">// Result: {`{ sum: 35, product: 1890, max: 9 }`}</span>
          </motion.div>
        </div>

        {selectedMethod && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-purple-100 rounded-lg border-2 border-purple-300"
          >
            <h3 className="text-xl font-bold text-purple-700">Method: <code>{selectedMethod}()</code></h3>
            <div className="font-mono bg-white p-3 rounded mt-2">
              <p className="text-gray-600">// Input</p>
              <p className="text-gray-800">const array = [3, 7, 2, 9, 5, 1, 8];</p>
              <p className="text-gray-600 mt-2">// Result</p>
              <p className="text-purple-600 font-bold">{result}</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Slide1;
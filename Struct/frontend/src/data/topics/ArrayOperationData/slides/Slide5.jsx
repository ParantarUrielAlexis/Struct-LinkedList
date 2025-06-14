import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Slide5Searching = () => {
  const initialArray = ["🍎", "🍌", "🍓", "🥝", "🍊", "🍏", "🍒", "🍍"];
  const [array, setArray] = useState(initialArray);
  const [searchTerm, setSearchTerm] = useState("🍓");
  const [searchMethod, setSearchMethod] = useState("indexOf");
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [highlightedIndices, setHighlightedIndices] = useState([]);
  const [currentHighlight, setCurrentHighlight] = useState(-1);
  
  const performSearch = () => {
    setIsSearching(true);
    setHighlightedIndices([]);
    setCurrentHighlight(-1);
    
    // Reset previous results
    setSearchResult(null);
    
    // Simulate search animation
    const indices = [];
    let foundIndex = -1;
    let foundItem = null;
    
    const animateSearch = async () => {
      for (let i = 0; i < array.length; i++) {
        // Highlight current element
        setCurrentHighlight(i);
        
        // Wait for animation
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Found logic
        if (array[i] === searchTerm) {
          indices.push(i);
          if (searchMethod === "indexOf") {
            foundIndex = i;
            foundItem = array[i];
            break;  // indexOf returns first occurrence
          } else if (searchMethod === "find") {
            foundIndex = i;
            foundItem = array[i];
            break;  // find returns first occurrence
          }
          // includes and lastIndexOf continue searching
        }
      }
      
      // Special case for lastIndexOf
      if (searchMethod === "lastIndexOf" && indices.length > 0) {
        foundIndex = indices[indices.length - 1];
        foundItem = array[foundIndex];
      }
      
      setHighlightedIndices(indices);
      setCurrentHighlight(-1);
      setIsSearching(false);
      
      // Set result based on search method
      switch(searchMethod) {
        case "indexOf":
          setSearchResult(foundIndex);
          break;
        case "lastIndexOf":
          setSearchResult(foundIndex);
          break;
        case "includes":
          setSearchResult(indices.length > 0);
          break;
        case "find":
          setSearchResult(foundItem);
          break;
        default:
          setSearchResult(null);
      }
    };
    
    animateSearch();
  };

  const formatResult = () => {
    if (searchResult === null) return "No result yet";
    
    switch(searchMethod) {
      case "indexOf":
      case "lastIndexOf":
        return searchResult === -1 ? "Not found (-1)" : `Found at index: ${searchResult}`;
      case "includes":
        return searchResult ? "Found (true)" : "Not found (false)";
      case "find":
        return searchResult ? `Found: ${searchResult}` : "Not found (undefined)";
      default:
        return "Unknown result";
    }
  };
  
  const getMethodColor = () => {
    switch(searchMethod) {
      case "indexOf": return "text-blue-600";
      case "lastIndexOf": return "text-green-600";
      case "includes": return "text-purple-600";
      case "find": return "text-orange-600";
      default: return "text-gray-600";
    }
  };
  
  const getMethodSyntax = () => {
    switch(searchMethod) {
      case "indexOf": 
        return `array.indexOf("${searchTerm}") → ${searchResult !== null ? searchResult : "?"}`;
      case "lastIndexOf": 
        return `array.lastIndexOf("${searchTerm}") → ${searchResult !== null ? searchResult : "?"}`;
      case "includes": 
        return `array.includes("${searchTerm}") → ${searchResult !== null ? String(searchResult) : "?"}`;
      case "find": 
        return `array.find(item => item === "${searchTerm}") → ${searchResult !== null ? `"${searchResult}"` : "?"}`;
      default: 
        return "";
    }
  };
  
  const shuffle = () => {
    const shuffled = [...initialArray];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setArray(shuffled);
    setSearchResult(null);
    setHighlightedIndices([]);
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-blue-600">Searching Array Elements</h2>
      
      <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-md">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Search Method:</label>
            <select
              value={searchMethod}
              onChange={(e) => {
                setSearchMethod(e.target.value);
                setSearchResult(null);
                setHighlightedIndices([]);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSearching}
            >
              <option value="indexOf">indexOf</option>
              <option value="lastIndexOf">lastIndexOf</option>
              <option value="includes">includes</option>
              <option value="find">find</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">Search For:</label>
            <select
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSearchResult(null);
                setHighlightedIndices([]);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSearching}
            >
              {[...new Set(initialArray)].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex-1 flex items-end justify-end gap-3">
            <button
              onClick={performSearch}
              disabled={isSearching}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
            >
              {isSearching ? "Searching..." : "Search"}
            </button>
            
            <button
              onClick={shuffle}
              disabled={isSearching}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
            >
              Shuffle Array
            </button>
          </div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex justify-center items-center mb-8">
            <div className="flex flex-wrap justify-center gap-1">
              {array.map((item, index) => (
                <motion.div
                  key={index}
                  className={`relative w-12 h-12 flex items-center justify-center m-1 rounded-lg border-2 text-2xl
                    ${currentHighlight === index ? 'bg-yellow-300 border-yellow-500' : 
                      highlightedIndices.includes(index) ? 'bg-green-300 border-green-500' : 
                      'bg-white border-gray-300'}`}
                  animate={currentHighlight === index ? { y: [0, -10, 0] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  {item}
                  <div className="absolute -bottom-6 text-xs text-gray-400">{index}</div>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center">
            <div className="text-center">
              <div className={`text-xl font-mono mb-2 ${getMethodColor()}`}>
                {getMethodSyntax()}
              </div>
              <AnimatePresence mode="wait">
                {searchResult !== null && (
                  <motion.div
                    key={String(searchResult)}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-gray-700 text-white py-2 px-4 rounded-md"
                  >
                    {formatResult()}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h3 className="font-bold text-lg text-blue-700 mb-2">Method Comparison</h3>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-blue-100">
                <th className="py-2 px-3 text-left">Method</th>
                <th className="py-2 px-3 text-left">Returns</th>
                <th className="py-2 px-3 text-left">If Not Found</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-3 font-mono">indexOf()</td>
                <td className="py-2 px-3">First index</td>
                <td className="py-2 px-3">-1</td>
              </tr>
              <tr className="bg-blue-50">
                <td className="py-2 px-3 font-mono">lastIndexOf()</td>
                <td className="py-2 px-3">Last index</td>
                <td className="py-2 px-3">-1</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-mono">includes()</td>
                <td className="py-2 px-3">Boolean</td>
                <td className="py-2 px-3">false</td>
              </tr>
              <tr className="bg-blue-50">
                <td className="py-2 px-3 font-mono">find()</td>
                <td className="py-2 px-3">Element</td>
                <td className="py-2 px-3">undefined</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
          <h3 className="font-bold text-lg text-yellow-700 mb-2">Pro Tips</h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="mr-2 text-yellow-500">🔍</span>
              <span>Use <span className="font-mono bg-yellow-100 px-1">includes()</span> for simple presence checks</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-yellow-500">🔍</span>
              <span>Use <span className="font-mono bg-yellow-100 px-1">indexOf()</span> when you need the position</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-yellow-500">🔍</span>
              <span>Use <span className="font-mono bg-yellow-100 px-1">find()</span> for complex search criteria</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-yellow-500">⚠️</span>
              <span>Check for <span className="font-mono bg-yellow-100 px-1">-1</span> when using index methods!</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Slide5Searching;
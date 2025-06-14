import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Slide7MergingSplitting = () => {
  const [arrayA, setArrayA] = useState(["🐱", "🐶", "🐭"]);
  const [arrayB, setArrayB] = useState(["🦊", "🦁", "🐯"]);
  const [mergedArray, setMergedArray] = useState(null);
  const [splitResult, setSplitResult] = useState(null);
  const [splitMethod, setSplitMethod] = useState("slice");
  const [sliceStart, setSliceStart] = useState(1);
  const [sliceEnd, setSliceEnd] = useState(3);
  const [spliceStart, setSpliceStart] = useState(1);
  const [spliceDelete, setSpliceDelete] = useState(2);
  const [spliceItems, setSpliceItems] = useState("🦄");
  const [activeTab, setActiveTab] = useState("merge");
  
  // Merging methods
  const mergeConcatenate = () => {
    const result = [...arrayA, ...arrayB];
    setMergedArray({ method: "concatenate", array: result });
  };
  
  const mergePush = () => {
    const result = [...arrayA];
    arrayB.forEach(item => result.push(item));
    setMergedArray({ method: "push", array: result });
  };
  
  const mergeConcat = () => {
    const result = arrayA.concat(arrayB);
    setMergedArray({ method: "concat", array: result });
  };
  
  // Splitting methods
  const handleSlice = () => {
    const start = parseInt(sliceStart);
    const end = parseInt(sliceEnd);
    
    if (isNaN(start) || isNaN(end)) {
      alert("Please enter valid numbers");
      return;
    }
    
    const sourceArray = [...arrayA, ...arrayB];
    const result = sourceArray.slice(start, end);
    setSplitResult({
      method: "slice",
      original: sourceArray,
      result: result,
      description: `slice(${start}, ${end})`
    });
  };
  
  const handleSplice = () => {
    const start = parseInt(spliceStart);
    const deleteCount = parseInt(spliceDelete);
    
    if (isNaN(start) || isNaN(deleteCount)) {
      alert("Please enter valid numbers");
      return;
    }
    
    const sourceArray = [...arrayA, ...arrayB];
    const arrayCopy = [...sourceArray];
    
    // If splice items is empty, just remove items
    if (!spliceItems) {
      const removed = arrayCopy.splice(start, deleteCount);
      setSplitResult({
        method: "splice",
        original: sourceArray,
        result: arrayCopy,
        removed: removed,
        description: `splice(${start}, ${deleteCount})`
      });
    } else {
      // Convert emoji string to array of emojis
      const itemsToAdd = Array.from(spliceItems);
      const removed = arrayCopy.splice(start, deleteCount, ...itemsToAdd);
      setSplitResult({
        method: "splice",
        original: sourceArray,
        result: arrayCopy,
        removed: removed,
        description: `splice(${start}, ${deleteCount}, ${itemsToAdd.map(i => `"${i}"`).join(", ")})`
      });
    }
  };

  const renderArrayItems = (array, title, onChange = null, isEditable = false) => (
    <div className="mb-5">
      <div className="flex items-center mb-2">
        <h3 className="text-lg font-bold text-teal-700">{title}</h3>
        {isEditable && (
          <button
            onClick={() => onChange([...array, "🐸"])}
            className="ml-3 bg-teal-100 hover:bg-teal-200 text-teal-800 text-sm px-2 py-1 rounded"
          >
            Add 🐸
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {array.map((item, index) => (
          <motion.div
            key={`${title}-${index}-${item}`}
            className="bg-white border-2 border-teal-200 w-12 h-12 rounded-lg flex items-center justify-center text-2xl shadow-sm"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            {item}
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-teal-600">Merging & Splitting Arrays</h2>
      
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setActiveTab("merge")}
          className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
            activeTab === "merge" ? "bg-teal-500 text-white" : "bg-teal-100 text-teal-700 hover:bg-teal-200"
          }`}
        >
          Merging Arrays
        </button>
        <button
          onClick={() => setActiveTab("split")}
          className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
            activeTab === "split" ? "bg-teal-500 text-white" : "bg-teal-100 text-teal-700 hover:bg-teal-200"
          }`}
        >
          Splitting Arrays
        </button>
      </div>
      
      <AnimatePresence mode="wait">
        {activeTab === "merge" ? (
          <motion.div
            key="mergeTab"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="bg-white p-5 rounded-lg shadow-md border border-gray-200"
          >
            <h3 className="text-xl font-bold text-teal-700 mb-4">Merging Arrays</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                {renderArrayItems(arrayA, "Array A", setArrayA, true)}
              </div>
              <div>
                {renderArrayItems(arrayB, "Array B", setArrayB, true)}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 my-4">
              <button
                onClick={mergeConcatenate}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow-sm transition-colors"
              >
                Merge with Spread Operator
              </button>
              <button
                onClick={mergePush}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-md shadow-sm transition-colors"
              >
                Merge with push()
              </button>
              <button
                onClick={mergeConcat}
                className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-md shadow-sm transition-colors"
              >
                Merge with concat()
              </button>
            </div>
            
            {mergedArray && (
              <div className="mt-6 p-4 bg-teal-50 border border-teal-100 rounded-lg">
                <h4 className="text-lg font-semibold text-teal-700 mb-2">
                  Result using {mergedArray.method}
                </h4>
                {renderArrayItems(mergedArray.array, "Merged Array")}
                
                <div className="bg-white p-3 rounded border border-gray-200 mt-3">
                  <h5 className="font-medium text-gray-700 mb-1">Code:</h5>
                  <pre className="bg-gray-50 p-2 rounded text-sm">
                    {mergedArray.method === "concatenate"
                      ? "const mergedArray = [...arrayA, ...arrayB];"
                      : mergedArray.method === "push"
                      ? "const mergedArray = [...arrayA];\narrayB.forEach(item => mergedArray.push(item));"
                      : "const mergedArray = arrayA.concat(arrayB);"}
                  </pre>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="splitTab"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="bg-white p-5 rounded-lg shadow-md border border-gray-200"
          >
            <h3 className="text-xl font-bold text-teal-700 mb-4">Splitting Arrays</h3>
            
            <div className="mb-6">
              <h4 className="font-semibold text-gray-700 mb-2">Combined Array:</h4>
              {renderArrayItems([...arrayA, ...arrayB], "Source Array")}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <h4 className="text-lg font-semibold text-blue-700 mb-3">
                  <input
                    type="radio"
                    id="sliceMethod"
                    name="splitMethod"
                    checked={splitMethod === "slice"}
                    onChange={() => setSplitMethod("slice")}
                    className="mr-2"
                  />
                  <label htmlFor="sliceMethod">slice()</label>
                </h4>
                
                {splitMethod === "slice" && (
                  <div className="space-y-4">
                    <div className="bg-white p-3 rounded border border-gray-200">
                      <p className="text-sm text-gray-700 mb-2">
                        The <code className="bg-gray-100 px-1 rounded">slice(start, end)</code> method returns a shallow copy 
                        of a portion of an array into a new array without modifying the original array.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Index:</label>
                        <input
                          type="number"
                          value={sliceStart}
                          onChange={(e) => setSliceStart(e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Index:</label>
                        <input
                          type="number"
                          value={sliceEnd}
                          onChange={(e) => setSliceEnd(e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2"
                          min="0"
                        />
                      </div>
                    </div>
                    
                    <button
                      onClick={handleSlice}
                      className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow-sm transition-colors"
                    >
                      Apply slice()
                    </button>
                  </div>
                )}
              </div>
              
              <div className="p-4 bg-purple-50 border border-purple-100 rounded-lg">
                <h4 className="text-lg font-semibold text-purple-700 mb-3">
                  <input
                    type="radio"
                    id="spliceMethod"
                    name="splitMethod"
                    checked={splitMethod === "splice"}
                    onChange={() => setSplitMethod("splice")}
                    className="mr-2"
                  />
                  <label htmlFor="spliceMethod">splice()</label>
                </h4>
                
                {splitMethod === "splice" && (
                  <div className="space-y-4">
                    <div className="bg-white p-3 rounded border border-gray-200">
                      <p className="text-sm text-gray-700 mb-2">
                        The <code className="bg-gray-100 px-1 rounded">splice(start, deleteCount, ...items)</code> method 
                        changes the contents of an array by removing or replacing existing elements and/or adding new elements.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Index:</label>
                        <input
                          type="number"
                          value={spliceStart}
                          onChange={(e) => setSpliceStart(e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Delete Count:</label>
                        <input
                          type="number"
                          value={spliceDelete}
                          onChange={(e) => setSpliceDelete(e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2"
                          min="0"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Items to Add (emojis):</label>
                      <input
                        type="text"
                        value={spliceItems}
                        onChange={(e) => setSpliceItems(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        placeholder="🦄🌈✨"
                      />
                    </div>
                    
                    <button
                      onClick={handleSplice}
                      className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-md shadow-sm transition-colors"
                    >
                      Apply splice()
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {splitResult && (
              <div className="mt-6 p-4 bg-teal-50 border border-teal-100 rounded-lg">
                <h4 className="text-lg font-semibold text-teal-700 mb-2">
                  Result using {splitResult.method}
                </h4>
                
                {splitResult.method === "slice" ? (
                  <div>
                    {renderArrayItems(splitResult.result, "Extracted Array")}
                    <div className="mt-3 bg-white p-3 rounded border border-gray-200">
                      <h5 className="font-medium text-gray-700 mb-1">Code:</h5>
                      <pre className="bg-gray-50 p-2 rounded text-sm">
                        const extractedArray = sourceArray.{splitResult.description};
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div>
                    {renderArrayItems(splitResult.result, "Modified Array")}
                    
                    <div className="mt-3">
                      <h5 className="font-medium text-gray-700">Removed Elements:</h5>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {splitResult.removed.map((item, index) => (
                          <div 
                            key={`removed-${index}`}
                            className="bg-red-50 border border-red-200 w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-3 bg-white p-3 rounded border border-gray-200">
                      <h5 className="font-medium text-gray-700 mb-1">Code:</h5>
                      <pre className="bg-gray-50 p-2 rounded text-sm">
                        const arrayCopy = [...sourceArray];
                        const removedElements = arrayCopy.{splitResult.description};
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Slide7MergingSplitting;
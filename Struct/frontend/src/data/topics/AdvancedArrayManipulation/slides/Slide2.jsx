import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Slide2= () => {
  // Array visualization state
  const [visualArray, setVisualArray] = useState([1, 2, 3, 4, 5, 6, 7, 8]);
  const [operationResult, setOperationResult] = useState(null);
  const [activeMethod, setActiveMethod] = useState("splice");
  
  // Game state
  const [gameActive, setGameActive] = useState(false);
  const [gameArray, setGameArray] = useState([]);
  const [targetArray, setTargetArray] = useState([]);
  const [points, setPoints] = useState(500); // Start with 500 points
  const [moves, setMoves] = useState(0);
  const [level, setLevel] = useState(1);
  const [feedback, setFeedback] = useState("");
  const [showCelebration, setShowCelebration] = useState(false);
  // Add this state to track when to show the final modal
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  
  // Form inputs for array operations
  const [spliceStart, setSpliceStart] = useState(2);
  const [spliceDelete, setSpliceDelete] = useState(2);
  const [spliceItems, setSpliceItems] = useState("10, 11");
  const [fillValue, setFillValue] = useState(0);
  const [fillStart, setFillStart] = useState(2);
  const [fillEnd, setFillEnd] = useState(5);
  const [copyTarget, setCopyTarget] = useState(0);
  const [copyStart, setCopyStart] = useState(3);
  const [copyEnd, setCopyEnd] = useState(6);

  // Game parameters
  const [gameInputs, setGameInputs] = useState({
    method: "splice",
    param1: 0,
    param2: 0,
    param3: ""
  });
  
  useEffect(() => {
    if (showCelebration) {
      const timer = setTimeout(() => setShowCelebration(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showCelebration]);
  
  const methodInfo = {
    splice: {
      title: "splice()",
      description: "Changes array contents by removing, replacing, or adding elements",
      syntax: "array.splice(start, deleteCount, ...items)",
      example: "[1, 2, 3, 4].splice(1, 2, 'a', 'b') → [1, 'a', 'b', 4]"
    },
    fill: {
      title: "fill()",
      description: "Fills array elements with a static value from start to end indices",
      syntax: "array.fill(value, start, end)",
      example: "[1, 2, 3, 4].fill(0, 1, 3) → [1, 0, 0, 4]"
    },
    copyWithin: {
      title: "copyWithin()",
      description: "Copies part of array to another location within the same array",
      syntax: "array.copyWithin(target, start, end)",
      example: "[1, 2, 3, 4, 5].copyWithin(0, 3) → [4, 5, 3, 4, 5]"
    }
  };
  
  const runOperation = () => {
    const arrayCopy = [...visualArray];
    let result;
    
    try {
      switch (activeMethod) {
        case "splice":
          const items = spliceItems.split(",").map(item => item.trim());
          result = arrayCopy.splice(Number(spliceStart), Number(spliceDelete), ...items);
          setOperationResult({
            removed: result,
            newArray: arrayCopy
          });
          break;
          
        case "fill":
          result = arrayCopy.fill(Number(fillValue), Number(fillStart), Number(fillEnd));
          setOperationResult({
            newArray: result
          });
          break;
          
        case "copyWithin":
          result = arrayCopy.copyWithin(Number(copyTarget), Number(copyStart), Number(copyEnd));
          setOperationResult({
            newArray: result
          });
          break;
          
        default:
          setOperationResult(null);
      }
    } catch (error) {
      setOperationResult({ error: error.message });
    }
  };
  
  // Start a new game level
  const startGame = () => {
    // Different levels have different complexity
    const levelConfig = {
      1: { arraySize: 5 },
      2: { arraySize: 6 },
      3: { arraySize: 7 },
      4: { arraySize: 8 },
      5: { arraySize: 9 }
    };
    
    // Add level-specific questions
    const questions = [
      "Level 1: How would you add elements at position 2 in the array?",
      "Level 2: Can you replace multiple elements with a single value?",
      "Level 3: How would you copy part of an array to another position?",
      "Level 4: Can you remove elements without adding replacements?",
      "Level 5: Final challenge! Can you transform the array in one operation?"
    ];
    
    const config = levelConfig[level] || levelConfig[1];
    
    // Generate random starting array of numbers 1-9
    const startArray = Array.from({ length: config.arraySize }, 
      () => Math.floor(Math.random() * 9) + 1);
    
    // Generate target array (what player needs to achieve)
    // We'll create a modified version of the start array
    const target = [...startArray];
    
    // Apply 1-2 random modifications to create the target
    const numMods = Math.floor(Math.random() * 2) + 1;
    
    for (let i = 0; i < numMods; i++) {
      const modType = Math.floor(Math.random() * 3);
      
      switch (modType) {
        case 0: // splice
          const splicePos = Math.floor(Math.random() * target.length);
          const deleteCount = Math.floor(Math.random() * 2) + 1;
          const newItem = Math.floor(Math.random() * 9) + 1;
          target.splice(splicePos, deleteCount, newItem);
          break;
          
        case 1: // fill
          const fillPos = Math.floor(Math.random() * (target.length - 2));
          const fillLen = Math.floor(Math.random() * 2) + 1;
          const fillVal = Math.floor(Math.random() * 9) + 1;
          target.fill(fillVal, fillPos, fillPos + fillLen);
          break;
          
        case 2: // copyWithin
          const targetPos = Math.floor(Math.random() * (target.length - 2));
          const sourcePos = Math.floor(Math.random() * target.length);
          target.copyWithin(targetPos, sourcePos, sourcePos + 1);
          break;
      }
    }
    
    setGameArray([...startArray]);
    setTargetArray([...target]);
    setMoves(0);
    setGameActive(true);
    setFeedback(questions[level-1]); // Set the level question as feedback
    setGameInputs({
      method: "splice",
      param1: 0,
      param2: 0,
      param3: ""
    });
    setOperationResult(null);
  };
  
  // Apply the selected operation in the game
  const applyGameOperation = () => {
    const arrayCopy = [...gameArray];
    let resultDescription = "";
    
    try {
      switch (gameInputs.method) {
        case "splice":
          const items = gameInputs.param3 ? gameInputs.param3.split(",").map(item => Number(item.trim())) : [];
          const removed = arrayCopy.splice(Number(gameInputs.param1), Number(gameInputs.param2), ...items);
          resultDescription = `splice(${gameInputs.param1}, ${gameInputs.param2}, ${items.join(', ')}) removed [${removed.join(', ')}]`;
          break;
          
        case "fill":
          arrayCopy.fill(
            Number(gameInputs.param1), 
            Number(gameInputs.param2), 
            gameInputs.param3 ? Number(gameInputs.param3) : undefined
          );
          const endParam = gameInputs.param3 ? gameInputs.param3 : "end";
          resultDescription = `fill(${gameInputs.param1}, ${gameInputs.param2}, ${endParam})`;
          break;
          
        case "copyWithin":
          arrayCopy.copyWithin(
            Number(gameInputs.param1), 
            Number(gameInputs.param2), 
            gameInputs.param3 ? Number(gameInputs.param3) : undefined
          );
          const endCopyParam = gameInputs.param3 ? gameInputs.param3 : "end";
          resultDescription = `copyWithin(${gameInputs.param1}, ${gameInputs.param2}, ${endCopyParam})`;
          break;
      }
      
      setGameArray(arrayCopy);
      setMoves(moves + 1);
      
      // Check if arrays match
      if (JSON.stringify(arrayCopy) === JSON.stringify(targetArray)) {
        setShowCelebration(true);
        
        if (level < 5) {
          // Level completed but not finished game
          setFeedback(`🎉 Level ${level} completed!`);
          setGameActive(false);
          setLevel(level + 1); // Just advance to next level
        } else {
          // Game completed - all 5 levels done
          setFeedback(`🎉 All levels completed!`);
          setGameActive(false);
          
          setShowVictoryModal(true);
          setShowCelebration(false);
          
        }
      } else {
        // Deduct 10 points for incorrect submission
        setPoints(Math.max(0, points - 10));
        setFeedback(`Applied: ${resultDescription} (-10 points)`);
      }
      
    } catch (error) {
      setFeedback(`Error: ${error.message}`);
    }
  };
  
  // Add this function to reset the game
  const resetGame = () => {
    setLevel(1);
    setPoints(500);
    setShowVictoryModal(false);
    setGameActive(false);
  };
  
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-orange-600">Array Surgery: Complex Modifications</h2>
      
      <div className="flex flex-wrap">
        <div className="w-full lg:w-1/2 lg:pr-4 mb-6">
          <div className="bg-white rounded-lg shadow-lg border border-orange-200 p-4">
            <div className="flex space-x-3 mb-4 border-b pb-2">
              {["splice", "fill", "copyWithin"].map((method) => (
                <button
                  key={method}
                  className={`px-3 py-1.5 rounded-md ${
                    activeMethod === method 
                      ? "bg-orange-500 text-white" 
                      : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                  }`}
                  onClick={() => setActiveMethod(method)}
                >
                  {method}()
                </button>
              ))}
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-orange-700">
                {methodInfo[activeMethod].title}
              </h3>
              <p className="text-gray-600">
                {methodInfo[activeMethod].description}
              </p>
              <div className="bg-orange-50 p-2 rounded mt-2 font-mono text-sm">
                {methodInfo[activeMethod].syntax}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Example: {methodInfo[activeMethod].example}
              </div>
            </div>
            
            <div className="space-y-3 mb-4">
              {activeMethod === "splice" && (
                <>
                  <div className="flex space-x-3">
                    <div>
                      <label className="block text-sm text-gray-600">Start Index</label>
                      <input
                        type="number"
                        className="border rounded p-1 w-16"
                        value={spliceStart}
                        onChange={(e) => setSpliceStart(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600">Delete Count</label>
                      <input
                        type="number"
                        className="border rounded p-1 w-16"
                        value={spliceDelete}
                        onChange={(e) => setSpliceDelete(e.target.value)}
                      />
                    </div>
                    <div className="flex-grow">
                      <label className="block text-sm text-gray-600">Items to Add (comma separated)</label>
                      <input
                        type="text"
                        className="border rounded p-1 w-full"
                        value={spliceItems}
                        onChange={(e) => setSpliceItems(e.target.value)}
                        placeholder="e.g. 10, 11, 12"
                      />
                    </div>
                  </div>
                </>
              )}
              
              {activeMethod === "fill" && (
                <>
                  <div className="flex space-x-3">
                    <div>
                      <label className="block text-sm text-gray-600">Value</label>
                      <input
                        type="number"
                        className="border rounded p-1 w-16"
                        value={fillValue}
                        onChange={(e) => setFillValue(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600">Start Index</label>
                      <input
                        type="number"
                        className="border rounded p-1 w-16"
                        value={fillStart}
                        onChange={(e) => setFillStart(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600">End Index</label>
                      <input
                        type="number"
                        className="border rounded p-1 w-16"
                        value={fillEnd}
                        onChange={(e) => setFillEnd(e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}
              
              {activeMethod === "copyWithin" && (
                <>
                  <div className="flex space-x-3">
                    <div>
                      <label className="block text-sm text-gray-600">Target Index</label>
                      <input
                        type="number"
                        className="border rounded p-1 w-16"
                        value={copyTarget}
                        onChange={(e) => setCopyTarget(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600">Start Index</label>
                      <input
                        type="number"
                        className="border rounded p-1 w-16"
                        value={copyStart}
                        onChange={(e) => setCopyStart(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600">End Index</label>
                      <input
                        type="number"
                        className="border rounded p-1 w-16"
                        value={copyEnd}
                        onChange={(e) => setCopyEnd(e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}
              
              <button
                onClick={runOperation}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-1.5 px-4 rounded"
              >
                Run {activeMethod}()
              </button>
            </div>
            
            <div>
              <div className="font-semibold text-orange-700">Original Array:</div>
              <div className="flex flex-wrap gap-1 my-2">
                {visualArray.map((value, idx) => (
                  <div
                    key={idx}
                    className="w-8 h-8 bg-orange-100 flex items-center justify-center rounded border border-orange-200"
                  >
                    {value}
                  </div>
                ))}
              </div>
              
              {operationResult && (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-3 bg-orange-50 p-3 rounded border border-orange-200"
                  >
                    {operationResult.error ? (
                      <div className="text-red-600">Error: {operationResult.error}</div>
                    ) : (
                      <>
                        <div className="font-semibold text-orange-700">Result:</div>
                        <div className="flex flex-wrap gap-1 my-2">
                          {operationResult.newArray && operationResult.newArray.map((value, idx) => (
                            <motion.div
                              key={idx}
                              className="w-8 h-8 bg-green-100 flex items-center justify-center rounded border border-green-300"
                              initial={{ scale: 0.8 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: idx * 0.05 }}
                            >
                              {value}
                            </motion.div>
                          ))}
                        </div>
                        
                        {operationResult.removed && (
                          <>
                            <div className="font-semibold text-orange-700 mt-2">Removed Elements:</div>
                            <div className="flex flex-wrap gap-1 my-2">
                              {operationResult.removed.map((value, idx) => (
                                <motion.div
                                  key={idx}
                                  className="w-8 h-8 bg-red-100 flex items-center justify-center rounded border border-red-300"
                                  initial={{ scale: 0.8 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: idx * 0.05 }}
                                >
                                  {value}
                                </motion.div>
                              ))}
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </div>

          <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h3 className="font-bold text-yellow-800">Real-world Applications</h3>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Dynamic UI lists in React, Vue, or Angular</li>
              <li>Managing shopping cart items in e-commerce apps</li>
              <li>Reordering tasks in project management tools</li>
              <li>Efficient data updates without creating new arrays</li>
              <li>In-place sorting and filtering for performance</li>
            </ul>
          </div>
        </div>
        
        <div className="w-full lg:w-1/2 lg:pl-4">
          <div className="bg-white rounded-lg shadow-lg border border-orange-200 p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-orange-700">
                Array Transformation Challenge
              </h3>
              <div className="bg-orange-100 px-3 py-1 rounded-full text-orange-800 font-bold">
                Level: {level}/5 | Points: {points}
              </div>
            </div>
            
            {!gameActive ? (
              <div className="text-center py-8">
                <p className="text-gray-700 mb-6">
                  Ready to test your array manipulation skills? You start with 500 points.
                  Each incorrect attempt costs 10 points. Complete all 5 levels to earn your
                  remaining points. Answer the question for each level by transforming the array!
                </p>
                <button
                  onClick={startGame}
                  className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold py-2 px-8 rounded-full shadow-lg hover:from-orange-600 hover:to-yellow-600 transition-all"
                >
                  Start Challenge
                </button>
              </div>
            ) : (
              <>
                <div className="mb-3 flex justify-between">
                  <div className="text-orange-800 font-semibold">Moves: {moves} (Unlimited)</div>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <div className="font-semibold text-gray-600">
                      {moves === 0 ? "Starting Array:" : "Current Array:"}
                    </div>
                    <div className="flex flex-wrap gap-1 my-2">
                      {gameArray.map((value, idx) => (
                        <motion.div
                          key={`${idx}-${value}-${moves}`} // Add moves to key to ensure re-render
                          className="w-10 h-10 bg-blue-100 flex items-center justify-center rounded-lg border-2 border-blue-300 text-lg font-medium"
                          animate={{ 
                            scale: [0.95, 1.05, 1],
                            backgroundColor: moves > 0 && idx === Number(gameInputs.param1) || 
                                            (gameInputs.method === "fill" && 
                                             idx >= Number(gameInputs.param2) && 
                                             (!gameInputs.param3 || idx < Number(gameInputs.param3)))
                                           ? ["rgba(249, 168, 212, 0.5)", "rgba(147, 197, 253, 0.5)"] 
                                           : "rgba(219, 234, 254, 0.5)"
                          }}
                          transition={{ duration: 0.5 }}
                        >
                          {value}
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* Add operation feedback */}
                    {moves > 0 && (
                      <div className="text-sm text-gray-600 italic mt-1">
                        Last operation: 
                        {gameInputs.method === "splice" && 
                          ` splice(${gameInputs.param1}, ${gameInputs.param2}${gameInputs.param3 ? ', ' + gameInputs.param3 : ''})`}
                        {gameInputs.method === "fill" && 
                          ` fill(${gameInputs.param1}, ${gameInputs.param2}${gameInputs.param3 ? ', ' + gameInputs.param3 : ''})`}
                        {gameInputs.method === "copyWithin" && 
                          ` copyWithin(${gameInputs.param1}, ${gameInputs.param2}${gameInputs.param3 ? ', ' + gameInputs.param3 : ''})`}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <div className="font-semibold text-gray-600">Target Array:</div>
                    <div className="flex flex-wrap gap-1 my-2">
                      {targetArray.map((value, idx) => (
                        <div
                          key={idx}
                          className="w-10 h-10 bg-green-100 flex items-center justify-center rounded-lg border-2 border-green-300 text-lg font-medium"
                        >
                          {value}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="font-semibold text-gray-700">Choose your operation:</div>
                    <div className="flex space-x-2 mb-3 mt-2">
                      {["splice", "fill", "copyWithin"].map((method) => (
                        <button
                          key={method}
                          className={`px-2 py-1 rounded ${
                            gameInputs.method === method 
                              ? "bg-orange-500 text-white" 
                              : "bg-orange-100 text-orange-700"
                          }`}
                          onClick={() => setGameInputs({...gameInputs, method})}
                        >
                          {method}()
                        </button>
                      ))}
                    </div>
                    
                    <div className="space-y-3">
                      {gameInputs.method === "splice" && (
                        <>
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="block text-xs text-gray-500">Start Index</label>
                              <input
                                type="number"
                                className="border rounded p-1 w-full text-sm"
                                value={gameInputs.param1}
                                onChange={(e) => setGameInputs({...gameInputs, param1: e.target.value})}
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500">Delete Count</label>
                              <input
                                type="number"
                                className="border rounded p-1 w-full text-sm"
                                value={gameInputs.param2}
                                onChange={(e) => setGameInputs({...gameInputs, param2: e.target.value})}
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500">Items (comma separated)</label>
                              <input
                                type="text"
                                className="border rounded p-1 w-full text-sm"
                                value={gameInputs.param3}
                                onChange={(e) => setGameInputs({...gameInputs, param3: e.target.value})}
                                placeholder="e.g. 1,2"
                              />
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 italic">
                            Syntax: splice(startIndex, deleteCount, ...items)
                          </div>
                        </>
                      )}
                      
                      {gameInputs.method === "fill" && (
                        <>
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="block text-xs text-gray-500">Value</label>
                              <input
                                type="number"
                                className="border rounded p-1 w-full text-sm"
                                value={gameInputs.param1}
                                onChange={(e) => setGameInputs({...gameInputs, param1: e.target.value})}
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500">Start Index</label>
                              <input
                                type="number"
                                className="border rounded p-1 w-full text-sm"
                                value={gameInputs.param2}
                                onChange={(e) => setGameInputs({...gameInputs, param2: e.target.value})}
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500">End Index</label>
                              <input
                                type="number"
                                className="border rounded p-1 w-full text-sm"
                                value={gameInputs.param3}
                                onChange={(e) => setGameInputs({...gameInputs, param3: e.target.value})}
                              />
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 italic">
                            Syntax: fill(value, startIndex, endIndex)
                          </div>
                        </>
                      )}
                      
                      {gameInputs.method === "copyWithin" && (
                        <>
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="block text-xs text-gray-500">Target Index</label>
                              <input
                                type="number"
                                className="border rounded p-1 w-full text-sm"
                                value={gameInputs.param1}
                                onChange={(e) => setGameInputs({...gameInputs, param1: e.target.value})}
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500">Start Index</label>
                              <input
                                type="number"
                                className="border rounded p-1 w-full text-sm"
                                value={gameInputs.param2}
                                onChange={(e) => setGameInputs({...gameInputs, param2: e.target.value})}
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500">End Index</label>
                              <input
                                type="number"
                                className="border rounded p-1 w-full text-sm"
                                value={gameInputs.param3}
                                onChange={(e) => setGameInputs({...gameInputs, param3: e.target.value})}
                              />
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 italic">
                            Syntax: copyWithin(targetIndex, startIndex, endIndex)
                          </div>
                        </>
                      )}
                    </div>
                    
                    <button
                      onClick={applyGameOperation}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded mt-3"
                    >
                      Apply Operation
                    </button>
                  </div>
                </div>
                
                <div className={`mt-3 p-2 rounded text-center ${
                  feedback.includes("Success") 
                    ? "bg-green-100 text-green-800" 
                    : feedback.includes("Error") 
                      ? "bg-red-100 text-red-800"
                      : "bg-blue-100 text-blue-800"
                }`}>
                  {feedback}
                </div>
                
                {operationResult && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-3 bg-gray-50 p-3 rounded-lg border border-gray-200"
                  >
                    <div className="font-semibold text-gray-700">Last Operation: {operationResult.method}()</div>
                    
                    {operationResult.removed && (
                      <div className="mt-2">
                        <div className="text-sm text-gray-600">Removed Elements:</div>
                        <div className="flex flex-wrap gap-1 my-1">
                          {operationResult.removed.map((value, idx) => (
                            <div
                              key={idx}
                              className="w-8 h-8 bg-red-100 flex items-center justify-center rounded border border-red-300"
                            >
                              {value}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </>
            )}
            
            {showCelebration && (
              <div className="absolute inset-0 z-10 pointer-events-none">
                {Array(30).fill(0).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-3 h-3 rounded-full"
                    style={{
                      background: `hsl(${(i * 12) % 360}, 80%, 60%)`,
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                    }}
                    initial={{ y: -20, opacity: 1 }}
                    animate={{
                      y: 500,
                      opacity: 0,
                      transition: { duration: 2, delay: Math.random() * 0.5 }
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
        <h3 className="font-bold text-orange-800 mb-2">Why These Methods Matter</h3>
        <p className="mb-3">
          While simple array methods like <code className="bg-white px-1 rounded">push</code> and <code className="bg-white px-1 rounded">pop</code> are useful, complex modifications often require more precise control over array elements.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white p-3 rounded shadow-sm">
            <div className="font-bold text-orange-700">Performance Benefits</div>
            <p>These methods modify arrays in-place, avoiding the memory overhead of creating new arrays.</p>
          </div>
          <div className="bg-white p-3 rounded shadow-sm">
            <div className="font-bold text-orange-700">UI Frameworks</div>
            <p>React, Vue, and Angular all benefit from efficient array operations when rendering lists of elements.</p>
          </div>
          <div className="bg-white p-3 rounded shadow-sm">
            <div className="font-bold text-orange-700">Data Processing</div>
            <p>Complex data manipulation often requires precise control over which elements are modified and where.</p>
          </div>
        </div>
      </div>

      {level >= 5 && showCelebration && (
        <div className="fixed inset-0 flex items-center justify-center z-20 bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center">
            <h3 className="text-2xl font-bold text-orange-600 mb-4">
              🏆 Congratulations!
            </h3>
            <p className="text-lg mb-4">
              You've mastered all array transformation techniques!<br/>
              Final score: <span className="font-bold text-orange-600">{points} points</span>
            </p>
            <button
              onClick={() => {
                setShowCelebration(false);
                setLevel(1);
                setPoints(500);
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full"
            >
              Play Again
            </button>
          </div>
        </div>
      )}

      {showVictoryModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md">
            <h3 className="text-2xl font-bold text-orange-600 mb-4">
              🏆 Challenge Complete!
            </h3>
            <p className="text-lg mb-6">
              Congratulations! You've completed all 5 levels.<br/>
              <span className="font-bold text-orange-600 text-xl">Final score: {points} points</span>
            </p>
            <button
              onClick={resetGame}
              className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:from-orange-600 hover:to-yellow-600 transition-all"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Slide2;
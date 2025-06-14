import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Slide3AddingRemoving = () => {
  const [array, setArray] = useState(["🍕", "🍔", "🌮"]);
  const [newItem, setNewItem] = useState("🍦");
  const [message, setMessage] = useState("");
  const [animateMethod, setAnimateMethod] = useState("");
  
  const availableItems = ["🍕", "🍔", "🌮", "🍦", "🍩", "🍪", "🥗", "🥪", "🌭", "🍟"];
  
  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 2000);
  };
  
  const handlePush = () => {
    if (!newItem) return;
    setAnimateMethod("push");
    setArray([...array, newItem]);
    showMessage(`push() added ${newItem} to the end`);
  };
  
  const handlePop = () => {
    if (array.length === 0) return;
    setAnimateMethod("pop");
    const lastItem = array[array.length - 1];
    setArray(array.slice(0, -1));
    showMessage(`pop() removed ${lastItem} from the end`);
  };
  
  const handleUnshift = () => {
    if (!newItem) return;
    setAnimateMethod("unshift");
    setArray([newItem, ...array]);
    showMessage(`unshift() added ${newItem} to the beginning`);
  };
  
  const handleShift = () => {
    if (array.length === 0) return;
    setAnimateMethod("shift");
    const firstItem = array[0];
    setArray(array.slice(1));
    showMessage(`shift() removed ${firstItem} from the beginning`);
  };

  const handleRandomItem = () => {
    const randomIndex = Math.floor(Math.random() * availableItems.length);
    setNewItem(availableItems[randomIndex]);
  };
  
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-green-600">Adding & Removing Array Elements</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-xl font-bold text-green-600 mb-4">Choose an Item</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {availableItems.map((item, i) => (
              <button
                key={i}
                onClick={() => setNewItem(item)}
                className={`text-2xl p-2 rounded-lg ${newItem === item ? 'bg-green-200 ring-2 ring-green-500' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                {item}
              </button>
            ))}
          </div>
          <button 
            onClick={handleRandomItem}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg"
          >
            Random Item
          </button>
        </div>
        
        <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-xl font-bold text-green-600 mb-4">Array Operations</h3>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={handlePush}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg flex items-center justify-center font-bold"
            >
              Push()
            </button>
            <button 
              onClick={handlePop}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg flex items-center justify-center font-bold"
            >
              Pop()
            </button>
            <button 
              onClick={handleUnshift}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg flex items-center justify-center font-bold"
            >
              Unshift()
            </button>
            <button 
              onClick={handleShift}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-lg flex items-center justify-center font-bold"
            >
              Shift()
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800 p-5 rounded-lg">
        <h3 className="text-xl font-bold text-white mb-4 text-center">Current Array</h3>
        
        <div className="flex justify-center items-center min-h-[100px]">
          <AnimatePresence mode="popLayout">
            {array.length > 0 ? (
              array.map((item, index) => (
                <motion.div
                  key={`${index}-${item}`}
                  className="bg-gray-700 flex items-center justify-center w-16 h-16 m-2 rounded-lg text-3xl"
                  initial={animateMethod === "push" && index === array.length - 1 ? { opacity: 0, y: 20 } :
                          animateMethod === "unshift" && index === 0 ? { opacity: 0, y: 20 } :
                          { opacity: 1 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={animateMethod === "pop" && index === array.length - 1 ? { opacity: 0, y: 20 } :
                        animateMethod === "shift" && index === 0 ? { opacity: 0, y: 20 } :
                        { opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {item}
                </motion.div>
              ))
            ) : (
              <p className="text-gray-400 text-lg italic">Empty array</p>
            )}
          </AnimatePresence>
        </div>
        
        <div className="mt-4 flex justify-center">
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-white text-gray-800 px-4 py-2 rounded-lg font-mono"
              >
                {message}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h3 className="font-bold text-lg text-blue-700 mb-2">End Operations</h3>
          <ul className="space-y-2 text-gray-700">
            <li><span className="font-mono bg-blue-100 px-1">push()</span>: Adds element to the end</li>
            <li><span className="font-mono bg-blue-100 px-1">pop()</span>: Removes element from the end</li>
          </ul>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <h3 className="font-bold text-lg text-green-700 mb-2">Beginning Operations</h3>
          <ul className="space-y-2 text-gray-700">
            <li><span className="font-mono bg-green-100 px-1">unshift()</span>: Adds element to the beginning</li>
            <li><span className="font-mono bg-green-100 px-1">shift()</span>: Removes element from the beginning</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Slide3AddingRemoving;
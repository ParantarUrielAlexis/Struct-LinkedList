import React, { useState } from "react";
import { motion } from "framer-motion";

const ArrayVisualizer = ({
  initialArray = [12, 45, 8, 24, 91],
  allowModify = true,
  onInteraction = () => {},
}) => {
  const [array, setArray] = useState(initialArray);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [newValue, setNewValue] = useState("");
  const [message, setMessage] = useState("");

  const handleSelect = (index) => {
    if (!allowModify) return;
    setSelectedIndex(index);
    setNewValue(array[index]);
    onInteraction("select");
  };

  const handleChange = (e) => {
    // Only allow numbers
    const value = e.target.value.replace(/[^0-9]/g, "");
    setNewValue(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedIndex === null) return;

    const numValue = parseInt(newValue) || 0;
    const newArray = [...array];
    newArray[selectedIndex] = numValue;

    setArray(newArray);
    setMessage(`Updated array[${selectedIndex}] = ${numValue}`);
    onInteraction("update");

    // Clear message after 2 seconds
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div className="my-4">
      <div className="flex flex-col items-center">
        <div className="flex mb-6">
          {array.map((value, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className={`w-12 h-12 border-2 flex items-center justify-center m-1 cursor-pointer
                ${
                  index === selectedIndex
                    ? "border-blue-500 bg-blue-100"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              onClick={() => handleSelect(index)}
            >
              {value}
              <div className="absolute -bottom-6 text-xs text-gray-500">
                [{index}]
              </div>
            </motion.div>
          ))}
        </div>

        {allowModify && (
          <form onSubmit={handleSubmit} className="flex items-center mt-8">
            <label className="text-sm mr-2">
              {selectedIndex !== null
                ? `Change array[${selectedIndex}]:`
                : "Select an element"}
            </label>
            <input
              type="text"
              value={newValue}
              onChange={handleChange}
              disabled={selectedIndex === null}
              className="border border-gray-300 rounded px-2 py-1 w-16 text-center"
            />
            <button
              type="submit"
              disabled={selectedIndex === null}
              className={`ml-2 px-3 py-1 rounded text-white ${
                selectedIndex === null
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              Update
            </button>
          </form>
        )}

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-sm text-green-600 font-medium"
          >
            {message}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ArrayVisualizer;

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaTimes,
  FaArrowRight,
  FaArrowLeft,
  FaLightbulb,
  FaCode,
  FaPuzzlePiece,
  FaGamepad,
  FaTrophy,
} from "react-icons/fa";

const Modal = ({ index, onClose, setIndex, content }) => {
  const currentSlide = content[index];
  const [animationComplete, setAnimationComplete] = useState(false);
  const [interactionScore, setInteractionScore] = useState(0);
  const [showHints, setShowHints] = useState(false);

  // Progress through content when keyboard arrows used
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight" && index < content.length - 1) {
        setIndex(index + 1);
      } else if (e.key === "ArrowLeft" && index > 0) {
        setIndex(index - 1);
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [index, content.length, setIndex, onClose]);

  // Reset animation state when slide changes
  useEffect(() => {
    setAnimationComplete(false);
    const timer = setTimeout(() => setAnimationComplete(true), 500);
    return () => clearTimeout(timer);
  }, [index]);

  // Award points for interaction
  const awardPoints = (points = 5) => {
    setInteractionScore((prev) => prev + points);
  };

  // Navigation controls
  const nextSlide = () => {
    if (index < content.length - 1) {
      setIndex(index + 1);
      awardPoints(2);
    }
  };

  const prevSlide = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  // Progress indicator
  const progressPercentage = ((index + 1) / content.length) * 100;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Modal container */}
      <motion.div
        className="relative w-11/12 max-w-6xl max-h-[90vh] rounded-2xl bg-gray-900 border border-gray-700 shadow-2xl overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 20 }}
      >
        {/* Header with title and close button */}
        <div className="sticky top-0 px-8 py-4 bg-gradient-to-r from-purple-900 to-blue-900 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">
            {currentSlide.title}
          </h2>
          <div className="flex items-center gap-4">
            <div className="bg-gray-800 rounded-lg py-1 px-3 text-sm">
              <span className="text-purple-300">Score: </span>
              <span className="text-white font-bold">{interactionScore}</span>
            </div>
            <button
              onClick={onClose}
              className="bg-gray-800/50 hover:bg-red-800 p-2 rounded-lg transition"
            >
              <FaTimes className="text-white" />
            </button>
          </div>
        </div>

        {/* Content area with scrolling */}
        <div className="overflow-y-auto max-h-[calc(90vh-160px)] p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            key={`slide-${index}`} // Force re-animation when slide changes
            className="prose prose-invert max-w-none"
          >
            {currentSlide.content}
          </motion.div>

          {/* Interactive tools section */}
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={() => {
                setShowHints(!showHints);
                awardPoints(3);
              }}
              className="flex items-center gap-2 bg-yellow-800/50 hover:bg-yellow-700/50 text-yellow-300 px-4 py-2 rounded-lg transition"
            >
              <FaLightbulb /> {showHints ? "Hide Hints" : "Show Hints"}
            </button>

            <a
              href="https://paiza.io/projects/e/vBuj24nZhWzDYWHr6Le1mg?theme=twilight"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => awardPoints(10)}
              className="flex items-center gap-2 bg-cyan-800/50 hover:bg-cyan-700/50 text-cyan-300 px-4 py-2 rounded-lg transition"
            >
              <FaCode /> Try it yourself
            </a>

            <button
              onClick={() => {
                // Open a mini-game or challenge related to this topic
                awardPoints(15);
              }}
              className="flex items-center gap-2 bg-green-800/50 hover:bg-green-700/50 text-green-300 px-4 py-2 rounded-lg transition"
            >
              <FaGamepad /> Practice Game
            </button>

            <button
              onClick={() => {
                // Send completion status to parent
                awardPoints(20);
              }}
              className="flex items-center gap-2 bg-purple-800/50 hover:bg-purple-700/50 text-purple-300 px-4 py-2 rounded-lg transition"
            >
              <FaTrophy /> Complete & Earn Badge
            </button>
          </div>

          {showHints && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-6 p-4 bg-yellow-900/30 border-l-4 border-yellow-500 rounded-r"
            >
              <h4 className="font-bold flex items-center gap-2 text-yellow-300">
                <FaLightbulb /> Learning Tips
              </h4>
              <ul className="mt-2 space-y-2 text-sm">
                <li>
                  Try implementing the code examples yourself in the sandbox
                </li>
                <li>Visualize the arrays as boxes with labels (indices)</li>
                <li>Practice explaining array operations in your own words</li>
                <li>Experiment with different array sizes and operations</li>
                {index === 0 && (
                  <li>
                    Arrays are fundamental to programming - take your time to
                    understand them deeply
                  </li>
                )}
                {currentSlide.title.includes("Algorithms") && (
                  <li>
                    Focus on understanding the algorithm step-by-step before
                    coding
                  </li>
                )}
              </ul>
            </motion.div>
          )}
        </div>

        {/* Progress bar and navigation */}
        <div className="sticky bottom-0 bg-gray-900 border-t border-gray-800 px-8 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={prevSlide}
              disabled={index === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                index === 0
                  ? "bg-gray-800/30 text-gray-500 cursor-not-allowed"
                  : "bg-gray-800 hover:bg-gray-700 text-white"
              }`}
            >
              <FaArrowLeft /> Previous
            </button>

            <div className="text-center">
              <div className="text-sm text-gray-400 mb-2">
                {index + 1} of {content.length}
              </div>
              <div className="w-60 h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            <button
              onClick={nextSlide}
              disabled={index === content.length - 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                index === content.length - 1
                  ? "bg-gray-800/30 text-gray-500 cursor-not-allowed"
                  : "bg-purple-700 hover:bg-purple-600 text-white"
              }`}
            >
              Next <FaArrowRight />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Modal;

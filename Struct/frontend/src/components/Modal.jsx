import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight, FaLightbulb, FaTimes } from "react-icons/fa";

const Modal = ({ index, onClose, setIndex, content }) => {
  const currentSlide = content[index];
  const [animationComplete, setAnimationComplete] = useState(false);
  const [showHints, setShowHints] = useState(false);

  // Progress through content when keyboard arrows used
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") {
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        prevSlide();
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
    setTimeout(() => setAnimationComplete(true), 500);
  }, [index]);

  // Award points for interaction
  

  // Navigation controls
  const nextSlide = () => {
    if (index < content.length - 1) {
      setIndex(index + 1);
      awardPoints(1); // Small points for progression
    } else {
      awardPoints(20); // Bonus for completing section
      onClose();
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/70"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col"
        style={{
          width: "1200px",  
          height: "90vh", // Changed to viewport height
          maxWidth: "95vw",
          maxHeight: "90vh" // Added max height
        }}
      >
        {/* Header - Fixed at top */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-white p-4 flex-shrink-0">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">
              {currentSlide?.title || "Learning Content"}
            </h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
            >
              <FaTimes />
            </button>
          </div>
          <div className="w-full bg-white/30 h-2 rounded-full mt-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Content - Scrollable with flex-grow */}
        <div className="overflow-y-auto flex-grow">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="p-6"
          >
            {currentSlide?.content}

            {/* Interactive elements will be rendered here when present */}
            {currentSlide?.interactive && (
              <div className="mt-4 border-t pt-4">
                {currentSlide.interactive}
              </div>
            )}
          </motion.div>
        </div>

        {/* Footer - Fixed at bottom with navigation buttons at edges */}
        <div className="bg-gray-100 p-4 flex items-center justify-between flex-shrink-0">
          <button
            onClick={prevSlide}
            disabled={index === 0}
            className={`p-2 rounded-full ${
              index === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <FaChevronLeft />
          </button>
          
          <button
            onClick={nextSlide}
            className="p-2 rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
          >
            {index === content.length - 1 ? "Finish" : <FaChevronRight />}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Modal;
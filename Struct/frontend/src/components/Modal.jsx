import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowRight, FaArrowLeft, FaTimes } from "react-icons/fa";
import { createPortal } from "react-dom";

const Modal = ({ index, onClose, setIndex, content }) => {
  const currentSlide = content[index];

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.4 }}
        className="bg-black/70 p-6 md:p-10 rounded-3xl max-w-xl w-full shadow-xl border-4 border-dotted border-white text-white relative"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white hover:text-red-400 transition"
        >
          <FaTimes size={24} />
        </button>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl md:text-3xl font-bold">
            {currentSlide.title}
          </h2>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="text-base md:text-lg"
          >
            {currentSlide.content}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-6">
          <button
            onClick={() => setIndex((i) => Math.max(i - 1, 0))}
            disabled={index === 0}
            className="text-white bg-pink-500 px-4 py-2 rounded-lg hover:bg-pink-600 transition flex items-center gap-2 disabled:opacity-30"
          >
            <FaArrowLeft /> Previous
          </button>
          <button
            onClick={() => setIndex((i) => Math.min(i + 1, content.length - 1))}
            disabled={index === content.length - 1}
            className="text-white bg-cyan-500 px-4 py-2 rounded-lg hover:bg-cyan-600 transition flex items-center gap-2 disabled:opacity-30"
          >
            Next <FaArrowRight />
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

export default Modal;

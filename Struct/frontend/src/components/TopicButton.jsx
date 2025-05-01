import React from "react";
import { motion } from "framer-motion";

const TopicButton = ({ icon, label, onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="bg-black/50 hover:bg-black/80 p-6 rounded-2xl flex flex-col items-center justify-center text-center border-2 border-dotted border-white text-white transition"
    >
      {icon}
      <p className="mt-2 text-sm font-medium">{label}</p>
    </motion.button>
  );
};

export default TopicButton;

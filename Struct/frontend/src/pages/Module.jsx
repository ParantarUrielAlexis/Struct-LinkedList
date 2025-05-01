import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "../components/Modal";
import TopicButton from "../components/TopicButton";
import topics from "../data/topics";

const Module = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentContent, setCurrentContent] = useState([]);

  const openModal = (content) => {
    setCurrentContent(content);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-br from-purple-600 via-teal-500 to-cyan-400">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 max-w-4xl">
        {topics.map((topic, index) => (
          <TopicButton
            key={index}
            icon={topic.icon}
            label={topic.label}
            onClick={() => {
              setCurrentIndex(0);
              openModal(topic.content);
            }}
          />
        ))}
      </div>

      <AnimatePresence>
        {modalOpen && (
          <Modal
            index={currentIndex}
            onClose={closeModal}
            setIndex={setCurrentIndex}
            content={currentContent}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Module;

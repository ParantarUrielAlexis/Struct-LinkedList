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

  // Use only first 5 topics or pad with empty topics if less than 5
  const displayTopics = topics.slice(0, 5).concat(
    Array(Math.max(0, 5 - topics.length)).fill({
      icon: "🔒",
      label: "Locked",
      content: []
    })
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-br from-teal-50 via-emerald-50 to-teal-100">
      <div style={{ position: 'relative', width: '100%', maxWidth: '1200px', height: '500px' }}>
        {/* SVG lines */}
        <svg width="100%" height="500" style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}>
          {/* Left vertical and top horizontal */}
          <polyline points="130,230 130,80 320,80" stroke="#3B82F6" strokeWidth="4" fill="none" strokeDasharray="8 4"/>
          {/* Top horizontal, bend right, down to Button 3 */}
          <polyline points="320,80 650,80 650,200 450,200 450,300" stroke="#3B82F6" strokeWidth="4" fill="none" strokeDasharray="8 4"/>
          {/* From Button 3 to Button 4 */}
          <polyline points="520,360 850,360 850,280" stroke="#3B82F6" strokeWidth="4" fill="none" strokeDasharray="8 4"/>
          {/* From Button 4 to Button 5 */}
          <polyline points="850,170 850,40 1100,40 1100,400" stroke="#3B82F6" strokeWidth="4" fill="none" strokeDasharray="8 4"/>
        </svg>
        
        {/* Topic Buttons */}
        <div 
          onClick={() => {
            if (displayTopics[0].content?.length) {
              setCurrentIndex(0);
              openModal(displayTopics[0].content);
            }
          }}
          style={{
            position: 'absolute', 
            textAlign: 'center',
            fontSize: '14px',
            left: 60, 
            top: 170, 
            width: 140, 
            height: 140, 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #60A5FA, #3B82F6)',
            color: 'white',
            fontWeight: 'bold', 
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: displayTopics[0].content?.length ? 'pointer' : 'not-allowed',
            boxShadow: '0 4px 10px rgba(59, 130, 246, 0.4)',
            transition: 'transform 0.3s, box-shadow 0.3s',
          }}
          className="hover:shadow-lg hover:-translate-y-1"
        >
          <div style={{ fontSize: '1rem' }}>{displayTopics[0].icon}</div>
          <div style={{ marginTop: '8px' }}>{displayTopics[0].label}</div>
        </div>

        <div 
          onClick={() => {
            if (displayTopics[1].content?.length) {
              setCurrentIndex(0);
              openModal(displayTopics[1].content);
            }
          }}
          style={{
            position: 'absolute', 
            left: 250, 
            fontSize: '14px',
            textAlign: 'center',
            top: 20, 
            width: 140, 
            height: 140, 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #60A5FA, #3B82F6)',
            color: 'white',
            fontWeight: 'bold', 
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: displayTopics[1].content?.length ? 'pointer' : 'not-allowed',
            boxShadow: '0 4px 10px rgba(59, 130, 246, 0.4)',
            transition: 'transform 0.3s, box-shadow 0.3s',
          }}
          className="hover:shadow-lg hover:-translate-y-1"
        >
          <div style={{ fontSize: '1rem' }}>{displayTopics[1].icon}</div>
          <div style={{ marginTop: '8px' }}>{displayTopics[1].label}</div>
        </div>

        <div 
          onClick={() => {
            if (displayTopics[2].content?.length) {
              setCurrentIndex(0);
              openModal(displayTopics[2].content);
            }
          }}
          style={{
            position: 'absolute', 
            left: 380, 
            fontSize: '14px',
            textAlign: 'center',
            top: 300, 
            width: 140, 
            height: 140, 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #60A5FA, #3B82F6)',
            color: 'white',
            fontWeight: 'bold', 
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: displayTopics[2].content?.length ? 'pointer' : 'not-allowed',
            boxShadow: '0 4px 10px rgba(59, 130, 246, 0.4)',
            transition: 'transform 0.3s, box-shadow 0.3s',
          }}
          className="hover:shadow-lg hover:-translate-y-1"
        >
          <div style={{ fontSize: '1rem' }}>{displayTopics[2].icon}</div>
          <div style={{ marginTop: '8px' }}>{displayTopics[2].label}</div>
        </div>

        <div 
          onClick={() => {
            if (displayTopics[3].content?.length) {
              setCurrentIndex(0);
              openModal(displayTopics[3].content);
            }
          }}
          style={{
            position: 'absolute', 
            left: 780, 
            top: 170, 
            fontSize: '12px',
            textAlign: 'center',
            width: 140, 
            height: 140, 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #60A5FA, #3B82F6)',
            color: 'white',
            fontWeight: 'bold', 
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: displayTopics[3].content?.length ? 'pointer' : 'not-allowed',
            boxShadow: '0 4px 10px rgba(59, 130, 246, 0.4)',
            transition: 'transform 0.3s, box-shadow 0.3s',
          }}
          className="hover:shadow-lg hover:-translate-y-1"
        >
          <div style={{ fontSize: '1rem' }}>{displayTopics[3].icon}</div>
          <div style={{ marginTop: '8px' }}>{displayTopics[3].label}</div>
        </div>

        <div 
          onClick={() => {
            if (displayTopics[4].content?.length) {
              setCurrentIndex(0);
              openModal(displayTopics[4].content);
            }
          }}
          style={{
            position: 'absolute', 
            left: 1030, 
            top: 300, 
            fontSize: '14px',
            textAlign: 'center',
            width: 140, 
            height: 140, 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #60A5FA, #3B82F6)',
            color: 'white',
            fontWeight: 'bold', 
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: displayTopics[4].content?.length ? 'pointer' : 'not-allowed',
            boxShadow: '0 4px 10px rgba(59, 130, 246, 0.4)',
            transition: 'transform 0.3s, box-shadow 0.3s',
          }}
          className="hover:shadow-lg hover:-translate-y-1"
        >
          <div style={{ fontSize: '1rem' }}>{displayTopics[4].icon}</div>
          <div style={{ marginTop: '8px' }}>{displayTopics[4].label}</div>
        </div>
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
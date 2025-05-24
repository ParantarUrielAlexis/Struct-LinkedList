import React, { useState } from 'react';
import { FaHeart } from 'react-icons/fa';

const InteractiveTutorial = ({ onClose }) => {
  const [step, setStep] = useState(0);
  const [arrayState, setArrayState] = useState([5, 2, 9, 1, 6]);
  const [sortedArray, setSortedArray] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  
  // Mini simulation of bubble sort
  const performBubbleStep = () => {
    if (arrayState.length <= 1) return;
    
    const newArray = [...arrayState];
    let swapped = false;
    
    for (let i = 0; i < newArray.length - 1; i++) {
      if (newArray[i] > newArray[i + 1]) {
        // Swap elements
        [newArray[i], newArray[i + 1]] = [newArray[i + 1], newArray[i]];
        swapped = true;
        break;
      }
    }
    
    if (!swapped && newArray.length > 0) {
      // Move one element to sorted section
      setSortedArray([...sortedArray, newArray.pop()]);
    }
    
    setArrayState(newArray);
  };
  
  const handleElementClick = (index) => {
    setSelectedIndex(index);
  };
  
  const resetSimulation = () => {
    setArrayState([5, 2, 9, 1, 6]);
    setSortedArray([]);
    setSelectedIndex(null);
  };
  
  const tutorialContent = [
    {
      title: "Welcome to Sorting Algorithms",
      content: (
        <div>
          <h2>Interactive Learning</h2>
          <p>Let's learn how sorting algorithms work by interacting with them!</p>
          <p>Below is an unsorted array. We'll use different methods to sort it.</p>
          
          <div className="interactive-array">
            {arrayState.map((value, index) => (
              <div 
                key={index} 
                className={`array-element ${selectedIndex === index ? 'selected' : ''}`}
                onClick={() => handleElementClick(index)}
              >
                {value}
              </div>
            ))}
          </div>
          
          <div className="interactive-controls">
            <button onClick={performBubbleStep}>Perform Sort Step</button>
            <button onClick={resetSimulation}>Reset</button>
          </div>
          
          <p>Click "Perform Sort Step" to see the bubble sort algorithm in action!</p>
        </div>
      )
    },
    // Add more interactive steps
  ];
  
  return (
    <div className="interactive-tutorial">
      <h1>{tutorialContent[step].title}</h1>
      
      <div className="tutorial-content">
        {tutorialContent[step].content}
      </div>
      
      <div className="tutorial-navigation">
        <button 
          disabled={step === 0}
          onClick={() => setStep(step - 1)}
        >
          Previous
        </button>
        
        <button onClick={onClose}>
          Close Tutorial
        </button>
        
        <button 
          disabled={step === tutorialContent.length - 1}
          onClick={() => setStep(step + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default InteractiveTutorial;
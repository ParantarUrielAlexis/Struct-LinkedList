import React, { useState, useEffect } from "react";

const Slide6 = () => {
  // Define the initial array
  const initialArray = [7, 3, 5, 1, 9, 2];
  
  // Store the current state of the array and visualization
  const [visualState, setVisualState] = useState({
    array: [...initialArray],
    currentIndex: 0,
    sortedUpTo: 0,
    comparing: -1,
    keyCard: null,
    step: 'idle', // 'idle', 'selecting', 'comparing', 'shifting', 'inserting'
    isComplete: false,
    message: "Click \"Next Step\" to begin sorting"
  });

  // For auto-play functionality
  const [isPlaying, setIsPlaying] = useState(false);
  const [playInterval, setPlayInterval] = useState(null);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (playInterval) clearInterval(playInterval);
    };
  }, [playInterval]);

  // Function to reset the sorting process
  const reset = () => {
    // Stop auto-play if running
    if (playInterval) {
      clearInterval(playInterval);
      setPlayInterval(null);
      setIsPlaying(false);
    }
    
    // Reset to initial state
    setVisualState({
      array: [...initialArray],
      currentIndex: 0,
      sortedUpTo: 0,
      comparing: -1,
      keyCard: null,
      step: 'idle',
      isComplete: false,
      message: "Click \"Next Step\" to begin sorting"
    });
  };

  // Single step of insertion sort
  const nextStep = () => {
    setVisualState(prev => {
      // If sorting is complete, don't do anything
      if (prev.isComplete) {
        return prev;
      }

      // Create a copy of the current array
      const newArray = [...prev.array];
      
      // Initialize new state with previous values
      const newState = { ...prev };
      
      // State machine for insertion sort steps
      switch (prev.step) {
        case 'idle':
          // Start with the first element as sorted
          if (prev.currentIndex === 0) {
            return {
              ...prev,
              sortedUpTo: 0,
              currentIndex: 1,
              step: 'selecting',
              message: `Starting with first element ${newArray[0]} (already sorted)`
            };
          }
          // Fall through to 'selecting' if not first element
          
        case 'selecting':
          // If we've sorted all elements, we're done
          if (prev.currentIndex >= newArray.length) {
            // Sorting is complete
            return {
              ...prev,
              isComplete: true,
              step: 'complete',
              message: "Sorting complete! All cards are in order."
            };
          }
          
          // Select next unsorted element as key
          return {
            ...prev,
            keyCard: newArray[prev.currentIndex],
            comparing: prev.currentIndex - 1,
            step: 'comparing',
            message: `Selected ${newArray[prev.currentIndex]} as current element to insert`
          };
          
        case 'comparing':
          // We've compared with all sorted elements or found insertion point
          if (prev.comparing < 0 || newArray[prev.comparing] <= prev.keyCard) {
            // Insert the key at position comparing+1
            newArray.splice(prev.currentIndex, 1); // Remove the key from its current position
            newArray.splice(prev.comparing + 1, 0, prev.keyCard); // Insert at new position
            
            return {
              ...prev,
              array: newArray,
              step: 'inserting',
              message: `Inserted ${prev.keyCard} at position ${prev.comparing + 1}`
            };
          } else {
            // Need to shift this element to the right
            return {
              ...prev,
              step: 'shifting',
              message: `${newArray[prev.comparing]} > ${prev.keyCard}, shifting right`
            };
          }
          
        case 'shifting':
          // The animation of shifting would happen here
          // Then decrease comparing index to check next element
          return {
            ...prev,
            comparing: prev.comparing - 1,
            step: 'comparing'
          };
          
        case 'inserting':
          // Move to next unsorted element
          return {
            ...prev,
            sortedUpTo: prev.currentIndex,
            currentIndex: prev.currentIndex + 1,
            keyCard: null,
            step: 'selecting',
            message: `Moving to next unsorted element`
          };
          
        default:
          return prev;
      }
    });
  };

  // Toggle auto-play
  const toggleAutoPlay = () => {
    if (isPlaying) {
      clearInterval(playInterval);
      setPlayInterval(null);
      setIsPlaying(false);
    } else if (!visualState.isComplete) {
      const interval = setInterval(() => {
        nextStep();
      }, 800);
      setPlayInterval(interval);
      setIsPlaying(true);
    }
  };

  // Helper function to get card style based on its state
  const getCardStyle = (index) => {
    const { sortedUpTo, currentIndex, comparing, step, keyCard, array } = visualState;
    
    // Base styles
    let className = "relative mx-1 w-16 h-24 rounded transition-all duration-300 ";
    className += "flex flex-col items-center justify-center shadow-md ";
    
    // The key card being inserted
    if (step !== 'idle' && array[index] === keyCard && index <= sortedUpTo) {
      return className + "bg-green-100 border-2 border-green-500 scale-105 z-50";
    }
    
    // Card currently being compared
    if (index === comparing && step === 'comparing') {
      return className + "bg-blue-100 border-2 border-blue-400 z-40";
    }
    
    // Cards in the sorted portion
    if (index <= sortedUpTo) {
      return className + "bg-yellow-100 border-2 border-yellow-400 z-30";
    }
    
    // Current element being processed
    if (index === currentIndex && step === 'selecting') {
      return className + "ring-2 ring-yellow-500 scale-105 z-20";
    }
    
    // Default unsorted cards
    return className + "bg-gradient-to-b from-gray-50 to-gray-100 border border-gray-300 z-10";
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-2">Insertion Sort Algorithm</h2>
      <p>
        Insertion Sort builds a sorted array one element at a time, similar to how you might sort playing cards in your hand.
        It takes one element from the unsorted portion and inserts it into its correct sorted position.
      </p>
      
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h4 className="font-medium">How Insertion Sort Works:</h4>
        <ol className="list-decimal list-inside pl-4 mt-2">
          <li>Start with the first element (considered already sorted)</li>
          <li>Take the next element and compare with all elements in the sorted portion</li>
          <li>Shift elements in the sorted portion to make space for the current element</li>
          <li>Insert the current element in its correct position</li>
          <li>Repeat until all elements are sorted</li>
        </ol>
      </div>
      
      {/* Card-Based Insertion Sort Visualization */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h4 className="font-medium text-center mb-2">Card-Style Insertion Sort</h4>
        <p className="text-sm text-center mb-3">Watch how cards get inserted into the correct position</p>
        
        <div className="flex justify-center mb-4">
          <div className="min-h-[160px] w-full bg-white p-4 rounded-lg shadow-inner">
            <div className="flex justify-center gap-2">
              {visualState.array.map((value, index) => (
                <div
                  key={`${index}-${value}-${visualState.step}`}
                  className={getCardStyle(index)}
                >
                  <div className="absolute top-1 left-2 text-lg font-bold">
                    {value}
                  </div>
                  <div className="absolute bottom-1 right-2 text-lg font-bold rotate-180">
                    {value}
                  </div>
                  <div className={`text-3xl font-bold ${
                    index <= visualState.sortedUpTo ? 'text-yellow-600' : 'text-gray-800'
                  }`}>
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-center space-x-3 mb-3">
          <button 
            className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 transition text-sm"
            onClick={reset}
          >
            Reset
          </button>
          
          <button 
            className={`bg-yellow-600 text-white px-4 py-1 rounded hover:bg-yellow-700 transition 
              ${visualState.isComplete ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={nextStep}
            disabled={visualState.isComplete}
          >
            Next Step
          </button>
          
          <button 
            className={`${isPlaying ? 'bg-orange-700' : 'bg-orange-600'} text-white px-3 py-1 rounded 
              hover:bg-orange-700 transition flex items-center text-sm
              ${visualState.isComplete ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={toggleAutoPlay}
            disabled={visualState.isComplete}
          >
            {isPlaying ? (
              <>
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8z" clipRule="evenodd"></path>
                  <path fillRule="evenodd" d="M13 8a1 1 0 012 0v4a1 1 0 11-2 0V8z" clipRule="evenodd"></path>
                </svg> Pause
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
                </svg> Auto Play
              </>
            )}
          </button>
        </div>
        
        <div className="text-center text-sm p-2 bg-white rounded border border-yellow-100 min-h-[2rem]">
          {visualState.message}
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="font-medium">Key Characteristics:</h4>
        <ul className="list-disc list-inside pl-4 mt-2 space-y-1 text-sm">
          <li>Time Complexity: O(n²) worst case, O(n) best case (already sorted)</li>
          <li>Space Complexity: O(1) - in-place algorithm</li>
          <li>Stable sort - maintains relative order of equal elements</li>
          <li>Efficient for small and nearly-sorted datasets</li>
          <li>Used in many scenarios when handling small datasets or partially sorted arrays</li>
        </ul>
      </div>
      <div className="mt-2 text-sm text-gray-600">
        <strong>Hint:</strong> Think about how you sort a hand of cards - you pick up one card at a time and insert it into its correct position.
      </div>
    </div>
  );
};

export default Slide6;
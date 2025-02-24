import React, { useState } from "react";
// import "./SortRush.css";

const SortRush = () => {
  const [elements, setElements] = useState([5, 3, 8, 4, 2, 7, 1, 6]);
  const [currentIteration, setCurrentIteration] = useState(0);
  const [isSorted, setIsSorted] = useState(false);

  const bubbleSortStep = () => {
    let newElements = [...elements];
    let swapped = false;
    for (let i = 0; i < newElements.length - 1; i++) {
      if (newElements[i] > newElements[i + 1]) {
        [newElements[i], newElements[i + 1]] = [
          newElements[i + 1],
          newElements[i],
        ];
        swapped = true;
        break;
      }
    }
    setElements(newElements);
    setCurrentIteration(currentIteration + 1);
    if (!swapped) {
      setIsSorted(true);
    }
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("index", index);
  };

  const handleDrop = (e, index) => {
    const draggedIndex = e.dataTransfer.getData("index");
    let newElements = [...elements];
    [newElements[draggedIndex], newElements[index]] = [
      newElements[index],
      newElements[draggedIndex],
    ];
    setElements(newElements);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="sort-rush">
      <h1>Sort Rush</h1>
      <div className="elements">
        {elements.map((element, index) => (
          <div
            key={index}
            className="element"
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragOver={handleDragOver}
          >
            {element}
          </div>
        ))}
      </div>
      <button onClick={bubbleSortStep} disabled={isSorted}>
        Next Iteration
      </button>
      {isSorted && <p>Array is sorted!</p>}
    </div>
  );
};

export default SortRush;

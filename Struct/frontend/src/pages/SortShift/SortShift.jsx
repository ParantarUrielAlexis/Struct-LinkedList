import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import "./SortShift.css";

const ShortShift = () => {
    const originalArray = [3, 1, 2, 6, 8, 5]

    const [grids, setGrids] = useState([originalArray.slice()]);
    const [selected, setSelected] = useState({ gridIndex: null, itemIndex: null });
    const [message, setMessage] = useState("");
    const [iterationResults, setIterationResults] = useState([]);

    const handleSelect = (gridIndex, itemIndex) => {
        if (selected.gridIndex === null) {
            // First selection
            setSelected({ gridIndex, itemIndex });
        } else if (selected.gridIndex === gridIndex && selected.itemIndex !== itemIndex) {
            // Swap only within the same grid
            swapNumbers(gridIndex, selected.itemIndex, itemIndex);
            setSelected({ gridIndex: null, itemIndex: null });
        } else {
            // Reset selection
            setSelected({ gridIndex: null, itemIndex: null });
        }
    };

    const swapNumbers = (gridIndex, itemIndex1, itemIndex2) => {
        let newGrids = [...grids];
        let newGrid = [...newGrids[gridIndex]];
        [newGrid[itemIndex1], newGrid[itemIndex2]] = [newGrid[itemIndex2], newGrid[itemIndex1]];
        newGrids[gridIndex] = newGrid;
        setGrids(newGrids);
    };

    const addGrid = () => {
        // Don't add new grids if the last grid is already sorted
        if (grids.length < 6 && !isSorted(grids[grids.length - 1])) {
            setGrids([...grids, [...grids[grids.length - 1]]]);
        }
    };

    const removeGrid = () => {
        if (grids.length > 1) {
            setGrids(grids.slice(0, -1));
        }
    };

    const getOrdinalSuffix = (n) => {
        if (n % 100 >= 11 && n % 100 <= 13) {
            return `${n}th`;
        }
        switch (n % 10) {
            case 1: return `${n}st`;
            case 2: return `${n}nd`;
            case 3: return `${n}rd`;
            default: return `${n}th`;
        }
    };

    // Function to check if the array is sorted
    const isSorted = (arr) => {
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i] > arr[i + 1]) return false;
        }
        return true;
    };

    // Function to simulate bubble sort and store the steps
    const bubbleSortSteps = () => {
        let arr = [...originalArray];
        let steps = [arr.slice()];
        for (let i = 0; i < arr.length - 1; i++) {
            let swapped = false;
            for (let j = 0; j < arr.length - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    swapped = true;
                }
            }
            if (swapped) {
                steps.push(arr.slice());
            } else {
                break; // No swaps, the array is sorted
            }
        }
        return steps;
    };

    // Generate the correct bubble sort steps
    const correctSteps = bubbleSortSteps();

    const checkIteration = (grid, gridIndex) => {
        // Dynamically compute the expected result for the current iteration
        let arr = [...originalArray];
        for (let i = 0; i <= gridIndex; i++) { // Include the current iteration
            for (let j = 0; j < arr.length - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                }
            }
        }

        // Compare the user's grid with the dynamically computed result
        return JSON.stringify(grid) === JSON.stringify(arr);
    };

    const checkSorting = () => {
        let correctCount = 0;
        let incorrectCount = 0;
        let isPreviousCorrect = true; // Track if the previous iteration was correct
        let isAlreadySorted = false; // Track if the array is already sorted
    
        const results = grids.map((grid, index) => {
            if (isPreviousCorrect && !isAlreadySorted && checkIteration(grid, index)) {
                if (isSorted(grid)) {
                    isAlreadySorted = true; // Mark as sorted if the current grid is sorted
                }
                correctCount++;
                return { iteration: index + 1, correct: true };
            } else {
                incorrectCount++;
                isPreviousCorrect = false; // Mark subsequent iterations as incorrect
                return { iteration: index + 1, correct: false };
            }
        });
    
        setIterationResults(results);
        setMessage(`You got ${correctCount} correct iteration(s) and ${incorrectCount} incorrect iteration(s).`);
    };

    return (
        <div className="short-shift-container">
            <h1>Sort Shift</h1>
            <p className="instruction">Instruction: Use bubble sort to arrange the game items in ascending order.</p>
            <div className="array-label">Original Array:</div>
            <div className="orig-grid-container">
                {originalArray.map((num, index) => (
                    <div key={index} className="orig-grid-item">
                        {num}
                    </div>
                ))}
            </div>

            <div className="iterations">
                <h2>Bubble Sort</h2>
                <div className="controls">
                    <button className="add-btn" onClick={addGrid}>+</button>
                    <button className="remove-btn" onClick={removeGrid}>-</button>
                </div>
                {grids.map((grid, gridIndex) => (
                    <div key={gridIndex}>
                        <h3>{getOrdinalSuffix(gridIndex + 1)} Iteration</h3>
                        <div className="grid-container">
                            {grid.map((num, itemIndex) => (
                                <div 
                                    key={itemIndex} 
                                    className={`grid-item ${selected.gridIndex === gridIndex && selected.itemIndex === itemIndex ? "selected" : ""}`} 
                                    onClick={() => handleSelect(gridIndex, itemIndex)}
                                >
                                    {num}
                                </div>
                            ))}
                        </div>
                        <div className="iteration-status">
                            {iterationResults.length > 0 &&
                                (iterationResults[gridIndex]?.correct ? "✓" : "X")}
                        </div>
                    </div>
                ))}
                <button className="submit-btn" onClick={checkSorting}>Submit</button>
                {message && <p className="result-message">{message}</p>}
            </div>
        </div>
    );
};

export default ShortShift;

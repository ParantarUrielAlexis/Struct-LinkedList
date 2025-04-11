import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import "./SortShiftSelection.css";

const ShortShiftSelection = () => {
    const originalArray = [1, 2, 4, 3, 10, 9, 6];

    const [grids, setGrids] = useState([originalArray.slice()]);
    const [selected, setSelected] = useState({ gridIndex: null, itemIndex: null });
    const [iterationResults, setIterationResults] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const swapSound = new Audio("/sounds/swap.mp3");
    const clickSound = new Audio("/sounds/first_click.mp3");


    const handleSelect = (gridIndex, itemIndex) => {
        if (selected.gridIndex === null) {
            // First selection
            clickSound.play();
            setSelected({ gridIndex, itemIndex });
        } else if (selected.gridIndex === gridIndex && selected.itemIndex !== itemIndex) {
            // Swap only within the same grid
            swapNumbers(gridIndex, selected.itemIndex, itemIndex);
            swapSound.play();
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
        const addGridSound = new Audio("/sounds/add.mp3");
        addGridSound.play();
        if (grids.length < 6 && !isSorted(grids[grids.length - 1])) {
            setGrids([...grids, [...grids[grids.length - 1]]]);
        }
    };

    const removeGrid = () => {
        const removeGridSound = new Audio("/sounds/delete.mp3");
        removeGridSound.play();
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

    // Function to simulate selection sort and store the steps
    const selectionSortSteps = () => {
        let arr = [...originalArray];
        let steps = [arr.slice()]; // Include the initial array as the first step
        for (let i = 0; i < arr.length - 1; i++) {
            let minIndex = i;
            for (let j = i + 1; j < arr.length; j++) {
                if (arr[j] < arr[minIndex]) {
                    minIndex = j;
                }
            }
            if (minIndex !== i) {
                [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
            }
            steps.push(arr.slice()); // Add the current state of the array after each iteration

            // Stop adding steps if the array is already sorted
            if (isSorted(arr)) {
                break;
            }
        }
        return steps;
    };

    // Generate the correct selection sort steps
    const correctSteps = selectionSortSteps();

    const checkIteration = (grid, gridIndex) => {
        // Dynamically compute the expected result for the current iteration
        let arr = [...originalArray];
        for (let i = 0; i <= gridIndex; i++) {
            let minIndex = i;
            for (let j = i + 1; j < arr.length; j++) {
                if (arr[j] < arr[minIndex]) {
                    minIndex = j;
                }
            }
            if (minIndex !== i) {
                [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
            }
        }

        // Compare the user's grid with the dynamically computed result
        return JSON.stringify(grid) === JSON.stringify(arr);
    };

    const checkSorting = () => {
        let correctCount = 0;
        let incorrectCount = 0;
        const iterationsRequired = correctSteps.length; // Total required iterations
        let isPreviousCorrect = true; // Track if all previous iterations were correct

        const results = grids.map((grid, index) => {
            if (index < iterationsRequired && isPreviousCorrect) {
                // Within the required iterations and all previous iterations are correct
                if (checkIteration(grid, index)) {
                    correctCount++;
                    return { iteration: index + 1, correct: true };
                } else {
                    incorrectCount++;
                    isPreviousCorrect = false; // Mark subsequent iterations as incorrect
                    return { iteration: index + 1, correct: false };
                }
            } else {
                // Mark as incorrect if previous iterations were incorrect or it's an extra iteration
                incorrectCount++;
                return { iteration: index + 1, correct: false };
            }
        });

        setIterationResults(results);
        setIsModalOpen(true); // Open the modal
    };

    return (
        <div className="short-shift-container">
            <h1>Sort Shift</h1>
            <p className="instruction">Instruction: Use selection sort to arrange the numbers in ascending order.</p>
            <div className="array-label">Original Array:</div>
            <div className="orig-grid-container">
                {originalArray.map((num, index) => (
                    <div key={index} className="orig-grid-item">
                        {num}
                    </div>
                ))}
            </div>

            <div className="iterations">
                <h2>Selection Sort</h2>
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
                    </div>
                ))}
                <button className="submit-btn" onClick={() => setIsConfirmModalOpen(true)}>Submit</button>
            </div>
            {isConfirmModalOpen && (
                <div className="modal-overlay-confirm">
                    <div className="modal-content-confirm">
                        <div className="modal-header-confirm">
                            <h2>Confirm Submission</h2>
                        </div>
                        <div className="modal-body-confirm">
                            <p>Are you sure you want to submit your answer?</p>
                            <div className="modal-warning">
                                <span className="warning-icon">⚠️</span>
                                <br></br> This action cannot be undone.
                            </div>
                        </div>
                        <div className="modal-footer-confirm">
                            <button className="submit-btn-confirm" onClick={() => {
                                checkSorting();
                                setIsConfirmModalOpen(false);
                            }}>
                                Yes, Submit
                            </button>
                            <button className="cancel-btn-confirm" onClick={() => setIsConfirmModalOpen(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Sorting Results</h2>
                        </div>
                        {/* Scoring System */}
                        <div className="score-container">
                            {(() => {
                                const totalPoints = 60;
                                const iterationsRequired = correctSteps.length - 1; // Exclude the initial array
                                const pointsPerIteration = totalPoints / iterationsRequired;
                                const penaltyPerExtraIteration = pointsPerIteration / 2; // Deduct half the points for extra iterations
                                let score = 0;

                                iterationResults.forEach((result, index) => {
                                    if (index < iterationsRequired) {
                                        // Within the required iterations
                                        if (result.correct) {
                                            score += pointsPerIteration; // Award full points for correct iterations
                                        } else {
                                            score -= penaltyPerExtraIteration; // Deduct points for incorrect iterations
                                        }
                                    } else {
                                        // Extra iterations beyond the required number
                                        score -= penaltyPerExtraIteration; // Penalize extra iterations
                                    }
                                });

                                // Ensure the score doesn't go below 0
                                score = Math.max(0, score);

                                // Determine if the user passed or failed
                                const passingScore = 0.7 * totalPoints; // 70% of total points
                                const remarks = score >= passingScore ? "Pass" : "Fail";
                                const remarksClass = score >= passingScore ? "pass" : "fail";

                                return (
                                    <div className="score-container">
                                        <p>Score: {score.toFixed(2)} / <span className="total-points">{totalPoints}</span></p>
                                        <p>Remark: <span className={remarksClass}>{remarks}</span></p>
                                    </div>
                                );
                            })()}
                        </div>
                        <div className="results-container">
                            <div>
                                <h3>Your Answers</h3>
                                {grids.map((grid, index) => (
                                    <div key={index}>
                                        <h4>{getOrdinalSuffix(index + 1)} Iteration</h4>
                                        <div className="grid-container">
                                            {grid.map((num, i) => (
                                                <div key={i} className="grid-item">
                                                    {num}
                                                </div>
                                            ))}
                                            <span 
                                                className={`iteration-status-icon ${iterationResults[index]?.correct ? 'correct' : 'incorrect'}`}>
                                                {iterationResults[index]?.correct ? "✓" : "X"}
                                            </span>

                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <h3>Correct Answers</h3>
                                {correctSteps.slice(1).map((step, index) => (
                                    <div key={index}>
                                        <h4>{getOrdinalSuffix(index + 1)} Iteration</h4>
                                        <div className="grid-container">
                                            {step.map((num, i) => (
                                                <div key={i} className="grid-item">
                                                    {num}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="reset-container">
                            <button className="reset-btn" onClick={() => window.location.reload()}>
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShortShiftSelection;
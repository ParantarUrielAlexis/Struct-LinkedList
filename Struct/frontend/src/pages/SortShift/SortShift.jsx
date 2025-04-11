import React, { useState } from "react";
import unsortedImg from '../../assets/unsorted.png';
import firstCompare from '../../assets/first_compare.png';
import secondCompare from '../../assets/second_compare.png';
import thirdCompare from '../../assets/third_compare.png';
import fourthCompare from '../../assets/fourth_compare.png';
import fifthCompare from '../../assets/fifth_compare.png';
import sixthCompare from '../../assets/sixth_compare.png';
import firstSwap from '../../assets/first_swap.png';
import secondSwap from '../../assets/second_swap.png';
import thirdSwap from '../../assets/third_swap.png';
import fourthSwap from '../../assets/fourth_swap.png';

import iterationGIF from '../../assets/first_iteration.gif';

import "./SortShift.css";

const ShortShift = () => {
    const originalArray = [2, 10, 8, 4, 9, 56, 6,];

    const [grids, setGrids] = useState([originalArray.slice()]);
    const [selected, setSelected] = useState({ gridIndex: null, itemIndex: null });
    const [iterationResults, setIterationResults] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isTutorialOpen, setIsTutorialOpen] = useState(true);

    const swapSound = new Audio("/sounds/swap.mp3");
    const clickSound = new Audio("/sounds/first_click.mp3");

    const handleSelect = (gridIndex, itemIndex) => {

        if (selected.gridIndex === null) {
            clickSound.play();
            // First selection
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
    
    const closeTutorial = () => {
        setIsTutorialOpen(false);
    }

    const addGrid = () => {
        const addGridSound = new Audio("/sounds/add.mp3");
        addGridSound.play();
        // Don't add new grids if the last grid is already sorted
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
        setIsModalOpen(true); // Open the modal
    };

    return (
        <div className="short-shift-container">
             {isTutorialOpen && (
                <div className="tutorial-modal">
                    <div className="tutorial-content">
                        <h1>Bubble Sort</h1>
                        <hr></hr>
                        <p>
                            <strong>Bubble sort</strong> is a simple comparison-based sorting algorithm. It repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. This process continues until the list is sorted. The algorithm gets its name because smaller elements "bubble" to the top (beginning of the list), while larger elements sink to the bottom (end of the list) with each pass.
                        </p>
                        <div className="how-it-works">
                            <h3>How it works:</h3>
                            <ol>
                                <li>Start at the beginning of the array.</li>
                                <li>Compare the current element with the next one.</li>
                                <li>If the current element is greater than the next, swap them.</li>
                                <li>Move to the next pair and repeat until the end of the array.</li>
                                <li>Repeat the whole process for the remaining unsorted part.</li>
                                <li>Stop when no swaps are needed in a full pass.</li>
                            </ol>
                        </div>
                        <p>
                        Continue reading to fully understand the Bubble Sort algorithm and how to implement it yourself.
                        </p>
                        <div className="line-break">
                            <hr></hr>
                        </div>
                        <div className="manual-run-through">
                            <h2>Manual Run Through</h2>
                            <p>
                                <strong>Step 1: </strong> We start with an unsorted array.
                                <img src={unsortedImg} alt="Unsorted Array" className="unsorted-image" />
                            </p>
                            <p>
                                <strong>Step 2: </strong> We look at the two first values. Does the lowest value come first? Yes, so we don't need to swap them.
                                <img src={firstCompare} alt="First Compare" className="first-compare" />
                            </p>
                            <p>
                                <strong>Step 3: </strong>  Take one step forward and look at values 10 and 8. Does the lowest value come first? No.
                                <img src={secondCompare} alt="Second Compare" className="second-compare" />
                            </p>
                            <p>
                                <strong>Step 4: </strong>  So we need to swap them so that 8 comes first.
                                <img src={firstSwap} alt="First Swap" className="first-swap" />
                            </p>
                            <p>
                                <strong>Step 5: </strong>  Taking one step forwards and look at value 10 and 4. Does the lowest value come first? No.
                                <img src={thirdCompare} alt="Third Compare" className="first-swap" />
                            </p>
                            <p>
                                <strong>Step 6: </strong>  Let's swap them so that 4 comes first.
                                <img src={secondSwap} alt="Second Swap" className="second-swap" />
                            </p>
                            <p>
                                <strong>Step 7: </strong>  Looking at 10 and 9. Do we need to swap them? Yes.
                                <img src={fourthCompare} alt="Fourth Compare" className="fourth-compare" />
                            </p>
                            <p>
                                <strong>Step 8: </strong>  We must swap them so that 9 comes first.
                                <img src={thirdSwap} alt="Third Swap" className="fourth-compare" />
                            </p>
                            <p>
                                <strong>Step 9: </strong>  Now take a look at 10 and 56. Do we need to swap them? No.
                                <img src={fifthCompare} alt="Fifth Compare" className="fourth-compare" />
                            </p>
                            <p>
                                <strong>Step 10: </strong> Now we look at 56 and 6. Do we need to swap them? Yes.
                                <img src={sixthCompare} alt="Sixth Compare" className="fourth-compare" />
                            </p>
                            <p>
                                <strong>Step 11: </strong> Now we look at 56 and 6. Do we need to swap them? Yes.
                                <img src={fourthSwap} alt="Fourth Swap" className="fourth-compare" />
                            </p>
                        </div>
                        <div className="simulation">
                            <p>
                                Watch the simulation to see how the algorithm works in real-time.
                            </p>
                            
                            <img src={iterationGIF} alt="Iteration GIF" className="iteration_gif" />
                        </div>
                        <div className="game-introduction">
                            <h2>Ready to Play?</h2>
                            <p>
                                Now that you understand how Bubble Sort works, it's time to put your knowledge to the test!
                                Your goal is to sort the numbers in ascending order using the Bubble Sort algorithm.
                            </p>
                            <p>
                                Click on two adjacent boxes to swap their positions. Repeat this process until the array is fully sorted.
                                Remember, you can only swap adjacent elements!
                            </p>
                            <p>
                                Good luck, and have fun!
                            </p>
                            <button className="start-btn" onClick={closeTutorial}>
                                Start Game
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {!isTutorialOpen && (
                <>
                <h1>Sort Shift</h1>
                    <p className="instruction">Instruction: Use bubble sort to arrange the numbers in ascending order.</p>
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
                        {grids.map((grid, gridIndex) => {
                            // Dynamically compute the correct result for the current iteration
                            let correctResult = [...originalArray];
                            for (let i = 0; i <= gridIndex; i++) {
                                for (let j = 0; j < correctResult.length - i - 1; j++) {
                                    if (correctResult[j] > correctResult[j + 1]) {
                                        [correctResult[j], correctResult[j + 1]] = [correctResult[j + 1], correctResult[j]];
                                    }
                                }
                            }
                         
                            // Check if this iteration is an "extra iteration"
                            const isExtraIteration = iterationResults.length > 0 && iterationResults[gridIndex]?.correct === false && isSorted(grids[gridIndex]);
                        
                            return (
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
                            );
                        })}
                        <button className="submit-btn" onClick={() => setIsConfirmModalOpen(true)}>Submit</button>
                    </div>
                </>
             )}
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
                                <hr></hr>
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
                                <hr></hr>
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

export default ShortShift;

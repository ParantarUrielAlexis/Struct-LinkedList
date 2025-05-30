import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import musicLogo from '../../assets/music.png';
import tutorialLogo from '../../assets/tutorial.png';
import simulation1 from '../../assets/bubble/simulation1.gif';
import simulation2 from '../../assets/bubble/simulation2.gif';
import simulation3 from '../../assets/bubble/simulation3.gif';
import simulation4 from '../../assets/bubble/simulation4.gif';
import iterationGIF from '../../assets/bubble/bubble_simulation.gif';

import styles from './SortShiftBubble.module.css';

// Add these imports at the top of the file
import { useAuth } from '../../contexts/AuthContext';
import { FaHeart } from 'react-icons/fa';
import axios from 'axios';

// Add this component definition before your main SortShiftBubble component

const RealtimeBubbleSort = ({ array }) => {
    const [currentArray, setCurrentArray] = useState([...array]);
    const [currentStep, setCurrentStep] = useState(-1);
    const [sortingSteps, setSortingSteps] = useState([]);
    const [sortingState, setSortingState] = useState({
        passIndex: -1,
        currentIndex: -1,
        nextIndex: -1,
        comparing: false,
        swapping: false,
        sorted: []
    });
    const [isRunning, setIsRunning] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [speed, setSpeed] = useState(1); // 1x is default speed

    // Generate all steps of bubble sort
    useEffect(() => {
        const steps = [];
        const arr = [...array];
        const n = arr.length;
        const sortedIndices = [];

        steps.push({
            array: [...arr],
            state: {
                passIndex: -1,
                currentIndex: -1,
                nextIndex: -1,
                comparing: false,
                swapping: false,
                sorted: [...sortedIndices]
            },
            message: "Initial array"
        });

        for (let i = 0; i < n - 1; i++) {
            let swapped = false;

            // Step: Start new pass
            steps.push({
                array: [...arr],
                state: {
                    passIndex: i,
                    currentIndex: -1,
                    nextIndex: -1,
                    comparing: false,
                    swapping: false,
                    sorted: [...sortedIndices]
                },
                message: `Starting pass ${i + 1}`
            });

            for (let j = 0; j < n - i - 1; j++) {
                // Step: Compare elements
                steps.push({
                    array: [...arr],
                    state: {
                        passIndex: i,
                        currentIndex: j,
                        nextIndex: j + 1,
                        comparing: true,
                        swapping: false,
                        sorted: [...sortedIndices]
                    },
                    message: `Comparing ${arr[j]} and ${arr[j + 1]}`
                });

                if (arr[j] > arr[j + 1]) {
                    // Step: Begin swap
                    steps.push({
                        array: [...arr],
                        state: {
                            passIndex: i,
                            currentIndex: j,
                            nextIndex: j + 1,
                            comparing: false,
                            swapping: true,
                            sorted: [...sortedIndices]
                        },
                        message: `${arr[j]} > ${arr[j + 1]}, swapping`
                    });

                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    swapped = true;
                    
                    // Step: After swap
                    steps.push({
                        array: [...arr],
                        state: {
                            passIndex: i,
                            currentIndex: j,
                            nextIndex: j + 1,
                            comparing: false,
                            swapping: false,
                            sorted: [...sortedIndices]
                        },
                        message: `Swapped ${arr[j]} and ${arr[j+1]}`
                    });
                } else {
                    // Step: No swap needed
                    steps.push({
                        array: [...arr],
                        state: {
                            passIndex: i,
                            currentIndex: j,
                            nextIndex: j + 1,
                            comparing: false,
                            swapping: false,
                            sorted: [...sortedIndices]
                        },
                        message: `${arr[j]} <= ${arr[j + 1]}, no swap needed`
                    });
                }
            }

            // Mark the last element in this pass as sorted
            sortedIndices.push(n - i - 1);

            // Step: End of pass
            steps.push({
                array: [...arr],
                state: {
                    passIndex: i,
                    currentIndex: -1,
                    nextIndex: -1,
                    comparing: false,
                    swapping: false,
                    sorted: [...sortedIndices]
                },
                message: `End of pass ${i + 1}. Element ${arr[n - i - 1]} is now at its correct position.`
            });

            // If no swaps were made in this pass, the array is sorted
            if (!swapped) {
                // Mark all remaining elements as sorted
                for (let k = 0; k < n - i - 1; k++) {
                    if (!sortedIndices.includes(k)) {
                        sortedIndices.push(k);
                    }
                }
                
                steps.push({
                    array: [...arr],
                    state: {
                        passIndex: -1,
                        currentIndex: -1,
                        nextIndex: -1,
                        comparing: false,
                        swapping: false,
                        sorted: [...sortedIndices].sort((a, b) => a - b)
                    },
                    message: "No swaps in this pass. Array is sorted!"
                });
                break;
            }
        }

        // Final step: All sorted
        if (sortedIndices.length < n) {
            sortedIndices.push(0); // Mark the first element as sorted too
            steps.push({
                array: [...arr],
                state: {
                    passIndex: -1,
                    currentIndex: -1,
                    nextIndex: -1,
                    comparing: false,
                    swapping: false,
                    sorted: [...Array(n).keys()] // All indices are sorted
                },
                message: "Array is completely sorted!"
            });
        }

        setSortingSteps(steps);
        setCurrentArray([...array]);
    }, [array]);

    // Function to control the animation
    useEffect(() => {
        let timerId;
        
        if (isRunning && currentStep < sortingSteps.length - 1 && !isCompleted) {
            // Calculate timeout based on speed: 800ms for 1x, 400ms for 2x, 267ms for 3x
            const timeout = 800 / speed;
            
            timerId = setTimeout(() => {
                const nextStep = currentStep + 1;
                setCurrentStep(nextStep);
                setCurrentArray([...sortingSteps[nextStep].array]);
                setSortingState(sortingSteps[nextStep].state);
                
                if (nextStep === sortingSteps.length - 1) {
                    setIsCompleted(true);
                    setIsRunning(false);
                }
            }, timeout);
        }
        
        return () => clearTimeout(timerId);
    }, [isRunning, currentStep, sortingSteps, isCompleted, speed]);

    const startSorting = () => {
        // Check if we've already started but are paused
        if (currentStep >= 0) {
            // Just resume from current position
            setIsRunning(true);
        } else {
            // This is the initial start
            setIsRunning(true);
            setIsCompleted(false);
            setCurrentStep(-1);
            setCurrentArray([...array]);
            setSortingState({
                passIndex: -1,
                currentIndex: -1,
                nextIndex: -1,
                comparing: false,
                swapping: false,
                sorted: []
            });
        }
    };

    const resetSorting = () => {
        setIsRunning(false);
        setIsCompleted(false);
        setCurrentStep(-1);
        setCurrentArray([...array]);
        setSortingState({
            passIndex: -1,
            currentIndex: -1,
            nextIndex: -1,
            comparing: false,
            swapping: false,
            sorted: []
        });
    };

    const pauseSorting = () => {
        setIsRunning(false);
    };

    const handleSpeedChange = (event) => {
        // Convert the slider value (0-100) to a speed value (1-3)
        // 0-33 = 1x, 34-66 = 2x, 67-100 = 3x
        const sliderValue = parseInt(event.target.value, 10);
        let newSpeed = 1;
        if (sliderValue > 66) {
            newSpeed = 3;
        } else if (sliderValue > 33) {
            newSpeed = 2;
        }
        
        setSpeed(newSpeed);
    };

    const getItemClassName = (index) => {
        const baseClass = styles["realtime-item"];
        if (sortingState.sorted.includes(index)) return `${baseClass} ${styles["sorted"]}`;
        if (index === sortingState.currentIndex) return `${baseClass} ${styles["current"]}`;
        if (index === sortingState.nextIndex) return `${baseClass} ${styles["next"]}`;
        if (sortingState.comparing && 
            (index === sortingState.currentIndex || index === sortingState.nextIndex)) 
            return `${baseClass} ${styles["comparing"]}`;
        if (sortingState.swapping && 
            (index === sortingState.currentIndex || index === sortingState.nextIndex)) 
            return `${baseClass} ${styles["swapping"]}`;
        return baseClass;
    };

    return (
        <div className={styles["realtime-sort-container"]}>
            <div className={styles["legend"]}>
                <div className={styles["legend-item"]}>
                    <span className={`${styles["legend-color"]} ${styles["sorted-color"]}`}></span>
                    <span>Sorted</span>
                </div>
                <div className={styles["legend-item"]}>
                    <span className={`${styles["legend-color"]} ${styles["current-color"]}`}></span>
                    <span>Current Position</span>
                </div>
                <div className={styles["legend-item"]}>
                    <span className={`${styles["legend-color"]} ${styles["next-color"]}`}></span>
                    <span>Next Position</span>
                </div>
                
            </div>
            <div className={styles["realtime-array-container"]}>
                {currentArray.map((value, index) => (
                    <div 
                        key={index} 
                        className={getItemClassName(index)}
                    >
                        {value}
                    </div>
                ))}
            </div>
            {currentStep >= 0 && currentStep < sortingSteps.length && (
                <div className={styles["step-message"]}>
                    {sortingSteps[currentStep].message}
                </div>
            )}
            <div className={styles["controls-container"]}>
                {!isRunning && !isCompleted && (
                    <button onClick={startSorting} className={styles["control-button"]}>
                        Start
                    </button>
                )}
                {isRunning && (
                    <button onClick={pauseSorting} className={styles["control-button"]}>
                        Pause
                    </button>
                )}
                {(isRunning || isCompleted || currentStep > -1) && (
                    <button onClick={resetSorting} className={styles["control-button"]}>
                        Reset
                    </button>
                )}
            </div>
            
            <div className={styles["speed-controls"]}>
                <span className={styles["speed-label"]}>1.0x</span>
                <input 
                    type="range"
                    min="0"
                    max="100"
                    className={styles["speed-slider"]}
                    value={speed === 1 ? 0 : speed === 2 ? 50 : 100}
                    onChange={handleSpeedChange}
                />
                <span className={styles["speed-label"]}>3x</span>
            </div>
        </div>
    );
};
const SortShiftBubble = () => {
    const backgroundSound = useRef(new Audio("/sounds/bubble_background.mp3")); 
    const navigate = useNavigate();
    
    // Add these lines for heart functionality
    const { isAuthenticated, user: authUser, updateUser } = useAuth();
    const [hearts, setHearts] = useState(0); // Default to 3 hearts
    const [hasDeductedHeart, setHasDeductedHeart] = useState(false);
    const [successTimeoutId, setSuccessTimeoutId] = useState(null);
    
    const generateRandomArray = () =>{
        return Array.from({ length: 7}, () => Math.floor(Math.random() * 100) + 1 )
    }
    const [originalArray, setOriginalArray] = useState([]);
    const realTimeArray = [23, 54, 82, 71, 12, 93, 28]
    const [grids, setGrids] = useState([originalArray.slice()]);
    const [selected, setSelected] = useState({ gridIndex: null, itemIndex: null });
    const [iterationResults, setIterationResults] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isTutorialOpen, setIsTutorialOpen] = useState(true);
    const [isPlaying, setIsPlaying] = useState(true);
    const [score, setScore] = useState(0); // Add these state variables
    const [remarks, setRemarks] = useState("");
    const [startTime, setStartTime] = useState(Date.now()); // Add this for duration tracking
    const [tutorialPage, setTutorialPage] = useState(0); 
    const tutorialPages = [
        {
            title: "How Bubble Sort Works",
            content: (
                <>
                    <div className="simulation-text">
                    <p><strong>Bubble Sort</strong> is a straightforward sorting algorithm that repeatedly traverses the list, compares adjacent elements, and swaps them if they are in the wrong order. This process is repeated until the entire list is sorted in ascending order.</p>
                    </div>
                    <br></br>
                    <h2><strong>Here are the steps:</strong></h2>
                    <ol>
                        <li>Start from the beginning of the array and compare the first two adjacent elements.</li>
                        <li>If the first element is greater than the second, swap them. Otherwise, move to the next pair.</li>
                        <li>Repeat this process for the entire array. After one pass, the largest element will be at the end.</li>
                        <li>Ignore the last sorted element(s) and repeat the process for the remaining unsorted portion of the array.</li>
                        <li>Continue until no swaps are needed, indicating that the array is fully sorted.</li>
                    </ol>
                    <p>Watch the simulation to see how the algorithm works in real-time.</p>
                    <div className={styles["realtime-simulation"]}>
                        <RealtimeBubbleSort array={realTimeArray} />
                     </div>
                     <p>Watch the simulation to see how the algorithm works in each iteration.</p>
                    <div className={styles["simulation-grid"]}>
                        <div className={styles["simulation-row"]}>
                            <div className={styles["simulation-cell"]}>
                                <img src={simulation1} alt="1st Iteration" className={styles["simulation-gif"]} />
                                <p className={styles["simulation-label"]}>1st Iteration (swapped)</p>
                            </div>
                            <div className={styles["simulation-cell"]}>
                                <img src={simulation2} alt="2nd Iteration" className={styles["simulation-gif"]} />
                                <p className={styles["simulation-label"]}>2nd Iteration (swapped)</p>
                            </div>
                        </div>
                        <div className={styles["simulation-row"]}>
                            <div className={styles["simulation-cell"]}>
                                <img src={simulation3} alt="3rd Iteration" className={styles["simulation-gif"]} />
                                <p className={styles["simulation-label"]}>3rd Iteration (swapped)</p>
                            </div>
                            <div className={styles["simulation-cell"]}>
                                <img src={simulation4} alt="4th Iteration" className={styles["simulation-gif"]} />
                                <p className={styles["simulation-label"]}>4th Iteration (swapped)</p>
                            </div>
                        </div>
                    </div>
                    <h2><strong>Time Complexity</strong></h2>
                    <p><strong>Worst case: </strong>O(n²). Since we loop through n elements n times, n being the length of the array, the time complexity of bubble sort becomes O(n²).</p>
                    <p><strong>Best case:</strong> O(n²). Even if the array is sorted, the algorithm checks each adjacent pair and hence the best-case time complexity will be the same as the worst-case.</p>
                </>
            ),
        },
        {
            title: "Game Mechanics",
            content: (
                <>
                   <h1>How to Play:</h1>
                    <ol>
                        <li>Click on a box to select the element you want to move.</li>
                        <li>Click on the target position in the sorted portion to insert the selected element.</li>
                        <li>Repeat this process for each iteration until the entire array is sorted.</li>
                        <li>Ensure that you follow the correct steps for each iteration to avoid penalties.</li>
                        <li>Click the "Submit" button once you believe the array is sorted correctly.</li>
                        <li>Use the "+" button to add a new grid/iteration or the "-" button to remove a grid/iteration if needed.</li>
                        <li>Click the "Tutorial" button to revisit the instructions or the "Music" button to toggle background music.</li>
                        <li>Earn points based on the accuracy and efficiency of your sorting process.</li>
                    </ol>
                    <p>Note: Even if the element is already sorted at the index n. You still need to add an iteration in order to get more points/score</p>
                </>
            ),
        },
        {
            title: "Scoring Works",
            content: (
                <>
                    <h1>How Scoring Works</h1>
                    <ul>
                        <li><strong>Correct Iterations:</strong> You earn points for each correct iteration. The total points are divided equally among the required iterations.</li>
                        <li><strong>Incorrect Iterations:</strong> Points are deducted for incorrect iterations.</li>
                        <li><strong>Extra Iterations:</strong> Points are also deducted if you perform unnecessary extra iterations after the array is already sorted.</li>
                        <li><strong>Maximum Score:</strong> The maximum score you can achieve is <strong>60 points</strong>.</li>
                        <li><strong>Passing Score:</strong> To pass, you need to score at least <strong>70%</strong> of the total points (42 points).</li>
                    </ul>
                </>
            ),
        },
    ];
    useEffect(() => {
        const randomArray = generateRandomArray();
        setOriginalArray(randomArray);
        setGrids([randomArray]);
    }, []);

    useEffect(() => {
        const sound = backgroundSound.current;
    
        return () => {
            sound.pause();
            sound.currentTime = 0;
        };
    }, []);

    // Fetch hearts from authenticated user
    useEffect(() => {
        if (isAuthenticated && authUser) {
            setHearts(authUser.hearts || 0);
        }
    }, [isAuthenticated, authUser]);

    // Handle page refresh heart deduction
    useEffect(() => {
        // Set up event listener for page refresh
        const handleBeforeUnload = (e) => {
            // Standard way to show a confirmation dialog on refresh/navigation away
            const message = 'Are you sure you want to leave? This will cost you 1 heart.';
            e.preventDefault();
            e.returnValue = message; // This is what shows in the confirmation dialog
            
            // Store information that the page is being refreshed intentionally
            sessionStorage.setItem('refreshIntended', 'true');
            
            return message; // For older browsers
        };

        // Check if there was an intended refresh
        const checkForRefresh = () => {
            const wasRefreshIntended = sessionStorage.getItem('refreshIntended') === 'true';
            
            // If this is a refresh (not first load) and heart hasn't been deducted yet
            if (wasRefreshIntended && !hasDeductedHeart && isAuthenticated && authUser) {
                deductHeart();
                // Clear the flag
                sessionStorage.removeItem('refreshIntended');
            }
        };
        
        // Function to deduct a heart
        const deductHeart = async () => {
            try {
                const token = localStorage.getItem("authToken");
                if (!token) return;
                
                const newHeartCount = Math.max(0, authUser.hearts - 1);
                setHearts(newHeartCount);
                setHasDeductedHeart(true);
                
                // Update in the backend
                const API_BASE_URL = 'http://localhost:8000';
                const response = await axios.patch(
                    `${API_BASE_URL}/api/user/profile/`,
                    { hearts: newHeartCount },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Token ${token}`
                        }
                    }
                );
                
                // Update user in context
                if (typeof updateUser === 'function' && response.data) {
                    updateUser({
                        ...authUser,
                        hearts: newHeartCount
                    });
                }
                
                // If no hearts left, redirect
                if (newHeartCount <= 0) {
                    alert("You don't have enough hearts to continue playing!");
                    navigate('/sortshift');
                }
            } catch (error) {
                console.error('Error updating heart count:', error);
            }
        };

        // Add the event listener
        window.addEventListener('beforeunload', handleBeforeUnload);
        
        // On component mount, check if this is a refresh
        checkForRefresh();
        
        // On first load, set a flag to indicate the page has been visited
        if (!sessionStorage.getItem('pageVisited')) {
            sessionStorage.setItem('pageVisited', 'true');
            // Clear any previous refresh intentions
            sessionStorage.removeItem('refreshIntended');
        }
        
        // Cleanup
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            
            // Clear any lingering timeouts when component unmounts
            if (successTimeoutId) {
                clearTimeout(successTimeoutId);
            }
        };
    }, [isAuthenticated, authUser, hasDeductedHeart, navigate, updateUser, successTimeoutId]);

    const swapSound = new Audio("/sounds/swap.mp3");
    const clickSound = new Audio("/sounds/first_click.mp3");

    const toggleMusic = () => {
        const sound = backgroundSound.current;
        if(sound.paused){
            sound.play();
            setIsPlaying(true);
        } else {
            sound.pause();
            setIsPlaying(false);
        }
    }
    const handleNext = () => {
        if (tutorialPage < tutorialPages.length - 1) {
            setTutorialPage(tutorialPage + 1);
        }
    };

    const handlePrevious = () => {
        if (tutorialPage > 0) {
            setTutorialPage(tutorialPage - 1);
        }
    };

    const handleSelect = (gridIndex, itemIndex) => {

        if (selected.gridIndex === null) {
            clickSound.play();
            
            setSelected({ gridIndex, itemIndex });
        } else if (selected.gridIndex === gridIndex && selected.itemIndex !== itemIndex) {
            
            swapNumbers(gridIndex, selected.itemIndex, itemIndex);
            swapSound.play();
            setSelected({ gridIndex: null, itemIndex: null });
        } else {
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
        const sound = backgroundSound.current;
        sound.volume = 0.2; 
        sound.loop = true; 
        sound.play();   
    };


    const addGrid = () => {
        const addGridSound = new Audio("/sounds/add.mp3");
        addGridSound.play();
        // Don't add new grids if the last grid is already sorted
        if (grids.length < 6 ) {
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
    const updateProgress = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) return;
            
            await axios.post(
            'http://localhost:8000/api/user-progress/',
            { bubble_sort_passed: true }, // Changed from selection_sort_passed to bubble_sort_passed
            { headers: { Authorization: `Token ${token}` } }
            );
        } catch (err) {
            console.error("Error updating progress:", err);
        }
    };
    const checkSorting = async () => {
    let correctCount = 0;
    let incorrectCount = 0;
    let isPreviousCorrect = true;
    let isAlreadySorted = false;

    const results = grids.map((grid, index) => {
        if (isPreviousCorrect && !isAlreadySorted && checkIteration(grid, index)) {
            if (isSorted(grid)) {
                isAlreadySorted = true;
            }
            correctCount++;
            return { iteration: index + 1, correct: true };
        } else {
            incorrectCount++;
            isPreviousCorrect = false;
            return { iteration: index + 1, correct: false };
        }
    });

    setIterationResults(results);

    // Calculate score and remarks
    const totalPoints = 60;
    const iterationsRequired = correctSteps.length - 1;
    const pointsPerIteration = totalPoints / iterationsRequired;
    const penaltyPerExtraIteration = pointsPerIteration / 4;
    let calculatedScore = 0;

    results.forEach((result, index) => {
        if (index < iterationsRequired) {
            if (result.correct) {
                calculatedScore += pointsPerIteration;
            } else {
                calculatedScore -= penaltyPerExtraIteration;
            }
        } else {
            calculatedScore -= penaltyPerExtraIteration;
        }
    });

    calculatedScore = Math.max(0, calculatedScore);
    const passingScore = 0.7 * totalPoints;
    const calculatedRemarks = calculatedScore >= passingScore ? "Pass" : "Fail";

    setScore(calculatedScore.toFixed(2));
    setRemarks(calculatedRemarks);

    // Calculate duration in seconds
    const endTime = Date.now();
    const durationInSeconds = (endTime - startTime) / 1000;
    
    // Send results to the backend
    try {
        const token = localStorage.getItem('authToken');
        if (!token) return;
        
        await axios.post(
            'http://localhost:8000/api/bubble-sort/results/',
            { 
                score: parseFloat(calculatedScore.toFixed(2)),
                duration: durationInSeconds
            },
            { headers: { Authorization: `Token ${token}` } }
        );
        
        console.log('Bubble sort results sent to backend');
    } catch (err) {
        console.error('Error saving bubble sort results:', err.response ? err.response.data : err.message);
    }

    // Show the modal after all calculations are done
    setIsModalOpen(true);
    
    if (calculatedRemarks === "Pass") {
        await updateProgress(); // Wait for update to complete
    }
};


    return (
        <div className={styles['short-shift-container']}>
             <video className={styles['background-video']} autoPlay loop muted>
            <source src="/video/bubble_bg.mp4" type="video/mp4" />
            Your browser does not support the video tag.
        </video>
            {isTutorialOpen && (
                <div className={styles["tutorial-modal"]}>
                    <div className={styles["tutorial-content"]}>
                        <div className={styles["tutorial-header"]}>
                            <h1>{tutorialPages[tutorialPage].title}</h1>
                            <button className={styles["close-btn"]} onClick={closeTutorial}>
                                X
                            </button>
                        </div>
                        <div className={styles["tutorial-body"]}>
                            {tutorialPages[tutorialPage].content}
                        </div>
                        <div className={styles["tutorial-navigation"]}>
                            <button
                                className={styles["previous-btn"]}
                                onClick={handlePrevious}
                                disabled={tutorialPage === 0}
                            >
                                Previous
                            </button>
                            <button
                                className={styles["next-btn"]}
                                onClick={handleNext}
                                disabled={tutorialPage === tutorialPages.length - 1}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {!isTutorialOpen && (
                <>
                    <h1 className={styles["title-game"]}>Sort Shift</h1>
                    <p className={styles["instruction"]}>Instruction: Use bubble sort to arrange the numbers in ascending order.</p>
                    <div className={styles["array-label"]}>Original Array:</div>
                    <div className={styles["orig-grid-container"]}>
                        {originalArray.map((num, index) => (
                            <div key={index} className={styles["orig-grid-item"]}>
                                {num}
                            </div>
                        ))}
                    </div>

                    {/* Heart counter */}
                    <div className={styles["heart-counter"]}>
                        <FaHeart className={styles["heart-icon"]} />
                        <span className={styles["heart-count"]}>{hearts}</span>
                    </div>

                    <div className={styles["iterations"]}>
                        <h2 className={styles["bubble-sort-title"]}>Bubble Sort</h2>
                        <div className={styles["game-controls"]}>
                            <button
                                className={`${styles["control-btn"]} ${styles["tutorial-btn"]}`}
                                onClick={() => setIsTutorialOpen(true)}
                            >
                                <img src={tutorialLogo} alt="Tutorial" className={styles["tutorial-logo"]} />
                            </button>

                            <button className={`${styles["control-btn"]} ${styles["music-btn"]}`} onClick={toggleMusic}>
                                <div className={`${styles["music-logo-wrapper"]} ${!isPlaying ? styles["slashed"] : ""}`}>
                                    <img src={musicLogo} alt="Music" className={styles["music-logo"]} />
                                </div>
                            </button>
                        </div>
                        <div className={styles["controls"]}>
                            <div className={styles["tooltip-container"]}>
                                <button className={styles["add-btn"]} onClick={addGrid}>+</button>
                                <span className={styles["tooltip-text"]}>Add Iteration</span>
                            </div>
                            <div className={styles["tooltip-container"]}>
                                <button className={styles["remove-btn"]} onClick={removeGrid}>-</button>
                                <span className={styles["tooltip-text"]}>Remove Iteration</span>
                            </div>
                        </div>
                        {grids.map((grid, gridIndex) => {
                            let correctResult = [...originalArray];
                            for (let i = 0; i <= gridIndex; i++) {
                                for (let j = 0; j < correctResult.length - i - 1; j++) {
                                    if (correctResult[j] > correctResult[j + 1]) {
                                        [correctResult[j], correctResult[j + 1]] = [correctResult[j + 1], correctResult[j]];
                                    }
                                }
                            }

                            const isExtraIteration = iterationResults.length > 0 && iterationResults[gridIndex]?.correct === false && isSorted(grids[gridIndex]);

                            return (
                                <div key={gridIndex}>
                                    <h3 className={styles["iteration-title"]}>{getOrdinalSuffix(gridIndex + 1)} Iteration</h3>
                                    <div className={styles["grid-container"]}>
                                        {grid.map((num, itemIndex) => (
                                            <div
                                                key={itemIndex}
                                                className={`${styles["grid-item"]} ${selected.gridIndex === gridIndex && selected.itemIndex === itemIndex ? styles["selected"] : ""}`}
                                                onClick={() => handleSelect(gridIndex, itemIndex)}
                                            >
                                                {num}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                        <button className={styles["submit-btn"]} onClick={() => setIsConfirmModalOpen(true)}>Submit</button>
                    </div>
                </>
            )}
            {isConfirmModalOpen && (
                <div className={styles["modal-overlay-confirm"]}>
                    <div className={styles["modal-content-confirm"]}>
                        <div className={styles["modal-header-confirm"]}>
                            <h2>Confirm Submission</h2>
                        </div>
                        <div className={styles["modal-body-confirm"]}>
                            <p>Are you sure you want to submit your answer?</p>
                            <div className={styles["modal-warning"]}>
                                <span className={styles["warning-icon"]}>⚠️</span>
                                <br /> This action cannot be undone.
                            </div>
                        </div>
                        <div className={styles["modal-footer-confirm"]}>
                            <button className={styles["submit-btn-confirm"]} onClick={() => {
                                const sound = backgroundSound.current;
                                sound.pause();
                                sound.currentTime = 0;
                                checkSorting();
                                setIsConfirmModalOpen(false);
                            }}>
                                Yes, Submit
                            </button>
                            <button className={styles["cancel-btn-confirm"]} onClick={() => setIsConfirmModalOpen(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isModalOpen && (
                <div className={styles["modal-overlay"]}>
                    <div className={styles["modal-content"]}>
                        <div className={styles["modal-header"]}>
                            <h2>Sorting Results</h2>
                        </div>
                        <div className={styles["score-container"]}>
                            {(() => {
                                const totalPoints = 60;
                                const iterationsRequired = correctSteps.length - 1;
                                const pointsPerIteration = totalPoints / iterationsRequired;
                                const penaltyPerExtraIteration = pointsPerIteration / 2;
                                let score = 0;

                                iterationResults.forEach((result, index) => {
                                    if (index < iterationsRequired) {
                                        if (result.correct) {
                                            score += pointsPerIteration;
                                        } else {
                                            score -= penaltyPerExtraIteration;
                                        }
                                    } else {
                                        score -= penaltyPerExtraIteration;
                                    }
                                });

                                score = Math.max(0, score);

                                const passingScore = 0.7 * totalPoints;
                                const remarks = score >= passingScore ? "Pass" : "Fail";
                                const remarksClass = score >= passingScore ? styles["pass"] : styles["fail"];

                                return (
                                    <div className={styles["score-container"]}>
                                        <p>Score: {score.toFixed(2)} / <span className={styles["total-points"]}>{totalPoints}</span></p>
                                        <p>Remark: <span className={remarksClass}>{remarks}</span></p>
                                    </div>
                                );
                            })()}
                        </div>
                        <div className={styles["results-container"]}>
                            <div>
                                <h3 className={styles["results-title"]}>Your Answers</h3>
                                <hr />
                                {grids.map((grid, index) => (
                                    <div key={index}>
                                        <h4 className={styles["iteration-title"]}>{getOrdinalSuffix(index + 1)} Iteration</h4>
                                        <div className={styles["grid-container"]}>
                                            {grid.map((num, i) => (
                                                <div key={i} className={styles["grid-item"]}>
                                                    {num}
                                                </div>
                                            ))}
                                            <span
                                                className={`${styles["iteration-status-icon"]} ${iterationResults[index]?.correct ? styles["correct"] : styles["incorrect"]}`}>
                                                {iterationResults[index]?.correct ? "✓" : "X"}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <h3 className={styles["results-title"]}>Correct Answers</h3>
                                <hr />
                                {correctSteps.slice(1).map((step, index) => (
                                    <div key={index}>
                                        <h4 className={styles["iteration-title"]}>{getOrdinalSuffix(index + 1)} Iteration</h4>
                                        <div className={styles["grid-container"]}>
                                            {step.map((num, i) => (
                                                <div key={i} className={styles["grid-item"]}>
                                                    {num}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={styles["reset-container"]}>
                            <button className={styles["reset-btn"]} onClick={() => window.location.reload()}>
                                Reset
                            </button>
                            <button
                                className={styles["next-btn"]}
                                onClick={() => navigate("/sortshift")}
                                disabled={remarks === "Fail"}
                            >
                                Go Back
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
        </div>
    );
};

export default SortShiftBubble;

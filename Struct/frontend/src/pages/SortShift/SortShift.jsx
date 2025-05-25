import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa'; // Import heart icon
import selectionLogo from '../../assets/selection/selection_sort.png';
import insertionLogo from '../../assets/insertion/insertion_sort.png';
import tutorialLogo from '../../assets/tutorial.png';
import bubbleLogo from '../../assets/bubble/bubble_sort.png';
import './SortShift.css';
import { useAuth } from '../../contexts/AuthContext'; // Import auth context
import axios from 'axios'; // Add this import


const levels = [
  { id: 1, title: 'Selection Sort', backgroundImage: selectionLogo, path: '/sortshiftselection' },
  { id: 2, title: 'Bubble Sort', backgroundImage: bubbleLogo, path: '/sortshiftbubble' },
  { id: 3, title: 'Insertion Sort', backgroundImage: insertionLogo, path: '/sortshiftinsertion' },
];

export default function SortShift() {
  const navigate = useNavigate();
  const { isAuthenticated, user: authUser, updateUser } = useAuth(); // Get user and updateUser from auth context
  const [hearts, setHearts] = useState(0); // Default to 3 hearts
  
  const gameStartSound = useRef(new Audio('/sounds/game_start_sound.mp3'));
  const backgroundSound = useRef(new Audio('/sounds/sortshift_background.mp3'));
  const [isLoading, setIsLoading] = useState(false);
  const [loadingImage, setLoadingImage] = useState(null);
  const [fadeIn, setFadeIn] = useState(false);
  const [progress, setProgress] = useState(() => {
    // Retrieve progress from localStorage or default to level 1
    return parseInt(localStorage.getItem('progress')) || 1;
  });
  const [isTutorialOpen, setIsTutorialOpen] = useState(false); // Changed to false initially
  const [tutorialPage, setTutorialPage] = useState(0); 
  const tutorialPages = [
    {
        title: "Introduction to Sorting Algorithms",
        content: (
            <>
                <p><strong>Sorting algorithms</strong> are step-by-step procedures used to arrange items in a specific order, usually numerical order [1, 2, 3...] or alphabetical order [A, B, C...].</p>
                <br></br>
                <div className="tutorial-visual">
                    <div className="array-labels">
                        <span className="unsorted-label">Unsorted Array</span>
                        <span className="sorted-label">Sorted Array</span>
                    </div>
                    <div className="array-example">
                        <span className="unsorted">5</span>
                        <span className="unsorted">2</span>
                        <span className="unsorted">9</span>
                        <span className="unsorted">1</span>
                        <span className="unsorted">6</span>
                        <span className="arrow">→</span>
                        <span className="sorted">1</span>
                        <span className="sorted">2</span>
                        <span className="sorted">5</span>
                        <span className="sorted">6</span>
                        <span className="sorted">9</span>
                    </div>
                </div>
                <br></br>
                <div className="tutorial-visual">
                    <div className="array-labels">
                        <span className="unsorted-label">Unsorted Array</span>
                        <span className="sorted-label">Sorted Array</span>
                    </div>
                    <div className="array-example">
                        <span className="unsorted">B</span>
                        <span className="unsorted">C</span>
                        <span className="unsorted">D</span>
                        <span className="unsorted">E</span>
                        <span className="unsorted">A</span>
                        <span className="arrow">→</span>
                        <span className="sorted">A</span>
                        <span className="sorted">B</span>
                        <span className="sorted">C</span>
                        <span className="sorted">D</span>
                        <span className="sorted">E</span>
                    </div>
                </div>
                <br></br>
                <br></br>
                <h2 style={
                    {
                      marginBottom: "15px"
                    }
                }><strong>Why Are Sorting Algorithms Important?</strong></h2>
                <ul>
                    <li>They help organize data so it's easier to search through</li>
                    <li>They're fundamental to computer science and programming</li>
                    <li>They're used in everyday applications like contacts lists, music playlists, and search results</li>
                </ul>
                <h2 style={{
                  marginTop: "25px",
                }}>In SortShift, you'll learn different sorting techniques by interactively moving numbers into their correct positions!</h2>
            </>
        ),
    },
    {
        title: "Sorting Algorithms Overview",
        content: (
            <>
                <div className="simulation-text">
                    <p>SortShift features three classic sorting algorithms that you'll learn through interactive gameplay:</p>
                </div>
                
                <div className="algorithm-cards">
                    <div className="algorithm-card">
                        <h3>Selection Sort</h3>
                        <p>Repeatedly finds the smallest element from the unsorted portion and moves it to the beginning of the sorted portion.</p>
                        <div className="complexity-info">
                            <span>Time Complexity: O(n²)</span>
                            <span>Space Complexity: O(1)</span>
                        </div>
                        
                    </div>
                    
                    <div className="algorithm-card">
                        <h3>Bubble Sort</h3>
                        <p>Repeatedly steps through the list, compares adjacent elements and swaps them if they're in the wrong order.</p>
                        <div className="complexity-info">
                            <span>Time Complexity: O(n²)</span>
                            <span>Space Complexity: O(1)</span>
                        </div>
                    </div>
                    
                    <div className="algorithm-card">
                        <h3>Insertion Sort</h3>
                        <p>Builds the sorted array one element at a time by inserting each element into its correct position.</p>
                        <br></br>
                        <div className="complexity-info">
                            <span>Time Complexity: O(n²)</span>
                            <span>Space Complexity: O(1)</span>
                        </div>
                        
                    </div>
                </div>
                
                <p>Each algorithm has its own unique approach and efficiency. Choose a level to learn more about how each one works!</p>
            </>
        ),
    },
    {
        title: "How to Play SortShift",
        content: (
            <>
                <div className="tutorial-steps">
                    <div className="step">
                        <div className="step-number">1</div>
                        <div className="step-content">
                            <h3>Choose an Algorithm</h3>
                            <p>Select from Selection Sort, Bubble Sort, or Insertion Sort to begin your sorting adventure.</p>
                            <div className="step-visual level-selection"></div>
                        </div>
                    </div>
                    
                    <div className="step">
                        <div className="step-number">2</div>
                        <div className="step-content">
                            <h3>Follow the Algorithm's Rules</h3>
                            <p>Each algorithm has specific rules for comparing and moving elements. The level-specific tutorial will guide you.</p>
                        </div>
                    </div>
                    
                    <div className="step">
                        <div className="step-number">3</div>
                        <div className="step-content">
                            <h3>Sort Step by Step</h3>
                            <p>Click elements to select them and click destination positions to move them according to the algorithm's rules.</p>
                            <div className="step-visual sorting-action"></div>
                        </div>
                    </div>
                    
                    <div className="step">
                        <div className="step-number">4</div>
                        <div className="step-content">
                            <h3>Track Your Progress</h3>
                            <p>Use the "+" button to add new iterations and the "-" button to remove them as needed.</p>
                            <div className="step-visual iteration-controls"></div>
                        </div>
                    </div>
                    
                    <div className="step">
                        <div className="step-number">5</div>
                        <div className="step-content">
                            <h3>Submit Your Solution</h3>
                            <p>When you believe your sorting process is complete, click "Submit" to check your solution.</p>
                        </div>
                    </div>
                </div>
                
                <div className="tip-box">
                    <h3>Pro Tip:</h3>
                    <p>Pay close attention to each algorithm's specific tutorial when you start a level. Understanding the algorithm's logic is key to sorting successfully!</p>
                </div>
            </>
        ),
    },
    
];
  const [showNoHeartsModal, setShowNoHeartsModal] = useState(false); // Add state for modal

  // Fetch hearts from authenticated user
  useEffect(() => {
    if (isAuthenticated && authUser) {
      setHearts(authUser.hearts || 0);
    }
  }, [isAuthenticated, authUser]);

  useEffect(() => {
    const sound = backgroundSound.current;
    sound.loop = true;
    sound.play();

    return () => {
      sound.pause();
      sound.currentTime = 0;
    };
  }, []);
   const closeTutorial = () => {
    setIsTutorialOpen(false);
  };

  const handlePrevious = () => {
    if (tutorialPage > 0) {
      setTutorialPage(tutorialPage - 1);
    }
  };

  const handleNext = () => {
    if (tutorialPage < tutorialPages.length - 1) {
      setTutorialPage(tutorialPage + 1);
    } else {
      closeTutorial();
    }
  };

  const decreaseHeart = async () => {
    if (!isAuthenticated || !authUser) return;
    
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;
      
      const newHeartCount = hearts - 1;
      setHearts(newHeartCount); // Update UI immediately
      
      // Update user data in the backend using the existing user API
      const API_BASE_URL = 'http://localhost:8000';
      const response = await axios.patch(
        `${API_BASE_URL}/api/user/profile/`,  // Use the existing user profile endpoint
        { hearts: newHeartCount },            // Only send the hearts field to update
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
          }
        }
      );
      
      console.log('Heart update response:', response.data);
      
      // Update user in context if updateUser function is available
      if (typeof updateUser === 'function' && response.data) {
        updateUser({
          ...authUser,
          hearts: newHeartCount
        });
      }
    } catch (error) {
      console.error('Error updating heart count:', error);
      // Revert heart count if API call fails
      setHearts(hearts);
    }
  };

  const handlePlayClick = (path, image, levelId) => {
    if (levelId > progress) return; // Prevent access to locked levels
    
    // Check if user has hearts - show modal if they have ZERO hearts
    if (hearts <= 0) {  // Changed back to <= 0 to be clear
      setShowNoHeartsModal(true);
      return;
    }
    
    // Deduct heart (this should happen before navigating)
    decreaseHeart();

    // Play sounds and show loading screen
    const bgSound = backgroundSound.current;
    const startSound = gameStartSound.current;

    bgSound.pause();
    bgSound.currentTime = 0;

    startSound.play();

    setLoadingImage(image);
    setIsLoading(true);
    setFadeIn(false);
    
    setTimeout(() => {
      setFadeIn(true);
    }, 100);
    
    // Navigate after loading animation
    setTimeout(() => {
      if (levelId === progress) {
        const newProgress = progress + 1;
        setProgress(newProgress);
        localStorage.setItem('progress', newProgress); 
      }
      navigate(path);
    }, 4000);
  };

  return (
    <div className="container">
      {isLoading && (
        <div className={`loading-overlay ${isLoading ? 'loading-active' : 'loading-done'}`}>
          <img
            src={loadingImage}
            alt="Loading Level"
            className={`loading-image ${fadeIn ? 'fade-in' : ''}`}
          />
          <div className="loading-spinner"></div>
        </div>
      )}
      <video className="background-video" autoPlay loop muted>
        <source src="/video/sortshift_bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <h1 className="title">SortShift</h1>
      <hr />
      <p className="tagline">"Click. Swap. Sort your way to victory"</p>
      
      {/* Heart indicator */}
      <div className="heart-counter">
        <FaHeart className="heart-icon" />
        <span className="heart-count">{hearts}</span>
        <button
            className="control-btn tutorial-btn"
            style={{ 
              backgroundColor: '#847171',
              width: '28px',
              height: '28px',
              marginLeft: '15px',
            }}
            onClick={() => setIsTutorialOpen(true)} 
        >
            <img src={tutorialLogo} alt="Tutorial" className="tutorial-logo"
            style={
              {
                width: '18px',
                height: '18px',
              }
            }/>
        </button>
      </div>
      
      <div className="level-grid ">
        
        {levels.map((level) => (
          <div
            key={level.id}
            className={`level-card ${level.id > progress ? 'locked' : ''}`}
            onClick={() => handlePlayClick(level.path, level.backgroundImage, level.id)}
            style={{
              backgroundImage: `url(${level.backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              border: "none",
              cursor: level.id > progress ? 'not-allowed' : 'pointer',
              opacity: level.id > progress ? 0.5 : 1, // Dim locked levels
            }}
          >
            
            <div className="overlay">
              {level.id > progress ? (
                <span className="locked-text">Locked</span>
              ) : (
                <button className="play-button">Play</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal for no hearts */}
      {showNoHeartsModal && (
        <div className="modal-overlay">
          <div className="modal-content no-hearts-modal">
            <div className="modal-header">
              <h2>Out of Hearts</h2>
              <button 
                className="close-button" 
                onClick={() => setShowNoHeartsModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="hearts-empty-container">
                <FaHeart className="heart-icon-large" />
                <span className="hearts-empty-text">0</span>
              </div>
              <p>You don't have any hearts left!</p>
              <p>Visit the store to get more hearts and continue playing.</p>
            </div>
            <div className="modal-footer">
              <button 
                className="store-button"
                onClick={() => {
                  setShowNoHeartsModal(false);
                  navigate('/store');
                }}
              >
                Go to Store
              </button>
              <button 
                className="cancel-button"
                onClick={() => setShowNoHeartsModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tutorial Modal */}
      {isTutorialOpen && (
        <div className="tutorial-modal">
            <div className="tutorial-content">
                <div className="tutorial-header">
                    <h1>{tutorialPages[tutorialPage].title}</h1>
                    <button className="close-btn" onClick={closeTutorial}>
                        X
                    </button>
                </div>
                <div className="tutorial-body">
                    {tutorialPages[tutorialPage].content}
                </div>
                <div className="tutorial-navigation">
                    <button
                        className="previous-btn"
                        onClick={handlePrevious}
                        disabled={tutorialPage === 0}
                    >
                        Previous
                    </button>
                    <button
                        className="next-btn"
                        onClick={handleNext}
                        disabled={tutorialPage === tutorialPages.length - 1}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    )}
    </div>
  );
}
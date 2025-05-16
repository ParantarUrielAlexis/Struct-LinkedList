import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa'; // Import heart icon
import selectionLogo from '../../assets/selection/selection_sort.png';
import insertionLogo from '../../assets/insertion/insertion_sort.png';
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
      </div>
      
      <div className="level-grid">
        
        {levels.map((level) => (
          <div
            key={level.id}
            className={`level-card ${level.id > progress ? 'locked' : ''}`}
            onClick={() => handlePlayClick(level.path, level.backgroundImage, level.id)}
            style={{
              backgroundImage: `url(${level.backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
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
    </div>
  );
}
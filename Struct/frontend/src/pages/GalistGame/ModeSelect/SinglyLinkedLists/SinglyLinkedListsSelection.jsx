import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SinglyLinkedListsSelection.module.css";

const levelsPage1 = [
  { level: 1, title: "Creating Node" },
  { level: 2, title: "Linking Nodes" },
  { level: 3, title: "Insertion of Nodes" },
];

const levelsPage2 = [
  { level: 4, title: "Deletion of Node" },
  { level: 5, title: "Abtract Data Types" },
];

function SinglyLinkedListsSelection({ onSelect }) {
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hearts, setHearts] = useState(0);
  const [heartLoading, setHeartLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check authentication and get hearts on component mount
  useEffect(() => {
    const checkAuthAndGetHearts = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        setIsAuthenticated(true);
        await getUserHearts();
      }
    };
    
    checkAuthAndGetHearts();
  }, []);

  const getUserHearts = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const API_BASE_URL = 'http://localhost:8000';
      const response = await fetch(`${API_BASE_URL}/api/user/hearts/`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setHearts(data.hearts || 0);
      }
    } catch (error) {
      console.error("Error fetching hearts:", error);
    }
  };

  const consumeHeart = async () => {
    if (!isAuthenticated) return true; // Allow non-authenticated users to play
    
    if (hearts <= 0) {
      return false; // Not enough hearts
    }
    
    try {
      setHeartLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) return false;
      
      const API_BASE_URL = 'http://localhost:8000';
      const response = await fetch(
        `${API_BASE_URL}/api/user/hearts/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            action: 'consume'
          })
        }
      );
      
      if (!response.ok) {
        console.error("Failed to consume heart:", response.status);
        return false;
      }
      
      const data = await response.json();
      
      // Update local state immediately for better UX
      setHearts(prevHearts => Math.max(0, prevHearts - 1));
      
      // Update with server response if available
      if (data.hearts !== undefined) {
        setHearts(data.hearts);
      }
      
      return true;
    } catch (error) {
      console.error("Error consuming heart:", error);
      return false;
    } finally {
      setHeartLoading(false);
    }
  };

  const handleLevelSelect = async (lvl) => {
    if (isLoading || heartLoading) return; // Prevent multiple clicks
    
    setIsLoading(true);
    
    try {
      // Check hearts and consume if authenticated
      if (isAuthenticated) {
        if (hearts <= 0) {
          alert("You don't have enough hearts to play! Wait for hearts to regenerate or purchase more.");
          return;
        }

        // Show loading state while consuming heart
        setHeartLoading(true);
        
        try {
          // Consume a heart before starting the level
          const heartConsumed = await consumeHeart();
          if (!heartConsumed) {
            alert("Failed to consume heart. Please try again.");
            return;
          }
        } catch (error) {
          console.error("Error consuming heart:", error);
          alert("Failed to consume heart. Please try again.");
          return;
        } finally {
          setHeartLoading(false);
        }
      }

      // Proceed with navigation after heart is successfully consumed (or if not authenticated)
      if (lvl.level === 4) {
        navigate("/galist-game-deletion");
      } else if (lvl.level === 1) {
        navigate("/galist-game-node-creation");
      } else if (lvl.level === 2) {
        navigate("/galist-game-linking-node");
      } else if (lvl.level === 3) {
        navigate("/galist-game-insertion-node");
      } else if (lvl.level === 5) {
        navigate("/galist-game-abstract-data-type");
      } else {
        if (onSelect) onSelect(lvl.level);
        // You can add navigation for other levels here if needed
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.selectionContainer} role="dialog" aria-modal="true">
      <video
        className={styles.modeVideo}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src="./video/space.mp4" type="video/mp4" />
      </video>

      <div className={styles.modeContent}>
        <h2 className={styles.title}>Singly Linked Lists</h2>
        {isAuthenticated && (
          <div className={styles.heartsDisplay}>
            Hearts: {hearts} {heartLoading && "(Loading...)"}
          </div>
        )}
        <div className={styles.levelsRow}>
          {(page === 1 ? levelsPage1 : levelsPage2).map((lvl) => (
            <button
              key={lvl.level}
              className={styles.levelCard}
              onClick={() => handleLevelSelect(lvl)}
              disabled={isLoading || heartLoading}
              tabIndex={0}
              aria-label={`Go to Level ${lvl.level}`}
              style={{ opacity: (isLoading || heartLoading) ? 0.6 : 1 }}
            >
              <div className={styles.levelNumber}>Level {lvl.level}</div>
              <div className={styles.levelTitle}>{lvl.title}</div>
              {(isLoading || heartLoading) && <div className={styles.loadingIndicator}>...</div>}
            </button>
          ))}
        </div>
        <div className={styles.arrowRow}>
          {page === 2 && (
            <button
              className={styles.arrowBtn}
              onClick={() => setPage(1)}
              disabled={isLoading || heartLoading}
              aria-label="Previous"
            >
              &#8592;
            </button>
          )}
          {page === 1 && (
            <button
              className={styles.arrowBtn}
              onClick={() => setPage(2)}
              disabled={isLoading || heartLoading}
              aria-label="Next"
            >
              &#8594;
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

SinglyLinkedListsSelection.propTypes = {
  onSelect: PropTypes.func,
};

export default SinglyLinkedListsSelection;
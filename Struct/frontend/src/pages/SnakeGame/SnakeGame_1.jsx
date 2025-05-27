import React, { Component } from "react";
import "./SnakeGame.css";

// Import your images
import appleImg from "../../assets/snakegame/images/apple.png";
import headUpImg from "../../assets/snakegame/images/head_up.png";
import headDownImg from "../../assets/snakegame/images/head_down.png";
import headLeftImg from "../../assets/snakegame/images/head_left.png";
import headRightImg from "../../assets/snakegame/images/head_right.png";
import tailUpImg from "../../assets/snakegame/images/tail_up.png";
import tailDownImg from "../../assets/snakegame/images/tail_down.png";
import tailLeftImg from "../../assets/snakegame/images/tail_left.png";
import tailRightImg from "../../assets/snakegame/images/tail_right.png";
import bodyHorizontalImg from "../../assets/snakegame/images/body_horizontal.png";
import bodyVerticalImg from "../../assets/snakegame/images/body_vertical.png";
import bodyTLImg from "../../assets/snakegame/images/body_tl.png";
import bodyTRImg from "../../assets/snakegame/images/body_tr.png";
import bodyBLImg from "../../assets/snakegame/images/body_bl.png";
import bodyBRImg from "../../assets/snakegame/images/body_br.png";
import crunchSound from "../../assets/snakegame/sounds/crunch.mp3";
import backgroundMusic from "../../assets/snakegame/sounds/background.mp3";
import headEatImg from "../../assets/snakegame/images/head_eat.png";

// Constants
const GRID_SIZE = 20;
const CELL_SIZE = 30;
const GAME_SPEED = 150;

// Star scoring thresholds
const STAR_THRESHOLDS = {
  1: 10, // 1 star at 10 score
  2: 20, // 2 stars at 20 score
  3: 30, // 3 stars at 30 score
};

const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
};

// Asset paths
const ASSETS = {
  IMAGES: {
    FOOD: appleImg,
    HEAD: {
      UP: headUpImg,
      DOWN: headDownImg,
      LEFT: headLeftImg,
      RIGHT: headRightImg,
      EAT: headEatImg,
    },
    TAIL: {
      UP: tailUpImg,
      DOWN: tailDownImg,
      LEFT: tailLeftImg,
      RIGHT: tailRightImg,
    },
    BODY: {
      HORIZONTAL: bodyHorizontalImg,
      VERTICAL: bodyVerticalImg,
      TOP_LEFT: bodyTLImg,
      TOP_RIGHT: bodyTRImg,
      BOTTOM_LEFT: bodyBLImg,
      BOTTOM_RIGHT: bodyBRImg,
    },
  },
  SOUNDS: {
    CRUNCH: crunchSound,
    BACKGROUND: backgroundMusic,
  },
};

class SnakeGame extends Component {
  constructor(props) {
    super(props);
    
    // Get level from props (passed from routing or parent component)
    const currentLevel = this.props.level || 1;
    
    this.state = {
      snake: [
        { x: 5, y: 10 },
        { x: 4, y: 10 },
        { x: 3, y: 10 },
      ],
      food: this.generateFood(),
      direction: DIRECTIONS.RIGHT,
      gameOver: false,
      score: 0,
      highScore: 0,
      isPaused: false,
      audioReady: false,
      lastUpdateTime: 0,
      accumulatedTime: 0,
      gameStarted: false,
      musicPlaying: false,
      isEating: false,
      currentLevel: currentLevel,
      stars: 0,
      showStarResult: false,
    };

    this.nextDirection = DIRECTIONS.RIGHT;
    this.animationFrameId = null;
    this.crunchAudio = null;
    this.backgroundAudio = null;
    this.gameBoardRef = React.createRef();
    this.eatingAnimationTimeout = null;
    this.initializeHighScore(currentLevel);
  }
  // Add this method to the SnakeGame class
fetchHighScoreFromAPI = async () => {
  try {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) return this.getHighScoreForLevel(this.state.currentLevel);

    const response = await fetch(
      "http://localhost:8000/api/snake-progress/me/best/",
      {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      }
    );

    if (!response.ok) return this.getHighScoreForLevel(this.state.currentLevel);

    const data = await response.json();
    const scores = data.reduce((acc, record) => {
      if (!acc[record.level] || record.score > acc[record.level]) {
        acc[record.level] = record.score;
      }
      return acc;
    }, {});

    return scores[this.state.currentLevel] || 0;
  } catch (error) {
    return this.getHighScoreForLevel(this.state.currentLevel);
  }
};

initializeHighScore = async (level) => {
  const highScore = await this.getHighScoreForLevel(level);
  this.setState({ highScore });
};
  // Get high score for specific level from the unified progress structure
  getHighScoreForLevel = async (level) => {
  // Check backend first if authenticated
  const authToken = localStorage.getItem("authToken");
  if (authToken) {
    const apiScore = await this.fetchHighScoreFromAPI();
    if (apiScore > 0) return apiScore;
  }

  // Fallback to localStorage
  try {
    const savedProgress = localStorage.getItem('snakeGameProgress');
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      return progress.scores?.[level] || 0;
    }
  } catch (error) {
    console.error("Error reading progress:", error);
  }
  
  return localStorage.getItem(`snakeHighScore_level_${level}`) || 0;
};

  // Calculate stars based on score
  calculateStars = (score) => {
    if (score >= STAR_THRESHOLDS[3]) return 3;
    if (score >= STAR_THRESHOLDS[2]) return 2;
    if (score >= STAR_THRESHOLDS[1]) return 1;
    return 0;
  };

  // Get or create the progress structure
  getProgressStructure = () => {
    try {
      const savedProgress = localStorage.getItem('snakeGameProgress');
      if (savedProgress) {
        return JSON.parse(savedProgress);
      }
    } catch (error) {
      console.error("Error parsing progress:", error);
    }
    
    // Return default structure
    return {
      unlockedLevels: [1],
      stars: {},
      scores: {},
      attempts: {},
      completedLevels: []
    };
  };

  // Save progress to localStorage 
  saveProgressToLocalStorage = (level, score, stars, gameCompleted = false) => {
    try {
      const currentProgress = this.getProgressStructure();
      
      // Only update if this is better than existing progress
      const currentStars = currentProgress.stars[level] || 0;
      const currentScore = currentProgress.scores[level] || 0;
      
      if (stars > currentStars || (stars === currentStars && score > currentScore)) {
        currentProgress.stars[level] = stars;
        currentProgress.scores[level] = score;
        
        // Update attempts count
        currentProgress.attempts[level] = (currentProgress.attempts[level] || 0) + 1;
        
        // Mark as completed if game finished successfully
        if (gameCompleted && !currentProgress.completedLevels.includes(level)) {
          currentProgress.completedLevels.push(level);
        }
        
        // Calculate unlocked levels based on stars
        currentProgress.unlockedLevels = this.calculateUnlockedLevels(currentProgress);
        
        localStorage.setItem('snakeGameProgress', JSON.stringify(currentProgress));
        
        console.log(`Progress saved: Level ${level}, Score ${score}, Stars ${stars}`);
        console.log('Updated progress:', currentProgress);
      }
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

    // Calculate which levels should be unlocked (same logic as LevelSelect)
    calculateUnlockedLevels = (progress) => {
    const unlockedLevels = [1]; // Level 1 is always unlocked
    const stars = progress.stars || {};
    
    // Level unlock requirements (same as in LevelSelect)
    const LEVEL_REQUIREMENTS = {
      1: 0,
      2: 1, // Level 2: Requires 1 star from Level 1
      3: 1, // Level 3: Requires 1 star from Level 2  
      4: 2, // Level 4: Requires 2 stars from Level 3
      5: 2  // Level 5: Requires 2 stars from Level 4
    };

    for (let level = 2; level <= 5; level++) {
      const previousLevel = level - 1;
      const starsEarnedInPreviousLevel = stars[previousLevel] || 0;
      const starsRequiredForThisLevel = LEVEL_REQUIREMENTS[level] || 1;

      if (starsEarnedInPreviousLevel >= starsRequiredForThisLevel) {
        unlockedLevels.push(level);
      }
    }

    // Return the complete progress object with updated unlockedLevels
    return {
      ...progress,
      unlockedLevels
    };
};

// Report progress to backend database (only when game ends)
reportProgress = async (level, score, stars, foodEaten, timeSurvived, gameCompleted) => {
  try {
    // Always save to localStorage as backup/fallback
    this.saveProgressToLocalStorage(level, score, stars, gameCompleted);
    
    // Check if user is authenticated before calling API
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      console.log("User not authenticated, progress saved to localStorage only");
      // Still dispatch event for non-authenticated users to update UI
      window.dispatchEvent(new CustomEvent('snakeGameProgress', {
        detail: { level, score, stars, foodEaten, timeSurvived, gameCompleted }
      }));
      return;
    }

    // Only save to backend when game actually ends (collision or completion)
    // Don't spam the API during gameplay for every food eaten
    if (!gameCompleted) {
      console.log("Game not completed yet, skipping backend save");
      // Just dispatch event for UI updates during gameplay
      window.dispatchEvent(new CustomEvent('snakeGameProgress', {
        detail: { level, score, stars, foodEaten, timeSurvived, gameCompleted }
      }));
      return;
    }

    console.log("Saving game completion to backend:", {
      level, score, stars, foodEaten, timeSurvived, gameCompleted
    });

    // Save to Django backend when game ends
    const response = await fetch("http://localhost:8000/api/snake-progress/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${authToken}`,
      },
      body: JSON.stringify({
        level: level,
        score: score,
        food_eaten: foodEaten,
        time_survived: timeSurvived,
        game_completed: gameCompleted,
        stars_earned: stars
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to save progress to backend:", response.status, errorData);
      console.error("Request body was:", {
        level, score, food_eaten: foodEaten, time_survived: timeSurvived, 
        game_completed: gameCompleted, stars_earned: stars
      });
      throw new Error(`Backend save failed: ${response.status}`);
    }

    const responseData = await response.json();
    console.log("Progress saved successfully to backend:", responseData);
    
    // Dispatch custom event for LevelSelect component to refresh
    window.dispatchEvent(new CustomEvent('snakeGameProgress', {
      detail: { level, score, stars, foodEaten, timeSurvived, gameCompleted }
    }));
    
    // Callback prop (if passed from parent)
    if (this.props.onLevelComplete) {
      this.props.onLevelComplete(level, score, stars);
    }

  } catch (error) {
    console.error("Error saving progress:", error);
    
    // Even if backend fails, dispatch event so localStorage data can be used
    window.dispatchEvent(new CustomEvent('snakeGameProgress', {
      detail: { level, score, stars, foodEaten, timeSurvived, gameCompleted }
    }));
    
    // Callback prop (if passed from parent)
    if (this.props.onLevelComplete) {
      this.props.onLevelComplete(level, score, stars);
    }
  }
};

  getArrayRepresentation = () => {
    const { snake, food } = this.state;
    const grid = Array(GRID_SIZE)
      .fill()
      .map(() => Array(GRID_SIZE).fill(0));

    // Mark food position
    grid[food.y][food.x] = 2;

    // Mark snake positions (body = 3, head = 1)
    snake.forEach((segment, index) => {
      if (index === 0) {
        grid[segment.y][segment.x] = 1; // Head
      } else {
        grid[segment.y][segment.x] = 3; // Body
      }
    });

    return grid;
  };

  generateFood = (snake = []) => {
    const food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };

    const isOnSnake = snake.some(
      (segment) => segment.x === food.x && segment.y === food.y
    );
    if (isOnSnake) return this.generateFood(snake);

    return food;
  };

  checkCollision = (position, snake) => {
    return (
      position.x < 0 ||
      position.x >= GRID_SIZE ||
      position.y < 0 ||
      position.y >= GRID_SIZE ||
      snake.some(
        (segment) => segment.x === position.x && segment.y === position.y
      )
    );
  };

  componentDidMount() {
    document.addEventListener("click", this.handleFirstInteraction);
    window.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.handleFirstInteraction);
    window.removeEventListener("keydown", this.handleKeyDown);
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.crunchAudio) {
      this.crunchAudio.pause();
    }
    if (this.backgroundAudio) {
      this.backgroundAudio.pause();
    }
  }

  handleFirstInteraction = () => {
    this.crunchAudio = new Audio(ASSETS.SOUNDS.CRUNCH);
    this.backgroundAudio = new Audio(ASSETS.SOUNDS.BACKGROUND);
    this.backgroundAudio.loop = true;
    this.backgroundAudio.volume = 0.3;

    this.setState({ audioReady: true }, () => {
      if (this.gameBoardRef.current) {
        this.gameBoardRef.current.focus();
      }
    });
    document.removeEventListener("click", this.handleFirstInteraction);
  };

  startGame = () => {
    this.setState(
      {
        gameStarted: true,
        musicPlaying: true,
      },
      () => {
        this.startTime = Date.now();  // Track game start time
        this.backgroundAudio
          .play()
          .catch((e) => console.log("Background music error:", e));
        this.startGameLoop();
      }
    );
  };

  startGameLoop = () => {
    this.setState({
      lastUpdateTime: performance.now(),
      accumulatedTime: 0,
    });
    this.animationFrameId = requestAnimationFrame(this.gameLoop);
  };

  gameLoop = (currentTime) => {
    // Stop the loop completely if paused
    if (
      this.state.isPaused ||
      !this.state.audioReady ||
      !this.state.gameStarted ||
      this.state.gameOver
    ) {
      this.setState({ lastUpdateTime: currentTime });
      this.animationFrameId = requestAnimationFrame(this.gameLoop);
      return;
    }

    const timeDelta = currentTime - (this.state.lastUpdateTime || currentTime);
    const newAccumulatedTime = this.state.accumulatedTime + timeDelta;
    const frameDuration = GAME_SPEED;

    // Only allow one update per frame maximum to keep controls responsive
    if (newAccumulatedTime >= frameDuration) {
      this.moveSnake();
      this.setState({
        lastUpdateTime: currentTime,
        accumulatedTime: newAccumulatedTime - frameDuration,
      });
    } else {
      this.setState({
        lastUpdateTime: currentTime,
        accumulatedTime: newAccumulatedTime,
      });
    }

    this.animationFrameId = requestAnimationFrame(this.gameLoop);
  };

  // Update moveSnake method
  moveSnake = () => {
  if (
    this.state.isPaused ||
    !this.state.audioReady ||
    !this.state.gameStarted ||
    this.state.gameOver
  ) {
    return;
  }

  this.setState((prevState) => {
    const { snake, direction, food, score, highScore, currentLevel } = prevState;
    const head = { ...snake[0] };
    const currentDirection = this.nextDirection;
    const now = Date.now();

    // Calculate time survived in seconds
    const timeSurvived = Math.floor((now - this.startTime) / 1000);

    head.x += currentDirection.x;
    head.y += currentDirection.y;

    // Check for collision (GAME OVER)
    if (this.checkCollision(head, snake)) {
      cancelAnimationFrame(this.animationFrameId);
      
      // Calculate stars and save progress
      const stars = this.calculateStars(score);
      const newHighScore = Math.max(score, highScore);
      
      // Report progress ONLY when game ends with collision
      this.reportProgress(
        currentLevel,
        score,
        stars,
        score,       // foodEaten = score (1 food = 1 point)
        timeSurvived,
        true         // gameCompleted = true (game ended)
      );

      return {
        ...prevState,
        gameOver: true,
        highScore: newHighScore,
        musicPlaying: false,
        stars: stars,
        showStarResult: true,
      };
    }

    const newSnake = [head, ...snake];

    // Check for food collision
    if (head.x === food.x && head.y === food.y) {
      try {
        this.crunchAudio.currentTime = 0;
        this.crunchAudio.play().catch((e) => console.log("Audio play failed:", e));
      } catch (e) {
        console.error("Audio error:", e);
      }

      if (this.eatingAnimationTimeout) {
        clearTimeout(this.eatingAnimationTimeout);
      }

      this.setState({ isEating: true });
      this.eatingAnimationTimeout = setTimeout(() => {
        this.setState({ isEating: false });
      }, 300);

      const newScore = prevState.score + 1;
      const stars = this.calculateStars(newScore);

      // DON'T report progress here - only save locally and update UI
      // We only want to save to backend when game actually ends

      return {
        ...prevState,
        snake: newSnake,
        food: this.generateFood(newSnake),
        score: newScore,
        direction: currentDirection,
        isEating: true,
        stars: stars,
        highScore: Math.max(newScore, highScore), // Update high score immediately
      };
    }

    return {
      ...prevState,
      snake: newSnake.slice(0, -1),
      direction: currentDirection,
    };
  });
};

  handleKeyDown = (e) => {
    if (
      ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)
    ) {
      e.preventDefault();
    }

    if (
      !this.state.gameStarted &&
      ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)
    ) {
      this.startGame();
      return;
    }

    if (DIRECTIONS[e.key]) {
      const { direction } = this.state;
      // Only allow 90-degree turns (no reversing)
      if (
        direction.x !== -DIRECTIONS[e.key].x ||
        direction.y !== -DIRECTIONS[e.key].y
      ) {
        this.nextDirection = DIRECTIONS[e.key];
      }
    } else if (e.key === " ") {
      this.togglePause();
    }
  };

  resetGame = () => {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    // Clear any eating animation timeout
    if (this.eatingAnimationTimeout) {
      clearTimeout(this.eatingAnimationTimeout);
    }

    this.setState({
      snake: [
        { x: 5, y: 10 },
        { x: 4, y: 10 },
        { x: 3, y: 10 },
      ],
      direction: DIRECTIONS.RIGHT,
      food: this.generateFood(),
      gameOver: false,
      score: 0,
      isPaused: false,
      gameStarted: false,
      isEating: false,
      stars: 0,
      showStarResult: false,
      highScore: 0
    });
    this.nextDirection = DIRECTIONS.RIGHT;
    this.initializeHighScore(this.state.currentLevel);
    // Focus the game board again after reset
    if (this.gameBoardRef.current) {
      this.gameBoardRef.current.focus();
    }
  };

  togglePause = () => {
    if (this.state.gameOver) return;

    this.setState((prevState) => {
      const newPauseState = !prevState.isPaused;
      if (this.backgroundAudio) {
        if (newPauseState) {
          this.backgroundAudio.pause();
        } else {
          this.backgroundAudio
            .play()
            .catch((e) => console.log("Background music error:", e));
        }
      }
      return {
        isPaused: newPauseState,
        musicPlaying: !newPauseState,
      };
    });
  };

  toggleMusic = () => {
    this.setState((prevState) => {
      const newMusicState = !prevState.musicPlaying;
      if (this.backgroundAudio) {
        if (newMusicState) {
          this.backgroundAudio
            .play()
            .catch((e) => console.log("Background music error:", e));
        } else {
          this.backgroundAudio.pause();
        }
      }
      return { musicPlaying: newMusicState };
    });
  };

  // Navigate back to level select
  goBackToLevelSelect = () => {
    window.location.href = '/snake-game'; // Adjust this path as needed
  };

  getSegmentImage = (segment, index, segments) => {
    const isHead = index === 0;
    const isTail = index === segments.length - 1;

    if (isHead) {
      const nextSegment = segments[1];
      if (segment.x < nextSegment.x) return ASSETS.IMAGES.HEAD.LEFT;
      if (segment.x > nextSegment.x) return ASSETS.IMAGES.HEAD.RIGHT;
      if (segment.y < nextSegment.y) return ASSETS.IMAGES.HEAD.UP;
      return ASSETS.IMAGES.HEAD.DOWN;
    }

    if (isTail) {
      const prevSegment = segments[index - 1];
      if (segment.x < prevSegment.x) return ASSETS.IMAGES.TAIL.LEFT;
      if (segment.x > prevSegment.x) return ASSETS.IMAGES.TAIL.RIGHT;
      if (segment.y < prevSegment.y) return ASSETS.IMAGES.TAIL.UP;
      return ASSETS.IMAGES.TAIL.DOWN;
    }

    const prevSegment = segments[index - 1];
    const nextSegment = segments[index + 1];

    // Horizontal segment
    if (prevSegment.x !== nextSegment.x && prevSegment.y === nextSegment.y) {
      return ASSETS.IMAGES.BODY.HORIZONTAL;
    }

    // Vertical segment
    if (prevSegment.y !== nextSegment.y && prevSegment.x === nextSegment.x) {
      return ASSETS.IMAGES.BODY.VERTICAL;
    }

    // Corner pieces - need to determine the turn direction
    if (prevSegment.x < segment.x) {
      if (nextSegment.y < segment.y) {
        return ASSETS.IMAGES.BODY.TOP_LEFT;
      } else {
        return ASSETS.IMAGES.BODY.BOTTOM_LEFT;
      }
    } else if (prevSegment.x > segment.x) {
      if (nextSegment.y < segment.y) {
        return ASSETS.IMAGES.BODY.TOP_RIGHT;
      } else {
        return ASSETS.IMAGES.BODY.BOTTOM_RIGHT;
      }
    } else if (prevSegment.y < segment.y) {
      if (nextSegment.x < segment.x) {
        return ASSETS.IMAGES.BODY.TOP_LEFT;
      } else {
        return ASSETS.IMAGES.BODY.TOP_RIGHT;
      }
    } else {
      if (nextSegment.x < segment.x) {
        return ASSETS.IMAGES.BODY.BOTTOM_LEFT;
      } else {
        return ASSETS.IMAGES.BODY.BOTTOM_RIGHT;
      }
    }
  };

  render() {
    const {
      snake,
      food,
      gameOver,
      score,
      highScore,
      isPaused,
      audioReady,
      gameStarted,
      musicPlaying,
      currentLevel,
      stars,
      showStarResult,
    } = this.state;

    if (!audioReady) {
      return (
        <div className="audio-permission-screen">
          <h1>Snake Game</h1>
          <p>Click anywhere to start the game</p>
        </div>
      );
    }

    return (
      <div className="snake-game-container pixel-container">
        <div className="game-header">
          {/* <h1 className="game-title pixel-text" style={{ 
            color: '#4CFF50',
            textShadow: '2px 2px 0px rgba(0,0,0,0.8)',
            fontSize: '1.5rem'
          }}>SNAKE GAME - LEVEL {currentLevel}</h1> */}
          <h1 className="game-title pixel-text" style={{ 
        textShadow: '2px 2px 0px rgba(0,0,0,0.8)',
        fontSize: '1.5rem' // Reduced from 2.5rem
      }}>SNAKE GAME</h1>
          <div className="score-display">
            <div className="score-container current-score pixel-border" style={{ 
              backgroundColor: 'rgba(0,0,0,0.7)',
              padding: '6px 12px'
            }}>
              <span className="score-label pixel-text" style={{ color: '#8BFF4A' }}>SCORE:</span>
              <span className="score-value pixel-text" style={{ color: '#4CFF50' }}>{score}</span>
            </div>
            <div className="score-container high-score pixel-border" style={{ 
              backgroundColor: 'rgba(0,0,0,0.7)',
              padding: '6px 12px'
            }}>
              <span className="score-label pixel-text" style={{ color: '#8BFF4A' }}>HIGH SCORE:</span>
              <span className="score-value pixel-text" style={{ color: '#4CFF50' }}>{highScore}</span>
            </div>
            {/* Star display */}
            <div className="star-display pixel-border" style={{ 
              backgroundColor: 'rgba(0,0,0,0.7)',
              padding: '6px 12px'
            }}>
              <span className="score-label pixel-text" style={{ color: '#8BFF4A' }}>STARS:</span>
              <div className="stars-container" style={{ display: 'inline-flex', gap: '2px', marginLeft: '4px' }}>
                {[1, 2, 3].map((starNum) => (
                  starNum <= stars && (
                    <span key={starNum} style={{ 
                      color: '#FFD700',
                      fontSize: '16px'
                    }}>⭐</span>
                  )
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="game-content-wrapper">
          {/* Game Board */}
          <div
            ref={this.gameBoardRef}
            className={`game-board ${!gameStarted ? "waiting-start" : ""} pixel-border`}
            style={{ backgroundColor: '#0a2f0a' }}
            tabIndex="0"
            onKeyDown={this.handleKeyDown}
          >
            {/* Grid pattern */}
            <div className="grid-pattern"></div>

            {/* Food with animation */}
            <div className="food-container" style={{
              left: `${food.x * CELL_SIZE}px`,
              top: `${food.y * CELL_SIZE}px`,
            }}>
              <img src={ASSETS.IMAGES.FOOD} className="food" alt="Food" />
            </div>

            {/* Snake */}
            {snake.map((segment, index) => (
              <div
                key={`${segment.x}-${segment.y}-${index}`}
                className={`snake-segment ${
                  index === 0
                    ? "head"
                    : index === snake.length - 1
                    ? "tail"
                    : "body"
                } ${this.state.isEating && index === 0 ? "eating" : ""}`}
                style={{
                  left: `${segment.x * CELL_SIZE}px`,
                  top: `${segment.y * CELL_SIZE}px`,
                  zIndex: index === 0 ? 3 : index === snake.length - 1 ? 1 : 2,
                }}
              >
                <img
                  src={this.getSegmentImage(segment, index, snake)}
                  alt={
                    index === 0
                      ? "Snake head"
                      : index === snake.length - 1
                      ? "Snake tail"
                      : "Snake body"
                  }
                />
              </div>
            ))}

            {/* Overlays */}
            {!gameStarted && !gameOver && (
              <div className="start-screen-overlay">
                <div className="start-screen-message pixel-border" style={{ backgroundColor: '#0a2f0a' }}>
                  <h2 className="pixel-text" style={{ color: '#4CFF50' }}>READY PLAYER?</h2>
                  <p className="pixel-text" style={{ color: '#8BFF4A' }}>LEVEL {currentLevel}</p>
                  <p className="pixel-text" style={{ color: '#8BFF4A', fontSize: '0.8rem', margin: '10px 0' }}>
                    ⭐ 10 points = 1 star<br/>
                    ⭐⭐ 20 points = 2 stars<br/>
                    ⭐⭐⭐ 30 points = 3 stars
                  </p>
                  <p className="pixel-text" style={{ color: '#8BFF4A' }}>USE ARROW KEYS</p>
                  <button className="pixel-btn" onClick={this.startGame}>
                    START GAME
                  </button>
                </div>
              </div>
            )}

            {gameOver && (
              <div className="game-over-overlay">
                <div className="game-over-message pixel-border" style={{ backgroundColor: '#0a2f0a' }}>
                  <h2 className="pixel-text" style={{ color: '#FF4444' }}>GAME OVER!</h2>
                  <p className="pixel-text" style={{ color: '#8BFF4A' }}>SCORE: {score}</p>
                  {showStarResult && (
                    <div className="star-result" style={{ margin: '15px 0' }}>
                      <p className="pixel-text" style={{ color: '#FFD700', fontSize: '1.2rem' }}>
                        {stars > 0 ? `${stars} STAR${stars > 1 ? 'S' : ''} EARNED!` : 'NO STARS EARNED'}
                      </p>
                      <div className="stars-display" style={{ fontSize: '24px', margin: '10px 0' }}>
                        {[1, 2, 3].map((starNum) => (
                          starNum <= stars && (
                            <span key={starNum} style={{ 
                              color: '#FFD700',
                              margin: '0 2px'
                            }}>⭐</span>
                          )
                        ))}
                      </div>
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button className="pixel-btn" onClick={this.resetGame}>
                      PLAY AGAIN
                    </button>
                    <button className="pixel-btn" onClick={this.goBackToLevelSelect}>
                      LEVEL SELECT
                    </button>
                  </div>
                </div>
              </div>
            )}

            {isPaused && (
              <div className="pause-overlay">
                <div className="pause-message pixel-border" style={{ backgroundColor: '#0a2f0a' }}>
                  <h2 className="pixel-text" style={{ color: '#4CFF50' }}>GAME PAUSED</h2>
                  <button className="pixel-btn" onClick={this.togglePause}>
                    RESUME
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Array Side Panel */}
          <div className="array-side-panel pixel-border" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
            <h3 className="pixel-text" style={{ color: '#4CFF50' }}>GAME ARRAY</h3>
            <div className="array-grid">
              {this.getArrayRepresentation().map((row, y) => (
                <div key={y} className="array-row">
                  {row.map((cell, x) => (
                    <div
                      key={`${x}-${y}`}
                      className={`array-cell pixel-text ${
                        cell === 1 ? "head" :
                        cell === 2 ? "food" :
                        cell === 3 ? "body" : ""
                      }`}
                      style={{ fontSize: '0.7rem' }}
                    >
                      {cell}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="array-legend">
              {[
                { class: "head", label: "HEAD (1)" },
                { class: "food", label: "FOOD (2)" },
                { class: "body", label: "BODY (3)" },
                { class: "", label: "EMPTY (0)" }
              ].map((item, index) => (
                <div key={index} className="legend-item pixel-text" style={{ fontSize: '0.7rem' }}>
                  <span className={`legend-color ${item.class}`}></span> {item.label}
                </div>
              ))}
            </div>
            
            {/* Star progress tracker */}
            <div className="star-progress" style={{ marginTop: '15px', padding: '10px', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '5px' }}>
              <h4 className="pixel-text" style={{ color: '#4CFF50', fontSize: '0.8rem', marginBottom: '8px' }}>STAR PROGRESS</h4>
              {[1, 2, 3].map((starLevel) => (
                <div key={starLevel} className="progress-line pixel-text" style={{ 
                  fontSize: '0.6rem', 
                  color: score >= STAR_THRESHOLDS[starLevel] ? '#FFD700' : '#8BFF4A',
                  marginBottom: '2px'
                }}>
                  ⭐ {STAR_THRESHOLDS[starLevel]} pts {score >= STAR_THRESHOLDS[starLevel] ? '✓' : ''}
                </div>
              ))}
            </div>
          </div>
        </div>

    {/* Controls */}
    <div className="controls-container">
      <div className="action-controls">
        {gameStarted && !gameOver && (
          <button className="pixel-btn" onClick={this.togglePause} 
            style={{ fontSize: '0.8rem' }}> {/* Added font size */}
            {isPaused ? "RESUME" : "PAUSE"}
          </button>
        )}

        <button className="pixel-btn" onClick={this.resetGame}
          style={{ fontSize: '0.8rem' }}> {/* Added font size */}
          {gameStarted ? "RESET" : "NEW GAME"}
        </button>
        <button
          className={`pixel-btn ${musicPlaying ? "on" : "off"}`}
          onClick={this.toggleMusic}
          style={{ width: '60px', padding: '8px' }}
        >
          {musicPlaying ? "🔊" : "🔇"}
        </button>
      </div>
    </div>

    {/* Instructions */}
    <div className="instructions pixel-text" style={{ 
      backgroundColor: 'rgba(0,0,0,0.7)',
      borderRadius: '8px',
      color: '#8BFF4A',
      fontSize: '0.7rem', // Reduced from 0.9rem
      lineHeight: '1.2', // Tighter line spacing
      padding: '10px'
    }}>
      <p>USE ARROW KEYS TO CONTROL</p>
      <p>EAT APPLES TO GROW LONGER</p>
      <p>AVOID WALLS AND YOURSELF!</p>
    </div>
  </div>
);
  }
}

export default SnakeGame;
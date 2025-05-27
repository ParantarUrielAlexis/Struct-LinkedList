import React, { Component } from "react";
import "./SnakeGame2.css";
import "./SnakeGame.css";
import "./LevelSelect.css";
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
import levelselectBG from "../../assets/snakegame/gif/levelselect_bg.gif";
// Removed headEatImg import

// Constants
const GRID_SIZE = 20;
const CELL_SIZE = 30;
const GAME_SPEED = 150;
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
      // Removed EAT property
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
    // Level 2
    const currentLevel = 2;
    const initialSnake = [
      { x: 5, y: 10 },
      { x: 4, y: 10 },
      { x: 3, y: 10 },
    ];
    
    this.state = {
      snake: initialSnake,
      collectedEvens: [],
      foods: [],
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
      snakeSegmentValues: [], // This will store the values for each snake segment
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
    this.foodTimeouts = [];
    this.foodGenerationTimer = null;
    this.initializeHighScore(currentLevel);
  }
  // Get high score for specific level from the unified progress structure
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
      unlockedLevels: [2],
      stars: {},
      scores: {},
      attempts: {},
      completedLevels: []
    };
  };

  // Save progress to localStorage in the correct format
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
  
  // Level unlock requirements (make sure this matches LevelSelect.jsx exactly)
  const LEVEL_REQUIREMENTS = {
    1: 0, // Level 1: Always unlocked
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
    } else {
      // If this level can't be unlocked, no subsequent levels can be unlocked either
      break;
    }
  }

  return unlockedLevels;
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
// Navigate back to level select
  goBackToLevelSelect = () => {
    window.location.href = '/snake-game'; // Adjust this path as needed
  };

 getArrayRepresentation = () => {
  const { snake, foods, snakeSegmentValues } = this.state;
  const grid = Array(GRID_SIZE)
    .fill()
    .map(() => Array(GRID_SIZE).fill(0));

  // Mark food positions
  foods.forEach(food => {
    if (food.x >= 0 && food.x < GRID_SIZE && food.y >= 0 && food.y < GRID_SIZE) {
      grid[food.y][food.x] = food.number;
    }
  });

  // Mark snake positions
  snake.forEach((segment, index) => {
    if (segment.x >= 0 && segment.x < GRID_SIZE && segment.y >= 0 && segment.y < GRID_SIZE) {
      if (index === 0) {
        grid[segment.y][segment.x] = -1; // Head
      } else {
        const segmentValue = snakeSegmentValues[index - 1] ?? -3;
        grid[segment.y][segment.x] = segmentValue;
      }
    }
  });

  return grid;
};

  generateFood = (snake, existingFoods = [], count = 1) => {
    const newFoods = [];
    const maxAttempts = 100;
    let attempts = 0;

    // Determine how many foods to generate
    const numToGenerate = Math.min(count, 5); // Limit to 5 foods maximum

    while (newFoods.length < numToGenerate && attempts < maxAttempts) {
      const food = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
        number: Math.floor(Math.random() * 9) + 1, // Random number between 1-9
        id: Date.now() + Math.random(), // Unique ID for tracking
      };

      // Check if the position is valid (not occupied by snake or other food)
      const isValidPosition = !snake.some(seg => seg.x === food.x && seg.y === food.y) &&
        !existingFoods.some(f => f.x === food.x && f.y === food.y) &&
        !newFoods.some(f => f.x === food.x && f.y === food.y);

      if (isValidPosition) {
        newFoods.push(food);
        
        // Set timeout for odd-numbered foods
        if (food.number % 2 !== 0) {
          const foodId = food.id;
          const timeout = setTimeout(() => {
            this.setState(prevState => ({
              foods: prevState.foods.filter(f => f.id !== foodId)
            }), () => {
              // Generate a replacement food when odd food disappears -- MORE FOOD WILL APPEAR
              // if (this.state.gameStarted && !this.state.gameOver && !this.state.isPaused) {
              //   const replacement = this.generateFood(this.state.snake, this.state.foods, 1);
              //   if (replacement.length > 0) {
              //     this.setState(prevState => ({
              //       foods: [...prevState.foods, ...replacement]
              //     }));
              //   }
              // }
            });
          }, 3000);
          
          this.foodTimeouts.push(timeout);
        }
      }
      attempts++;
    }
    
    return newFoods;
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

  // Check if there are enough foods on the board and generate more if needed
  checkFoodCount = () => {
    if (this.state.foods.length < 3 && this.state.gameStarted && !this.state.gameOver && !this.state.isPaused) {
      const newFoodCount = 3 - this.state.foods.length;
      const newFoods = this.generateFood(this.state.snake, this.state.foods, newFoodCount);
      
      if (newFoods.length > 0) {
        this.setState(prevState => ({
          foods: [...prevState.foods, ...newFoods]
        }));
      }
    }
  };

  componentDidMount() {
    document.addEventListener("click", this.handleFirstInteraction);
    window.addEventListener("keydown", this.handleKeyDown);
    
    // Generate initial foods
    const initialSnake = this.state.snake;
    const initialFoods = this.generateFood(initialSnake, [], 3); // Start with 3 foods
    
    // Initialize the snake segment values for the initial snake
    const initialSegmentValues = Array(initialSnake.length - 1).fill(-3);
    
    this.setState({ 
      foods: initialFoods,
      snakeSegmentValues: initialSegmentValues
    });
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.handleFirstInteraction);
    window.removeEventListener("keydown", this.handleKeyDown);
    
    // Clear all food timeouts
    this.foodTimeouts.forEach(timeout => clearTimeout(timeout));
    
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.crunchAudio) {
      this.crunchAudio.pause();
    }
    if (this.backgroundAudio) {
      this.backgroundAudio.pause();
    }
    if (this.eatingAnimationTimeout) {
      clearTimeout(this.eatingAnimationTimeout);
    }
    if (this.foodGenerationTimer) {
      clearInterval(this.foodGenerationTimer);
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
        if (this.backgroundAudio) {
          this.backgroundAudio
            .play()
            .catch((e) => console.log("Background music error:", e));
             this.startTime = Date.now();  // Track game start time
        }
        this.startGameLoop();
        this.startTime = Date.now();  // Track game start time
        // Set up food generation periodic check
        this.foodGenerationTimer = setInterval(() => {
          this.checkFoodCount();
        }, 1000); // Check once per second
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

  // moveSnake method
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
    const { snake, foods, score, highScore, snakeSegmentValues, currentLevel } = prevState;
    const currentDirection = this.nextDirection;
    const now = Date.now();
    const timeSurvived = Math.floor((now - this.startTime) / 1000);

    const head = { ...snake[0] };
    head.x += currentDirection.x;
    head.y += currentDirection.y;

    // Game over if collision
    if (this.checkCollision(head, snake)) {
      cancelAnimationFrame(this.animationFrameId);
      if (this.foodGenerationTimer) clearInterval(this.foodGenerationTimer);
      
      const stars = this.calculateStars(score);
      
      this.reportProgress(
        prevState.currentLevel,
        score,
        stars,
        score, // foodEaten = score
        timeSurvived,
        true
      );

      return {
        ...prevState,
        gameOver: true,
        highScore: Math.max(score, highScore),
        musicPlaying: false,
        stars,
        showStarResult: true
      };
    }

    const newSnake = [head, ...snake];
    let newScore = score;
    let newFoods = [...foods];
    let newCollectedEvens = [...prevState.collectedEvens];
    let newSegmentValues = [...snakeSegmentValues];
    let foodEaten = false;
    let eatenFoodIsEven = false;
    let eatenFoodNumber = null;

    for (let i = 0; i < newFoods.length; i++) {
      const food = newFoods[i];

      if (head.x === food.x && head.y === food.y) {
        foodEaten = true;
        eatenFoodNumber = food.number;

        newFoods = newFoods.filter((_, index) => index !== i);

        if (food.number % 2 === 0) {
          eatenFoodIsEven = true;
          newScore += 1;
          newCollectedEvens.push(food.number);
          newSegmentValues = [food.number, ...newSegmentValues];

          if (this.crunchAudio) {
            try {
              this.crunchAudio.currentTime = 0;
              this.crunchAudio.play().catch(() => {});
            } catch (e) {}
          }
        } else {
          eatenFoodIsEven = false;
          newScore = Math.max(newScore - 1, 0);

          if (newCollectedEvens.length > 0) newCollectedEvens.pop();
          if (newSegmentValues.length > 0) newSegmentValues.pop();
          newSnake.pop();

          if (newSnake.length <= 1) {
            cancelAnimationFrame(this.animationFrameId);
            if (this.foodGenerationTimer) clearInterval(this.foodGenerationTimer);

            const stars = this.calculateStars(newScore);

            this.reportProgress(
              prevState.currentLevel,
              newScore,
              stars,
              newScore,
              timeSurvived,
              true
            );

            return {
              ...prevState,
              gameOver: true,
              highScore: Math.max(score, highScore),
              musicPlaying: false,
              stars,
              showStarResult: true
            };
          }
        }

        break;
      }
    }

    if (foodEaten) {
      const newFoodItems = this.generateFood(newSnake, newFoods, 1);
      newFoods = [...newFoods, ...newFoodItems];

      clearTimeout(this.eatingAnimationTimeout);
      this.eatingAnimationTimeout = setTimeout(() => {
        this.setState({ isEating: false });
      }, 300);
    }

    const finalSnake = foodEaten && eatenFoodIsEven
      ? newSnake
      : newSnake.slice(0, -1);

    const stars = this.calculateStars(newScore);

    return {
      ...prevState,
      snake: finalSnake,
      foods: newFoods,
      score: newScore,
      collectedEvens: newCollectedEvens,
      direction: currentDirection,
      isEating: foodEaten,
      snakeSegmentValues: newSegmentValues,
      highScore: Math.max(newScore, highScore),
      stars: stars
    };
  });
};


  handleKeyDown = (e) => {
    if (
      ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)
    ) {
      e.preventDefault();
    }

    // Start game with any arrow key if not already started
    if (
      !this.state.gameStarted &&
      ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)
    ) {
      this.startGame();
      return;
    }

    // Handle direction changes
    if (DIRECTIONS[e.key]) {
      const { direction } = this.state;
      // Only allow 90-degree turns (no reversing)
      if (
        direction.x !== -DIRECTIONS[e.key].x ||
        direction.y !== -DIRECTIONS[e.key].y
      ) {
        this.nextDirection = DIRECTIONS[e.key];
      }
    } 
    // Toggle pause with space
    else if (e.key === " ") {
      this.togglePause();
    }
  };

  resetGame = () => {
    // Cancel animation frame
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    // Clear all food timeouts
    this.foodTimeouts.forEach(timeout => clearTimeout(timeout));
    this.foodTimeouts = [];
    
    if (this.eatingAnimationTimeout) {
      clearTimeout(this.eatingAnimationTimeout);
    }
    
    if (this.foodGenerationTimer) {
      clearInterval(this.foodGenerationTimer);
      this.foodGenerationTimer = null;
    }

    // Reset snake to initial position
    const initialSnake = [
      { x: 5, y: 10 },
      { x: 4, y: 10 },
      { x: 3, y: 10 },
    ];
    
    // Generate new food for the reset game
    const newFoods = this.generateFood(initialSnake, [], 3); // Start with 3 foods

    this.setState({
      snake: initialSnake,
      collectedEvens: [],
      direction: DIRECTIONS.RIGHT,
      foods: newFoods,
      gameOver: false,
      score: 0,
      isPaused: false,
      gameStarted: false,
      isEating: false,
      snakeSegmentValues: Array(initialSnake.length - 1).fill(3), // Reset segment values
      stars: 0,
      showStarResult: false,
      highScore: 0
    });
    this.initializeHighScore(this.state.currentLevel);
    this.nextDirection = DIRECTIONS.RIGHT;
    
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

  getSegmentImage = (segment, index, segments) => {
    if (!segment || !segments || segments.length < 1) return ASSETS.IMAGES.BODY.HORIZONTAL;
    
    const isHead = index === 0;
    const isTail = index === segments.length - 1;

    // Handle head image
    if (isHead) {
      // Removed special case for head when eating
      const nextSegment = segments[1];
      if (!nextSegment) return ASSETS.IMAGES.HEAD.RIGHT;
      
      if (segment.x < nextSegment.x) return ASSETS.IMAGES.HEAD.LEFT;
      if (segment.x > nextSegment.x) return ASSETS.IMAGES.HEAD.RIGHT;
      if (segment.y < nextSegment.y) return ASSETS.IMAGES.HEAD.UP;
      return ASSETS.IMAGES.HEAD.DOWN;
    }

    // Handle tail image
    if (isTail) {
      const prevSegment = segments[index - 1];
      if (!prevSegment) return ASSETS.IMAGES.TAIL.LEFT;
      
      if (segment.x < prevSegment.x) return ASSETS.IMAGES.TAIL.LEFT;
      if (segment.x > prevSegment.x) return ASSETS.IMAGES.TAIL.RIGHT;
      if (segment.y < prevSegment.y) return ASSETS.IMAGES.TAIL.UP;
      return ASSETS.IMAGES.TAIL.DOWN;
    }

    // Handle body segments
    const prevSegment = segments[index - 1];
    const nextSegment = segments[index + 1];
    
    // Safety check
    if (!prevSegment || !nextSegment) return ASSETS.IMAGES.BODY.HORIZONTAL;

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
      foods,
      gameOver,
      score,
      highScore,
      isPaused,
      audioReady,
      gameStarted,
      musicPlaying,
      collectedEvens,
      stars,
      showStarResult,
      currentLevel,
    } = this.state;

    if (!audioReady) {
    return (
      <div className="start-screen-body pixel-container">
    <div className="pixel-border start-screen-main">
      <div className="start-header">
        <h1 className="pixel-text pixel-title" style={{ fontSize: '1.2rem' }}>SNAKE GAME: LEVEL 2</h1>
        <h2 className="pixel-text pixel-subtitle" style={{ fontSize: '0.9rem' }}>EVEN NUMBER HUNT</h2>
      </div>
      
      <div className="start-content">
        <div className="start-section pixel-border">
          <h3 className="start-section-title pixel-text" style={{ fontSize: '0.8rem' }}>
            <svg className="pixel-icon" width="18" height="18" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            HOW TO PLAY
          </h3>
          
          <div className="start-rules">
            {[
              ["GOAL:", "Collect even numbers while avoiding odd numbers"],
              ["CONTROLS:", "Use arrow keys to navigate the snake"],
              ["SCORING:", "+10 points for each even number"],
              ["GAME OVER:", "If you hit a wall, or your tail"],
              ["SIZE:", "Even = snake++, Odd = snake--"]
            ].map(([label, text]) => (
              <div className="start-rule-item" key={label}>
                <svg className="pixel-icon" width="16" height="16" viewBox="0 0 24 24">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
                <p className="pixel-text" style={{ fontSize: '0.7rem' }}>
                  <strong style={{ fontSize: '0.75rem' }}>{label}</strong> {text}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="start-section pixel-border">
          <h3 className="start-section-title pixel-text" style={{ fontSize: '0.8rem' }}>
            <svg className="pixel-icon" width="18" height="18" viewBox="0 0 24 24">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
              <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
            </svg>
            EDUCATIONAL VALUE
          </h3>
          
          <div className="start-edu-value">
            {[
              "This level helps you practice identifying even numbers quickly.",
              "Remember: Even numbers are divisible by 2 (like 2, 4, 6, 8...)",
              "Odd numbers are not divisible by 2 (like 1, 3, 5, 7...)"
            ].map((text, index) => (
              <p key={index} className="pixel-text" style={{ fontSize: '0.7rem' }}>
                {text}
              </p>
            ))}
          </div>
        </div>
        
        <div className="start-controls">
          <div className="start-key-controls">
            {['←', '↑', '↓', '→'].map((key, index) => (
              <div key={index} className="start-key pixel-key" style={{ 
                width: '2rem', 
                height: '2rem', 
                fontSize: '0.8rem' 
              }}>
                {key}
              </div>
            ))}
          </div>
          <button 
            className="start-btn pixel-btn" 
            onClick={this.startGame}
            style={{ 
              fontSize: '0.8rem',
              padding: '0.5rem 1rem',
              marginTop: '0.5rem'
            }}>
            CLICK ANYWHERE TO START!
          </button>
        </div>
      </div>
    </div>
  </div>
    );
  }

    // Get the array representation for the grid display
    const gridArray = this.getArrayRepresentation();

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
      }}>EAT EVENS</h1>
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

            {/* Food items */}
            {foods.map((food, index) => (
              <div
                key={`food-${food.id || index}`}
                className={`food-container ${food.number % 2 !== 0 ? 'odd' : ''}`}
                style={{
                  left: `${food.x * CELL_SIZE}px`,
                  top: `${food.y * CELL_SIZE}px`,
                }}
              >
                <img src={ASSETS.IMAGES.FOOD} className="food" alt="Food" />
                <div className="food-number">{food.number}</div>
              </div>
            ))}
            
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

            {/* Start Screen */}
            {!gameStarted && !gameOver && (
              <div className="start-screen-overlay">
                <div className="start-screen-message">
                  <h2>Ready to Play?</h2>
                  <p>Use arrow keys to move</p>
                  <button className="action-btn start" onClick={this.startGame}>
                    Start Game
                  </button>
                </div>
              </div>
            )}

            {/* Game Over Overlay */}
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
                {gridArray.map((row, y) => (
                  <div key={y} className="array-row">
                    {row.map((cell, x) => {
                      let cellClass = "";
                      if (cell === -1) {
                        cellClass = "head";
                      } else if (cell === -3) {
                        cellClass = "body";
                      } else if (cell > 0) {
                        cellClass = cell % 2 === 0 ? "even-number" : "food";
                      }
                      
                      return (
                        <div
                          key={`${x}-${y}`}
                          className={`array-cell ${cellClass}`}
                        >
                          {cell > 0 ? cell : ''} {/* Only show positive numbers */}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            <div className="array-legend">
              <div className="legend-item">
                <span className="legend-color head"></span> Head (-1)
              </div>
              <div className="legend-item">
                <span className="legend-color food"></span> Food (2)
              </div>
              <div className="legend-item">
                <span className="legend-color body"></span> Initial State(-2)
              </div>
              <div className="legend-item">
                <span className="legend-color"></span> Empty (0)
              </div>
            </div> 
            
            {/* Collected Numbers
            <div className="collected-numbers">
              <h4>Collected Even Numbers:</h4>
              <div className="even-numbers-list">
                {collectedEvens.map((num, idx) => (
                  <span key={idx} className="even-number">{num}</span>
                ))}
              </div>
            </div> */}
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


        {/* Controls*/}
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
      <p>EAT EVEN-NUMBERED APPLES (2,4,6,8) TO GROW</p>
      <p>AVOID ODD-NUMBERED APPLES - THEY SHRINK YOU!</p>
      <p>DON'T HIT WALLS OR YOURSELF!</p>
    </div>
      </div>
    );
  }
}

export default SnakeGame;
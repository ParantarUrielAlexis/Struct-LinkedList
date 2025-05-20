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
// Change these constants at the top of SnakeGame.jsx
const GRID_SIZE = 20; // Increased from 20
const CELL_SIZE = 30; // Increased from 20
const GAME_SPEED = 150; // You can adjust this if needed

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
      highScore: localStorage.getItem("snakeHighScore") || 0,
      isPaused: false,
      audioReady: false,
      lastUpdateTime: 0,
      accumulatedTime: 0,
      gameStarted: false,
      musicPlaying: false,
      isEating: false,
    };

    this.nextDirection = DIRECTIONS.RIGHT;
    this.animationFrameId = null;
    this.crunchAudio = null;
    this.backgroundAudio = null;
    this.gameBoardRef = React.createRef();
    this.eatingAnimationTimeout = null;
  }

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
      const { snake, direction, food, score, highScore } = prevState;
      const head = { ...snake[0] };

      const currentDirection = this.nextDirection;

      head.x += currentDirection.x;
      head.y += currentDirection.y;

      if (this.checkCollision(head, snake)) {
        cancelAnimationFrame(this.animationFrameId);
        if (score > highScore) {
          localStorage.setItem("snakeHighScore", score);
        }
        return {
          ...prevState,
          gameOver: true,
          highScore: Math.max(score, highScore),
          musicPlaying: false,
        };
      }

      const newSnake = [head, ...snake];

      if (head.x === food.x && head.y === food.y) {
        try {
          this.crunchAudio.currentTime = 0;
          this.crunchAudio
            .play()
            .catch((e) => console.log("Audio play failed:", e));
        } catch (e) {
          console.error("Audio error:", e);
        }

        // Clear any existing timeout to avoid multiple animations
        if (this.eatingAnimationTimeout) {
          clearTimeout(this.eatingAnimationTimeout);
        }

        // Set eating state and create timeout to clear it
        this.setState({ isEating: true });
        this.eatingAnimationTimeout = setTimeout(() => {
          this.setState({ isEating: false });
        }, 300); // Animation duration matches crunch sound

        return {
          ...prevState,
          snake: newSnake,
          food: this.generateFood(newSnake),
          score: prevState.score + 1,
          direction: currentDirection,
          isEating: true,
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
    });
    this.nextDirection = DIRECTIONS.RIGHT;

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
      <h1 className="game-title pixel-text" style={{ 
        color: '#4CFF50',
        textShadow: '2px 2px 0px rgba(0,0,0,0.8)',
        fontSize: '1.5rem'
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
              <button className="pixel-btn" onClick={this.resetGame}>
                PLAY AGAIN
              </button>
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
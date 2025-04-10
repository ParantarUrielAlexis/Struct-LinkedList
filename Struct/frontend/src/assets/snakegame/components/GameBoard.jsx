import React from 'react';
import { GRID_SIZE, CELL_SIZE } from "@/assets/snakegame/utils/constants.js";
import Snake from './Snake';
import Food from './Food';
import Controls from './Controls';
import Score from "./Score";
import "../styles/gameStyles.css";

const GameBoard = ({ 
    snake, 
    food, 
    gameOver, 
    score, 
    onKeyDown, 
    resetGame, 
    isPaused, 
    togglePause,
    direction,
    moveUp,
    moveDown,
    moveLeft,
    moveRight
  }) => {
    const boardSize = GRID_SIZE * CELL_SIZE;
  
    return (
      <div className="game-container">
        <Score score={score} />
        <div 
          className="game-board"
          style={{
            width: `${boardSize}px`,
            height: `${boardSize}px`,
          }}
          tabIndex="0"
          onKeyDown={onKeyDown}
        >
          {gameOver && (
            <div className="game-over-overlay">
              <div className="game-over-message">Game Over! Score: {score}</div>
              <button className="action-btn reset" onClick={resetGame}>
                Play Again
              </button>
            </div>
          )}
          <Snake segments={snake} />
          <Food position={food} />
        </div>
        <Controls
          onArrowUp={moveUp}
          onArrowDown={moveDown}
          onArrowLeft={moveLeft}
          onArrowRight={moveRight}
          onPause={togglePause}
          onReset={resetGame}
          isPaused={isPaused}
        />
      </div>
    );
  };
  
  export default GameBoard;
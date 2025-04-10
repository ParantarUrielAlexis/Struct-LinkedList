import { useState, useEffect, useCallback, useRef } from 'react';
import { GRID_SIZE, CELL_SIZE, DIRECTIONS, GAME_SPEED } from '@/assets/snakegame/utils/constants.js'; 
import { generateFood, checkCollision } from '@/assets/snakegame/utils/helpers.js'; 

const useGameLogic = () => {
  const [snake, setSnake] = useState([{ x: 5, y: 10 }, { x: 4, y: 10 }, { x: 3, y: 10 }]);
  const [food, setFood] = useState(generateFood());
  const [direction, setDirection] = useState(DIRECTIONS.ArrowRight);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const nextDirection = useRef(DIRECTIONS.ArrowRight);
  const gameLoopRef = useRef();

  const moveSnake = useCallback(() => {
    if (isPaused) return;

    setSnake(prevSnake => {
      const head = { ...prevSnake[0] };
      
      // Update direction from the queue if available
      if (nextDirection.current.x !== -direction.x || nextDirection.current.y !== -direction.y) {
        setDirection(nextDirection.current);
      }
      
      // Move head
      head.x += direction.x;
      head.y += direction.y;

      // Check collisions
      if (
        head.x < 0 || head.x >= GRID_SIZE ||
        head.y < 0 || head.y >= GRID_SIZE ||
        prevSnake.some(segment => segment.x === head.x && segment.y === head.y)
      ) {
        setGameOver(true);
        clearInterval(gameLoopRef.current);
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];
      
      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setFood(generateFood(newSnake));
        setScore(prev => prev + 1);
        return newSnake; // Keep tail (snake grows)
      }
      
      return newSnake.slice(0, -1); // Remove tail
    });
  }, [direction, food, isPaused]);

  const onKeyDown = useCallback((e) => {
    if (DIRECTIONS[e.key]) {
      // Prevent 180-degree turns
      if (direction.x !== -DIRECTIONS[e.key].x || direction.y !== -DIRECTIONS[e.key].y) {
        nextDirection.current = DIRECTIONS[e.key];
      }
    } else if (e.key === ' ') {
      togglePause();
    }
  }, [direction]);

  const resetGame = useCallback(() => {
    setSnake([{ x: 5, y: 10 }, { x: 4, y: 10 }, { x: 3, y: 10 }]);
    setDirection(DIRECTIONS.ArrowRight);
    nextDirection.current = DIRECTIONS.ArrowRight;
    setFood(generateFood());
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
  }, []);

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  useEffect(() => {
    // Focus the game board for keyboard input
    const gameBoard = document.querySelector('.game-board');
    if (gameBoard) gameBoard.focus();

    // Set up game loop
    gameLoopRef.current = setInterval(moveSnake, GAME_SPEED);

    return () => {
      clearInterval(gameLoopRef.current);
    };
  }, [moveSnake]);

  return {
    snake,
    food,
    gameOver,
    score,
    direction,
    onKeyDown,
    resetGame,
    isPaused,
    togglePause,
    moveUp: () => nextDirection.current = DIRECTIONS.ArrowUp,
    moveDown: () => nextDirection.current = DIRECTIONS.ArrowDown,
    moveLeft: () => nextDirection.current = DIRECTIONS.ArrowLeft,
    moveRight: () => nextDirection.current = DIRECTIONS.ArrowRight,
  };
};

export default useGameLogic;
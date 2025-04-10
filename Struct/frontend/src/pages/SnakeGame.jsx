import React from 'react';
import GameBoard from '../assets/snakegame/components/GameBoard';
import useGameLogic from '../assets/snakegame/hooks/useGameLogic';
import '../assets/snakegame/styles/gameStyles.css';

const SnakeGame = () => {
  const gameLogic = useGameLogic();

  return (
    <div className="snake-game-page" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <h1 style={{ marginBottom: '20px' }}>React Snake Game</h1>
      <div style={{ maxWidth: '100%', overflow: 'auto' }}>
        <GameBoard {...gameLogic} />
      </div>
      <p style={{ marginTop: '20px', color: '#666' }}>
        Use arrow keys or on-screen buttons to control the snake
      </p>
    </div>
  );
};

export default SnakeGame;
import React from "react";
import { useNavigate } from "react-router-dom";
import "./SnakeGame.css";

const LevelSelect = () => {
  const navigate = useNavigate();

  return (
    <div className="level-select-screen">
      <h1>Choose Your Snake Game Level</h1>
      <div className="levels-container">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className="level-card"
            onClick={() => navigate(`/snake-game/${level}`)}
          >
            <div className="level-content">
              <h2>Level {level}</h2>
              <div className="difficulty-indicators">
                {[...Array(level)].map((_, i) => (
                  <div key={i} className="difficulty-dot"></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LevelSelect;
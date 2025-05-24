import React from "react";
import { useState } from "react";
import "./LevelSelect.css";
import levelselectBG from "../../assets/snakegame/gif/levelselect_bg.gif";

// Constants for maintainability
const LEVELS = [1, 2, 3, 4, 5];

// Descriptions for each level
const LEVEL_DESCRIPTIONS = {
  1: "Beginner - Perfect for new players",
  2: "Easy - A little more challenging",
  3: "Medium - Test your skills",
  4: "Hard - For experienced players",
  5: "Expert - Only for the brave!"
};

// Custom colors for each level
const LEVEL_COLORS = {
  1: "#4CAF50", // Light green
  2: "#8BC34A", // Lime green
  3: "#CDDC39", // Yellow-green
  4: "#FFC107", // Amber
  5: "#FF5722"  // Deep orange-red
};

const LevelSelect = () => {
  const [hoveredLevel, setHoveredLevel] = useState(null);
  
  const handleLevelSelect = (level) => {
    // Navigate to the selected level
    console.log(`Navigating to level ${level}`);
    // Using window.location instead of navigate for this demo
    window.location.href = `/snake-game/${level}`;
  };

  return (
    <div className="level-select-screen">
      <div className="background-container">
        <div 
          className="pixelated-bg"
          style={{ 
            backgroundImage: `url(${levelselectBG})`,
          }}
        />
      </div>
      <div className="content-container">
        <h1 className="text-4xl font-bold mb-8 text-center text-green-100 uppercase tracking-wider pixel-text">
          Choose Your Snake Game Level
        </h1>
        
        <div className="flex flex-wrap justify-center gap-6 w-full max-w-6xl mx-auto">
          {LEVELS.map((levelNumber) => (
            <div
              key={levelNumber}
              className="level-card pixel-border w-60 h-64 flex flex-col items-center justify-center rounded-2xl p-6 cursor-pointer transform transition-all duration-300 hover:scale-105"
              style={{
                borderColor: LEVEL_COLORS[levelNumber],
                boxShadow: hoveredLevel === levelNumber ? `0 0 20px ${LEVEL_COLORS[levelNumber]}` : 'none'
              }}
              onClick={() => handleLevelSelect(levelNumber)}
              onMouseEnter={() => setHoveredLevel(levelNumber)}
              onMouseLeave={() => setHoveredLevel(null)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => e.key === "Enter" && handleLevelSelect(levelNumber)}
            >
              <div className="level-content text-center">
                <h2 className="text-3xl font-bold mb-2 pixel-text" style={{ color: LEVEL_COLORS[levelNumber] }}>
                  Level {levelNumber}
                </h2>
                
                <div className="difficulty-indicators flex flex-wrap justify-center gap-2 my-4">
                  {Array.from({ length: levelNumber }).map((_, index) => (
                    <div 
                      key={index} 
                      className="difficulty-dot w-4 h-4 rounded-full pixel-dot"
                      style={{ 
                        background: `linear-gradient(145deg, ${LEVEL_COLORS[levelNumber]}, #1a4d1a)`,
                        opacity: hoveredLevel === levelNumber ? 1 : 0.8
                      }}
                    />
                  ))}
                </div>
                
                <p className="text-sm mt-2 text-green-100 opacity-80 pixel-text">
                  {LEVEL_DESCRIPTIONS[levelNumber]}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Game description */}
        <div className="mt-12 text-center max-w-2xl mx-auto p-6 bg-green-900 bg-opacity-50 rounded-lg pixel-border">
          <h3 className="text-xl font-semibold mb-2 text-green-200 pixel-text">About Snake Game</h3>
          <p className="text-green-100 opacity-90 pixel-text">
            Navigate the snake to collect food while avoiding walls and your own tail.
            Higher levels introduce new challenges and faster gameplay!
          </p>
        </div>
      </div>
    </div>
  );
};

export default LevelSelect;
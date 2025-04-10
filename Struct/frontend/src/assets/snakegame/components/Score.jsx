import React from "react";
import PropTypes from "prop-types";
import "../styles/gameStyles.css";

const Score = ({ score }) => {
  return (
    <div className="score-display">
      <div className="score-container">
        <span className="score-label">Score:</span>
        <span className="score-value">{score}</span>
      </div>
    </div>
  );
};

Score.propTypes = {
  score: PropTypes.number.isRequired
};

export default Score;
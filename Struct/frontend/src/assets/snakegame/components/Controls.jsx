import React from 'react';
import PropTypes from 'prop-types';
import "../styles/gameStyles.css";

const Controls = ({ 
  onArrowUp, 
  onArrowDown, 
  onArrowLeft, 
  onArrowRight, 
  onPause, 
  onReset,
  isPaused 
}) => {
  return (
    <div className="controls-container">
      <div className="directional-controls">
        <button className="control-btn up" onClick={onArrowUp} aria-label="Move up">
          ↑
        </button>
        <div className="horizontal-controls">
          <button className="control-btn left" onClick={onArrowLeft} aria-label="Move left">
            ←
          </button>
          <button className="control-btn right" onClick={onArrowRight} aria-label="Move right">
            →
          </button>
        </div>
        <button className="control-btn down" onClick={onArrowDown} aria-label="Move down">
          ↓
        </button>
      </div>
      <div className="action-controls">
        <button className="action-btn pause" onClick={onPause}>
          {isPaused ? 'Resume' : 'Pause'}
        </button>
        <button className="action-btn reset" onClick={onReset}>
          Reset
        </button>
      </div>
    </div>
  );
};

Controls.propTypes = {
  onArrowUp: PropTypes.func.isRequired,
  onArrowDown: PropTypes.func.isRequired,
  onArrowLeft: PropTypes.func.isRequired,
  onArrowRight: PropTypes.func.isRequired,
  onPause: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  isPaused: PropTypes.bool.isRequired
};

export default Controls;
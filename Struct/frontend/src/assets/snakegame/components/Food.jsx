import React from 'react';
import { CELL_SIZE } from '@/assets/snakegame/utils/constants.js';
import '@/assets/snakegame/utils/helpers.js';

const Food = ({ position }) => {
  return (
    <div
      className="food"
      style={{
        left: `${position.x * CELL_SIZE}px`,
        top: `${position.y * CELL_SIZE}px`,
        width: `${CELL_SIZE}px`,
        height: `${CELL_SIZE}px`,
      }}
    />
  );
};

export default Food;
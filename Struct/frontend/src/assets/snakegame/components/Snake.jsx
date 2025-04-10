import React from 'react';
import { CELL_SIZE } from "@/assets/snakegame/utils/constants.js";
import "../styles/gameStyles.css";

const Snake = ({ segments }) => {
  return (
    <>
      {segments.map((segment, index) => {
        const isHead = index === 0;
        const isTail = index === segments.length - 1;
        
        let segmentClass = 'snake-body';
        if (isHead) segmentClass = 'snake-head';
        if (isTail) segmentClass = 'snake-tail';

        // Determine direction for head/tail graphics
        let rotation = 0;
        if (isHead || isTail) {
          const nextSegment = isHead ? segments[1] : segments[index - 1];
          if (segment.x < nextSegment.x) rotation = 180; // left
          else if (segment.x > nextSegment.x) rotation = 0; // right
          else if (segment.y < nextSegment.y) rotation = 90; // up
          else if (segment.y > nextSegment.y) rotation = 270; // down
        }

        return (
          <div
            key={`${segment.x}-${segment.y}-${index}`}
            className={segmentClass}
            style={{
              left: `${segment.x * CELL_SIZE}px`,
              top: `${segment.y * CELL_SIZE}px`,
              width: `${CELL_SIZE}px`,
              height: `${CELL_SIZE}px`,
              transform: `rotate(${rotation}deg)`,
            }}
          />
        );
      })}
    </>
  );
};

export default Snake;
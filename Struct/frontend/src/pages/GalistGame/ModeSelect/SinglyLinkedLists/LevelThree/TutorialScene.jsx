import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import styles from "./InsertionNode.module.css";
import tutorialStyles from "./TutorialScene.module.css";

function TutorialScene({ scene, onContinue }) {
  // State for tutorial demonstration
  const [tutorialNodes, setTutorialNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [insertValue, setInsertValue] = useState("");
  const [insertAddress, setInsertAddress] = useState("");
  const [showInsertPopup, setShowInsertPopup] = useState(false);
  const [insertionType, setInsertionType] = useState("");
  const [insertIndex, setInsertIndex] = useState("");
  const [showIndexInput, setShowIndexInput] = useState(false);
  const [completedInsertions, setCompletedInsertions] = useState(0);
  const tutorialNodesRef = useRef([]);

  // Update ref whenever tutorial nodes change
  useEffect(() => {
    tutorialNodesRef.current = tutorialNodes;
  }, [tutorialNodes]);

  // Initialize tutorial nodes for each scene
  useEffect(() => {
    if (scene === "scene2") {
      // Scene 2: Show initial linked list for insertion practice
      const nodess = [
        {
          id: 1,
          value: "10",
          address: "a1b",
          x: 300,
          y: 200,
        },
        {
          id: 2,
          value: "30",
          address: "c3d",
          x: 500,
          y: 200,
        },
      ];
      setTutorialNodes(nodes);
      setConnections([
        { id: 1, from: 1, to: 2 },
      ]);
      setCompletedInsertions(0);
    } else if (scene === "scene3") {
      // Scene 3: Show the completed linked list after insertions
      const nodes = [
        {
          id: 1,
          value: "5",
          address: "x5y",
          x: 200,
          y: 200,
        },
        {
          id: 2,
          value: "10",
          address: "a1b",
          x: 350,
          y: 200,
        },
        {
          id: 3,
          value: "20",
          address: "b2c",
          x: 500,
          y: 200,
        },
        {
          id: 4,
          value: "30",
          address: "c3d",
          x: 650,
          y: 200,
        },
      ];
      setTutorialNodes(nodes);
      setConnections([
        { id: 1, from: 1, to: 2 },
        { id: 2, from: 2, to: 3 },
        { id: 3, from: 3, to: 4 },
      ]);
    }
  }, [scene]);

  // Handle insertion demonstration
  const handleInsertionDemo = useCallback((type) => {
    if (!insertValue.trim() || !insertAddress.trim()) {
      alert("Please enter both value and address");
      return;
    }

    const newNode = {
      id: Date.now(),
      value: insertValue.trim(),
      address: insertAddress.trim(),
      x: 0,
      y: 200,
    };

    if (type === "head") {
      // Insert at head
      newNode.x = 200;
      const currentHead = tutorialNodes.find(node => 
        !connections.some(conn => conn.to === node.id)
      );
      
      setTutorialNodes(prev => [...prev, newNode]);
      if (currentHead) {
        setConnections(prev => [...prev, {
          id: Date.now(),
          from: newNode.id,
          to: currentHead.id
        }]);
      }
    } else if (type === "middle") {
      // Insert in middle (between nodes)
      newNode.x = 425; // Between 350 and 500
      
      // Remove connection between node 2 and node 4 (if exists)
      setConnections(prev => prev.filter(conn => 
        !(conn.from === 2 && conn.to === 2) // Remove old connection
      ));
      
      setTutorialNodes(prev => [...prev, newNode]);
      
      // Add new connections
      setConnections(prev => [
        ...prev.filter(conn => !(conn.from === 2 && conn.to === 2)),
        { id: Date.now(), from: 2, to: newNode.id },
        { id: Date.now() + 1, from: newNode.id, to: 2 }
      ]);
    } else if (type === "tail") {
      // Insert at tail
      newNode.x = 600;
      const currentTail = tutorialNodes.find(node => 
        !connections.some(conn => conn.from === node.id)
      );
      
      setTutorialNodes(prev => [...prev, newNode]);
      if (currentTail) {
        setConnections(prev => [...prev, {
          id: Date.now(),
          from: currentTail.id,
          to: newNode.id
        }]);
      }
    }

    setCompletedInsertions(prev => prev + 1);
    setShowInsertPopup(false);
    setInsertValue("");
    setInsertAddress("");
    setInsertionType("");
  }, [insertValue, insertAddress, tutorialNodes, connections]);

  // Handle insertion type selection
  const handleInsertionTypeSelect = useCallback((type) => {
    setInsertionType(type);
    if (type === "specific") {
      setShowIndexInput(true);
    } else {
      handleInsertionDemo(type === "head" ? "head" : type === "tail" ? "tail" : "middle");
    }
  }, [handleInsertionDemo]);

  const closePopup = () => {
    setShowInsertPopup(false);
    setInsertValue("");
    setInsertAddress("");
    setInsertionType("");
    setShowIndexInput(false);
    setInsertIndex("");
  };

  if (scene === "scene1") {
    return (
      <div className={styles.app}>
        <video
          className={styles.videoBackground}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src="./video/insertion_bg.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className={tutorialStyles.tutorialOverlay}>
          <div className={tutorialStyles.tutorialPopup}>
            <div className={tutorialStyles.tutorialContent}>
              <h2>Welcome to Node Insertion!</h2>
              <p>
                Node insertion in a singly linked list involves adding new nodes 
                at specific positions while maintaining the proper connections 
                between existing nodes.
              </p>
              <p>
                You can insert nodes at three positions:
              </p>
              <ul>
                <li><strong>Head:</strong> Insert at the beginning (index 0)</li>
                <li><strong>Middle:</strong> Insert at a specific position (index 1 to N-1)</li>
                <li><strong>Tail:</strong> Insert at the end (after the last node)</li>
              </ul>
              <p>
                <strong>Let&apos;s practice inserting nodes!</strong>
              </p>
              <button
                onClick={onContinue}
                className={tutorialStyles.tutorialButton}
              >
                Continue
              </button>
            </div>
          </div>
        </div>

        <div className={styles.interactiveSquareWrapper}>
          <div className={styles.squareNode}>
            <div className={styles.squareSection}>
              <div className={styles.sectionLabel}>Value</div>
              <div className={`${styles.squareNodeField} ${styles.empty}`}>-</div>
            </div>
            <div className={styles.squareSection}>
              <div className={styles.sectionLabel}>Next</div>
              <div className={`${styles.squareNodeField} ${styles.empty}`}>NULL</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (scene === "scene2") {
    return (
      <div className={styles.app}>
        <video
          className={styles.videoBackground}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src="./video/insertion_bg.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className={tutorialStyles.tutorialInstructionBar}>
          <h3>Try inserting nodes at different positions</h3>
        </div>

        {/* Tutorial Nodes */}
        {tutorialNodes.map((node) => {
          const hasOutgoing = connections.some((conn) => conn.from === node.id);
          const hasIncoming = connections.some((conn) => conn.to === node.id);
          const isHead = hasOutgoing && !hasIncoming;
          const isTail = hasIncoming && !hasOutgoing;

          return (
            <div
              key={node.id}
              className={styles.animatedCircle}
              style={{
                left: `${node.x - 30}px`,
                top: `${node.y - 30}px`,
              }}
            >
              {(isHead || isTail) && (
                <span className={styles.nodeTypeLabel}>
                  {isHead ? "Head" : "Tail"}
                </span>
              )}
              <span className={styles.circleValue}>{node.value}</span>
              <span className={styles.circleAddress}>{node.address}</span>
            </div>
          );
        })}

        {/* Connection Lines */}
        <svg className={styles.connectionLines}>
          {connections.map((connection) => {
            const fromNode = tutorialNodes.find((n) => n.id === connection.from);
            const toNode = tutorialNodes.find((n) => n.id === connection.to);
            if (!fromNode || !toNode) return null;

            return (
              <g key={connection.id}>
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  className={styles.animatedLine}
                  markerEnd="url(#arrowhead)"
                />
              </g>
            );
          })}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="8"
              markerHeight="8"
              refX="16"
              refY="4"
              orient="auto"
              fill="#fff"
              stroke="#fff"
              strokeWidth="0.5"
            >
              <path d="M0,0 L0,8 L8,4 z" fill="#fff" />
            </marker>
          </defs>
        </svg>

        {/* Tutorial Insert Controls */}
        <div className={tutorialStyles.tutorialControls}>
          <input
            type="text"
            placeholder="Enter Value"
            value={insertValue}
            onChange={(e) => setInsertValue(e.target.value)}
            className={tutorialStyles.tutorialInput}
          />
          <input
            type="text"
            placeholder="Enter Address"
            value={insertAddress}
            onChange={(e) => setInsertAddress(e.target.value)}
            className={tutorialStyles.tutorialInput}
          />
          <button
            onClick={() => setShowInsertPopup(true)}
            className={tutorialStyles.tutorialInsertButton}
            disabled={!insertValue.trim() || !insertAddress.trim()}
          >
            INSERT
          </button>
        </div>

        {/* Insert Options Popup */}
        {showInsertPopup && (
          <div className={styles.insertModalOverlay} onClick={closePopup}>
            <div
              className={styles.insertModalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <button className={styles.insertModalCloseBtn} onClick={closePopup}>
                ×
              </button>

              <div className={styles.insertOptions}>
                <button
                  className={`${styles.insertOptionBtn} head-btn`}
                  onClick={() => handleInsertionTypeSelect("head")}
                >
                  <div className={styles.optionTitle}>HEAD</div>
                  <div className={styles.optionSubtitle}>Insert at beginning</div>
                </button>

                <button
                  className={`${styles.insertOptionBtn} specific-btn`}
                  onClick={() => handleInsertionTypeSelect("middle")}
                >
                  <div className={styles.optionTitle}>MIDDLE</div>
                  <div className={styles.optionSubtitle}>Insert between nodes</div>
                </button>

                <button
                  className={`${styles.insertOptionBtn} tail-btn`}
                  onClick={() => handleInsertionTypeSelect("tail")}
                >
                  <div className={styles.optionTitle}>TAIL</div>
                  <div className={styles.optionSubtitle}>Insert at end</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Progress indicator */}
        <div className={tutorialStyles.progressIndicator}>
          <span>Insertions made: {completedInsertions}/2</span>
        </div>

        {/* Continue button after making insertions */}
        {completedInsertions >= 2 && (
          <div className={tutorialStyles.tutorialOverlay}>
            <div className={tutorialStyles.tutorialPopup}>
              <div className={tutorialStyles.tutorialContent}>
                <h2>Excellent!</h2>
                <p>
                  You&apos;ve successfully inserted nodes into the linked list! 
                  Notice how the connections are maintained and updated when 
                  nodes are inserted at different positions.
                </p>
                <p>
                  <strong>Key Points:</strong>
                </p>
                <ul>
                  <li>Head insertion creates a new head node</li>
                  <li>Middle insertion requires updating connections</li>
                  <li>Tail insertion extends the list at the end</li>
                </ul>
                <button
                  onClick={onContinue}
                  className={tutorialStyles.tutorialButton}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (scene === "scene3") {
    return (
      <div className={styles.app}>
        <video
          className={styles.videoBackground}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src="./video/insertion_bg.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className={tutorialStyles.gameInstructionsOverlay}>
          <div className={tutorialStyles.gameInstructionsPopup}>
            <div className={tutorialStyles.gameInstructionsContent}>
              <div className={tutorialStyles.gameInstructionsHeader}>
                <h2>Game Instructions</h2>
              </div>

              <div className={tutorialStyles.gameInstructionsBody}>
                <ul>
                  <li>
                    <strong>Objective:</strong> Create the expected linked list 
                    structure by inserting nodes at correct positions
                  </li>
                  <li>
                    <strong>Input Fields:</strong> Enter address and value for 
                    new nodes, then click INSERT
                  </li>
                  <li>
                    <strong>Insertion Types:</strong> Choose HEAD (beginning), 
                    SPECIFIC (middle), or TAIL (end) insertion
                  </li>
                  <li>
                    <strong>Initial Nodes:</strong> Some exercises start with 
                    pre-existing nodes to build upon
                  </li>
                  <li>
                    <strong>Portal Validation:</strong> Use the portal to submit 
                    your completed structure for validation
                  </li>
                  <li>
                    <strong>Node Deletion:</strong> Double-click nodes to delete 
                    them if needed for corrections
                  </li>
                  <li>
                    <strong>Expected Structure:</strong> Follow the pattern shown 
                    in the top bar to complete each exercise
                  </li>
                </ul>
              </div>

              <div className={tutorialStyles.gameInstructionsFooter}>
                <button
                  onClick={onContinue}
                  className={tutorialStyles.tutorialButton}
                >
                  Start Game
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Show completed linked list in background */}
        {tutorialNodes.map((node) => {
          const hasOutgoing = connections.some((conn) => conn.from === node.id);
          const hasIncoming = connections.some((conn) => conn.to === node.id);
          const isHead = hasOutgoing && !hasIncoming;
          const isTail = hasIncoming && !hasOutgoing;

          return (
            <div
              key={node.id}
              className={styles.animatedCircle}
              style={{
                left: `${node.x - 30}px`,
                top: `${node.y - 30}px`,
                opacity: 0.7,
              }}
            >
              {(isHead || isTail) && (
                <span className={styles.nodeTypeLabel}>
                  {isHead ? "Head" : "Tail"}
                </span>
              )}
              <span className={styles.circleValue}>{node.value}</span>
              <span className={styles.circleAddress}>{node.address}</span>
            </div>
          );
        })}

        {/* Connection Lines */}
        <svg className={styles.connectionLines} style={{ opacity: 0.7 }}>
          {connections.map((connection) => {
            const fromNode = tutorialNodes.find((n) => n.id === connection.from);
            const toNode = tutorialNodes.find((n) => n.id === connection.to);
            if (!fromNode || !toNode) return null;

            return (
              <g key={connection.id}>
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  className={styles.animatedLine}
                  markerEnd="url(#arrowhead-tutorial)"
                />
              </g>
            );
          })}
          <defs>
            <marker
              id="arrowhead-tutorial"
              markerWidth="8"
              markerHeight="8"
              refX="16"
              refY="4"
              orient="auto"
              fill="#fff"
              stroke="#fff"
              strokeWidth="0.5"
            >
              <path d="M0,0 L0,8 L8,4 z" fill="#fff" />
            </marker>
          </defs>
        </svg>
      </div>
    );
  }

  return null;
}

TutorialScene.propTypes = {
  scene: PropTypes.string.isRequired,
  onContinue: PropTypes.func.isRequired,
};

export default TutorialScene;
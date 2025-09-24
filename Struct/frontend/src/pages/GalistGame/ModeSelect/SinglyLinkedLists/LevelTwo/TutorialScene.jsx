import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import styles from "./LinkingNode.module.css";
import tutorialStyles from "./TutorialScene.module.css";

function TutorialScene({ scene, onContinue }) {
  // State for tutorial demonstration
  const [tutorialNodes, setTutorialNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [connectToAddress, setConnectToAddress] = useState("");
  const [showConnectionPopup, setShowConnectionPopup] = useState(false);
  const [completedConnections, setCompletedConnections] = useState(0);
  const tutorialNodesRef = useRef([]);

  // Update ref whenever tutorial nodes change
  useEffect(() => {
    tutorialNodesRef.current = tutorialNodes;
  }, [tutorialNodes]);

  // Initialize tutorial nodes for each scene
  useEffect(() => {
    if (scene === "scene2") {
      // Scene 2: Show three nodes to demonstrate linking
      const nodes = [
        {
          id: 1,
          value: "10",
          address: "a1b",
          x: 200,
          y: 200,
        },
        {
          id: 2,
          value: "20",
          address: "b2c",
          x: 400,
          y: 250,
        },
        {
          id: 3,
          value: "30",
          address: "c3d",
          x: 600,
          y: 200,
        },
      ];
      setTutorialNodes(nodes);
      setConnections([]);
      setCompletedConnections(0);
    } else if (scene === "scene3") {
      // Scene 3: Show the completed linked list
      const nodes = [
        {
          id: 1,
          value: "10",
          address: "a1b",
          x: 200,
          y: 200,
        },
        {
          id: 2,
          value: "20",
          address: "b2c",
          x: 400,
          y: 200,
        },
        {
          id: 3,
          value: "30",
          address: "c3d",
          x: 600,
          y: 200,
        },
      ];
      setTutorialNodes(nodes);
      setConnections([
        { id: 1, from: 1, to: 2 },
        { id: 2, from: 2, to: 3 },
      ]);
    }
  }, [scene]);

  // Handle node double-click to show connection popup
  const handleNodeDoubleClick = useCallback((node) => {
    if (scene !== "scene2") return;
    setSelectedNode(node);
    setConnectToAddress("");
    setShowConnectionPopup(true);
  }, [scene]);

  // Handle connection creation
  const handleConnect = useCallback(() => {
    if (!selectedNode || !connectToAddress.trim()) return;

    const targetNode = tutorialNodes.find(
      (n) => n.address === connectToAddress.trim()
    );

    if (targetNode && targetNode.id !== selectedNode.id) {
      const newConnection = {
        id: Date.now(),
        from: selectedNode.id,
        to: targetNode.id,
      };

      setConnections((prev) => [...prev, newConnection]);
      setCompletedConnections((prev) => prev + 1);
    }

    setShowConnectionPopup(false);
    setSelectedNode(null);
    setConnectToAddress("");
  }, [selectedNode, connectToAddress, tutorialNodes]);

  const closePopup = () => {
    setShowConnectionPopup(false);
    setSelectedNode(null);
    setConnectToAddress("");
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
          <source src="./video/node_linking_bg.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className={tutorialStyles.tutorialOverlay}>
          <div className={tutorialStyles.tutorialPopup}>
            <div className={tutorialStyles.tutorialContent}>
              <h2>Welcome to Node Linking!</h2>
              <p>
                In a singly linked list, linking means connecting nodes together 
                so each node points to the next one. This forms a chain from the 
                head to the tail.
              </p>
              <p>
                <strong>Let&apos;s practice linking nodes together.</strong>
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
          <source src="./video/node_linking_bg.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className={tutorialStyles.tutorialInstructionBar}>
          <h3>Double-click a node to connect it to another node</h3>
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
                cursor: "pointer",
              }}
              onDoubleClick={() => handleNodeDoubleClick(node)}
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

        {/* Connection Popup */}
        {showConnectionPopup && selectedNode && (
          <div className={styles.popupOverlay} onClick={closePopup}>
            <div
              className={styles.popupContent}
              onClick={(e) => e.stopPropagation()}
            >
              <button className={styles.popupCloseBtn} onClick={closePopup}>
                ×
              </button>

              <div className={styles.popupCircle}>
                <span className={styles.popupCircleValue}>
                  {selectedNode.value}
                </span>
                <span className={styles.popupCircleAddress}>
                  {selectedNode.address}
                </span>
              </div>

              <div className={styles.popupFormContainer}>
                <div className={styles.popupText}>Connect to address:</div>
                <input
                  type="text"
                  placeholder="Enter target address"
                  value={connectToAddress}
                  onChange={(e) => setConnectToAddress(e.target.value)}
                  className={styles.popupInput}
                  autoFocus
                />
                <div className={styles.popupButtons}>
                  <button
                    onClick={handleConnect}
                    className={`${styles.popupButton} ${styles.connectBtn}`}
                  >
                    CONNECT
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress indicator */}
        <div className={tutorialStyles.progressIndicator}>
          <span>Connections made: {completedConnections}/2</span>
        </div>

        {/* Continue button after making connections */}
        {completedConnections >= 2 && (
          <div className={tutorialStyles.tutorialOverlay}>
            <div className={tutorialStyles.tutorialPopup}>
              <div className={tutorialStyles.tutorialContent}>
                <h2>Excellent!</h2>
                <p>
                  You&apos;ve successfully created a linked list! Notice how each 
                  node points to the next one, forming a chain from head to tail.
                </p>
                <p>
                  The first node (with outgoing connections but no incoming) 
                  becomes the <strong>Head</strong>, and the last node (with 
                  incoming connections but no outgoing) becomes the <strong>Tail</strong>.
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
          <source src="./video/node_linking_bg.mp4" type="video/mp4" />
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
                    <strong>Objective:</strong> Create linked lists by connecting 
                    nodes in the correct order
                  </li>
                  <li>
                    <strong>Controls:</strong> Launch nodes using the input fields, 
                    then double-click nodes to connect them
                  </li>
                  <li>
                    <strong>Linking:</strong> Each node can only have one outgoing 
                    connection (next pointer)
                  </li>
                  <li>
                    <strong>Portal:</strong> Use the portal to submit your completed 
                    linked list for validation
                  </li>
                  <li>
                    <strong>Exercises:</strong> Complete 3 linking exercises with 
                    increasing difficulty
                  </li>
                  <li>
                    <strong>Strategy:</strong> Plan your connections carefully - 
                    the order determines the final linked list structure
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
import { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import styles from "./LinkingNode.module.css";
import tutorialStyles from "./TutorialScene.module.css";

// Tutorial Scene Component for Linking Nodes
function TutorialScene({ scene, onContinue, onValueShoot }) {
  // State for tutorial circles and connections
  const [tutorialCircles, setTutorialCircles] = useState([]);
  const [tutorialConnections, setTutorialConnections] = useState([]);
  const [cannonAngle, setCannonAngle] = useState(0);
  const [cannonCircle, setCannonCircle] = useState({ value: "42", address: "aa10" });
  const [tutorialBullets, setTutorialBullets] = useState([]);
  const [demoStep, setDemoStep] = useState(0);
  const [draggedCircle, setDraggedCircle] = useState(null); 
  const tutorialCirclesRef = useRef([]);
    // Handle right-click shooting in tutorial
  const handleTutorialRightClick = useCallback((e) => {
    if (scene !== 'scene3') return;
    
    e.preventDefault();
    
    // Calculate launch position from cannon tip
    const cannonTipX = window.innerWidth - 35;
    const cannonTipY = window.innerHeight - 1;
    
    // Calculate tip position based on cannon angle
    const tipDistance = 55;
    const angleRad = (cannonAngle) * (Math.PI / 180);
    const tipX = cannonTipX + Math.sin(angleRad) * tipDistance;
    const tipY = cannonTipY - Math.cos(angleRad) * tipDistance;
    
    // Calculate launch velocity based on cannon direction
    const launchSpeed = 6;
    const velocityX = Math.sin(angleRad) * launchSpeed;
    const velocityY = -Math.cos(angleRad) * launchSpeed;
    
    // Create new bullet with cannon values
    const newBullet = {
      id: Date.now(),
      x: tipX - 30,
      y: tipY - 30,
      value: cannonCircle.value,
      address: cannonCircle.address,
      velocityX: velocityX,
      velocityY: velocityY,
      isBullet: true,
      isLaunched: true,
    };
    
    setTutorialBullets(prev => [...prev, newBullet]);
  }, [scene, cannonAngle, cannonCircle]);

  // Bullet animation and collision detection for tutorial
  useEffect(() => {
    if (scene !== 'scene3') return;
    
    const animateFrame = () => {
      setTutorialBullets(prevBullets => {
        const updatedBullets = [];
        
        prevBullets.forEach(bullet => {
          // Update bullet position
          const newX = bullet.x + bullet.velocityX;
          const newY = bullet.y + bullet.velocityY;
          
          // Boundary collision - bullets bounce off edges
          let newVelocityX = bullet.velocityX;
          let newVelocityY = bullet.velocityY;
          let finalX = newX;
          let finalY = newY;
          
          if (newX <= 15 || newX >= window.innerWidth - 15) {
            newVelocityX = -newVelocityX;
            finalX = newX <= 15 ? 15 : window.innerWidth - 15;
          }
          
          if (newY <= 15 || newY >= window.innerHeight - 15) {
            newVelocityY = -newVelocityY;
            finalY = newY <= 15 ? 15 : window.innerHeight - 15;
          }

          // Check for collisions with tutorial circles
          let bulletHitSomething = false;
          
          const currentTutorialCircles = tutorialCirclesRef.current;
          for (let i = 0; i < currentTutorialCircles.length; i++) {
            const circle = currentTutorialCircles[i];

            const dx = finalX - circle.x;
            const dy = finalY - circle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 70) { // Collision threshold
              bulletHitSomething = true;

              // Calculate bounce direction for the hit circle
              const bounceStrength = 3;
              const bounceX = (circle.x - finalX) / distance * bounceStrength;
              const bounceY = (circle.y - finalY) / distance * bounceStrength;

              if (circle.isHead) {
                // Hit the head - insert before head (new node becomes head)
                const newCircle = {
                  id: `inserted_${Date.now()}`,
                  x: circle.x - 120, // Position to the left of current head
                  y: circle.y,
                  value: bullet.value,
                  address: bullet.address,
                  velocityX: -2, // Bounce left
                  velocityY: (Math.random() - 0.5) * 2, // Random vertical bounce
                  isLaunched: false,
                  isHead: true // New node becomes the head
                };

                // Update existing circles - remove head status from old head and add bounce
                setTutorialCircles(prevCircles => {
                  const updatedCircles = prevCircles.map(c => {
                    if (c.id === circle.id) {
                      return {
                        ...c,
                        isHead: false, // Remove head status
                        velocityX: bounceX, // Add bounce effect
                        velocityY: bounceY
                      };
                    }
                    return c;
                  });
                  return [...updatedCircles, newCircle];
                });

                // Create new connection (new head connects to old head)
                setTutorialConnections(prevConns => [
                  {
                    id: `new_conn_${Date.now()}`,
                    from: newCircle.id, // Connect from new head
                    to: circle.id // to old head
                  },
                  ...prevConns // Keep existing connections
                ]);

              } else if (circle.isTail) {
                // Hit the tail - insert after tail (new node becomes tail)
                const newCircle = {
                  id: `inserted_${Date.now()}`,
                  x: circle.x + 120, // Position to the right of current tail
                  y: circle.y,
                  value: bullet.value,
                  address: bullet.address,
                  velocityX: 2, // Bounce right
                  velocityY: (Math.random() - 0.5) * 2, // Random vertical bounce
                  isLaunched: false,
                  isTail: true // New node becomes the tail
                };

                // Update existing circles - remove tail status from old tail and add bounce
                setTutorialCircles(prevCircles => {
                  const updatedCircles = prevCircles.map(c => {
                    if (c.id === circle.id) {
                      return {
                        ...c,
                        isTail: false, // Remove tail status
                        velocityX: bounceX, // Add bounce effect
                        velocityY: bounceY
                      };
                    }
                    return c;
                  });
                  return [...updatedCircles, newCircle];
                });

                // Create new connection (old tail connects to new tail)
                setTutorialConnections(prevConns => [
                  ...prevConns, // Keep existing connections
                  {
                    id: `new_conn_${Date.now()}`,
                    from: circle.id, // Connect from old tail
                    to: newCircle.id // to new tail
                  }
                ]);

              } else {
                // Hit a middle node - insert after it
                const newCircle = {
                  id: `inserted_${Date.now()}`,
                  x: circle.x + 120, // Position to the right
                  y: circle.y,
                  value: bullet.value,
                  address: bullet.address,
                  velocityX: 2, // Bounce effect
                  velocityY: (Math.random() - 0.5) * 2, // Random vertical bounce
                  isLaunched: false
                };

                setTutorialCircles(prevCircles => {
                  const updatedCircles = prevCircles.map(c => {
                    if (c.id === circle.id) {
                      return {
                        ...c,
                        velocityX: bounceX, // Add bounce effect
                        velocityY: bounceY
                      };
                    }
                    return c;
                  });
                  return [...updatedCircles, newCircle];
                });

                // Update connections - need to handle insertion between nodes
                setTutorialConnections(prevConns => {
                  // Find connection that goes FROM the hit circle
                  const existingConnFromHit = prevConns.find(conn => conn.from === circle.id);
                  
                  if (existingConnFromHit) {
                    // Replace the connection with two new ones: hit->new, new->next
                    return [
                      ...prevConns.filter(conn => conn.id !== existingConnFromHit.id),
                      {
                        id: `new_conn_1_${Date.now()}`,
                        from: circle.id,
                        to: newCircle.id
                      },
                      {
                        id: `new_conn_2_${Date.now()}`,
                        from: newCircle.id,
                        to: existingConnFromHit.to
                      }
                    ];
                  } else {
                    // Just add connection from hit circle to new circle
                    return [
                      ...prevConns,
                      {
                        id: `new_conn_${Date.now()}`,
                        from: circle.id,
                        to: newCircle.id
                      }
                    ];
                  }
                });
              }

              // Notify parent component
              onValueShoot?.('collision');
              break;
            }
          }

          // Only keep bullets that didn't hit anything and are still on screen
          if (!bulletHitSomething && 
              finalX > -50 && finalX < window.innerWidth + 50 && 
              finalY > -50 && finalY < window.innerHeight + 50) {
            updatedBullets.push({
              ...bullet,
              x: finalX,
              y: finalY,
              velocityX: newVelocityX,
              velocityY: newVelocityY
            });
          }
        });
        
        return updatedBullets;
      });
    };

    const intervalId = setInterval(animateFrame, 16);
    return () => clearInterval(intervalId);
  }, [scene, onValueShoot]);
  // Update ref whenever tutorial circles change
  useEffect(() => {
    tutorialCirclesRef.current = tutorialCircles;
  }, [tutorialCircles]);

  // Initialize tutorial circles for linking demonstration
   useEffect(() => {
    if (scene === 'scene2') {
      // Create two isolated circles for linking demo
      const circles = [
        {
          id: 'demo1',
          x: 200,
          y: 200,
          value: "10",
          address: "bb20",
          velocityX: 0,
          velocityY: 0,
          isLaunched: false,
          isHead: true // Mark as head initially
        },
        {
          id: 'demo2',
          x: 500,
          y: 200,
          value: "20",
          address: "cc30",
          velocityX: 0,
          velocityY: 0,
          isLaunched: false,
          isTail: true // Mark as tail initially
        }
      ];
      
      setTutorialCircles(circles);
      setTutorialConnections([]);
      setDemoStep(0);
    } else if (scene === 'scene3') {
      // Create a simple chain for collision demo with head/tail labels
      const circles = [
        {
          id: 'chain1',
          x: 150,
          y: 300,
          value: "5",
          address: "dd40",
          velocityX: 0,
          velocityY: 0,
          isLaunched: false,
          isHead: true // Mark as head
        },
        {
          id: 'chain2',
          x: 300,
          y: 300,
          value: "15",
          address: "ee50",
          velocityX: 0,
          velocityY: 0,
          isLaunched: false,
          isTail: true // Mark as tail
        }
      ];
      
      setTutorialCircles(circles);
      setTutorialConnections([{
        id: 'conn1',
        from: 'chain1',
        to: 'chain2'
      }]);
      
      // Update cannon with a new node to insert
      setCannonCircle({ value: "25", address: "ff60" });
    }
  }, [scene]);

  // Demo animation for scene2 - show automatic linking
  useEffect(() => {
    if (scene === 'scene2' && demoStep === 0) {
      const timer = setTimeout(() => {
        // Animate demo2 moving towards demo1
        setTutorialCircles(prev => prev.map(circle => {
          if (circle.id === 'demo2') {
            // Calculate direction vector from demo2 to demo1
            const demo1 = prev.find(c => c.id === 'demo1');
            if (demo1) {
              const dx = demo1.x - circle.x;
              const dy = demo1.y - circle.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              // Normalize direction and set speed
              const speed = 2;
              const velocityX = (dx / distance) * speed;
              const velocityY = (dy / distance) * speed;
              
              return {
                ...circle,
                velocityX: velocityX,
                velocityY: velocityY,
                isLaunched: true
              };
            }
          }
          return circle;
        }));
        
        // After movement starts, check for collision
        const collisionTimer = setInterval(() => {
          setTutorialCircles(prev => {
            const demo1 = prev.find(c => c.id === 'demo1');
            const demo2 = prev.find(c => c.id === 'demo2');
            
            if (demo1 && demo2) {
              const dx = demo2.x - demo1.x;
              const dy = demo2.y - demo1.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              // Check if they're close enough to link
              if (distance < 80) {
                clearInterval(collisionTimer);
                
                // Create connection
                setTutorialConnections([{
                  id: 'demo_conn',
                  from: 'demo1',
                  to: 'demo2'
                }]);
                
                // Add bounce effect and finalize positions
                return prev.map(circle => {
                  if (circle.id === 'demo1') {
                    return {
                      ...circle,
                      velocityX: -1.5, // Bounce back
                      velocityY: 0,
                      isHead: true,
                      isTail: false
                    };
                  } else if (circle.id === 'demo2') {
                    return {
                      ...circle,
                      x: demo1.x + 150, // Position to the right of demo1
                      velocityX: 1.5, // Bounce forward
                      velocityY: 0,
                      isHead: false,
                      isTail: true
                    };
                  }
                  return circle;
                });
              }
            }
            return prev;
          });
        }, 50);
        
        // Cleanup timer after 5 seconds if collision doesn't happen
        setTimeout(() => {
          clearInterval(collisionTimer);
          setDemoStep(1);
        }, 5000);
        
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [scene, demoStep]);

  // Add physics animation for tutorial circles
  useEffect(() => {
    if (scene !== 'scene2') return;
    
    const animateFrame = () => {
      setTutorialCircles(prevCircles => {
        return prevCircles.map(circle => {
          if (draggedCircle && circle.id === draggedCircle.id) {
            return circle;
          }

          // Apply natural movement for launched circles - no friction in space!
          if (circle.isLaunched && (circle.velocityX || circle.velocityY)) {
            // No friction - circles float forever in space
            const newVelocityX = circle.velocityX;
            const newVelocityY = circle.velocityY;
            
            // Update position based on velocity
            const newX = circle.x + newVelocityX;
            const newY = circle.y + newVelocityY;
            
            // Remove circles that go off screen
            if (newX < -100 || newX > window.innerWidth + 100 || 
                newY < -100 || newY > window.innerHeight + 100) {
              return null; // Mark for removal
            }
            
            // Continue moving forever - no stopping in space!
            return {
              ...circle,
              x: newX,
              y: newY,
              velocityX: newVelocityX,
              velocityY: newVelocityY,
              launchTime: circle.launchTime || Date.now()
            };
          }

          // Add gentle floating movement to ALL circles (even stationary ones)
          if (!circle.isLaunched || (!circle.velocityX && !circle.velocityY)) {
            // Initialize gentle floating if not already set
            if (!circle.floatVelocityX || !circle.floatVelocityY) {
              // Random gentle drift in space
              const angle = Math.random() * 2 * Math.PI;
              const speed = 0.2 + Math.random() * 0.3; // Very slow floating speed (0.2 to 0.5 pixels per frame)
              circle.floatVelocityX = Math.cos(angle) * speed;
              circle.floatVelocityY = Math.sin(angle) * speed;
            }
            
            // Apply gentle floating movement
            const newX = circle.x + circle.floatVelocityX;
            const newY = circle.y + circle.floatVelocityY;
            
            // Gentle boundary bouncing for floating circles
            let newFloatVelocityX = circle.floatVelocityX;
            let newFloatVelocityY = circle.floatVelocityY;
            
            if (newX <= 30 || newX >= window.innerWidth - 30) {
              newFloatVelocityX = -newFloatVelocityX; // Reverse X direction
            }
            if (newY <= 30 || newY >= window.innerHeight - 30) {
              newFloatVelocityY = -newFloatVelocityY; // Reverse Y direction
            }
            
            // Keep within bounds
            const boundedX = Math.max(30, Math.min(window.innerWidth - 30, newX));
            const boundedY = Math.max(30, Math.min(window.innerHeight - 30, newY));
            
            return {
              ...circle,
              x: boundedX,
              y: boundedY,
              floatVelocityX: newFloatVelocityX,
              floatVelocityY: newFloatVelocityY
            };
          }

          return circle;
        }).filter(circle => circle !== null); // Remove null circles
      });
    };

    const intervalId = setInterval(animateFrame, 16);
    return () => clearInterval(intervalId);
  }, [scene]);
    // Add physics animation for tutorial circles in scene3
  useEffect(() => {
    if (scene !== 'scene3') return;
    
    const animateFrame = () => {
      setTutorialCircles(prevCircles => {
        return prevCircles.map(circle => {
          if (draggedCircle && circle.id === draggedCircle.id) {
            return circle;
          }

          // Apply natural movement for launched circles - no friction in space!
          if (circle.isLaunched && (circle.velocityX || circle.velocityY)) {
            // No friction - circles float forever in space
            const newVelocityX = circle.velocityX;
            const newVelocityY = circle.velocityY;
            
            // Update position based on velocity
            const newX = circle.x + newVelocityX;
            const newY = circle.y + newVelocityY;
            
            // Remove circles that go off screen
            if (newX < -100 || newX > window.innerWidth + 100 || 
                newY < -100 || newY > window.innerHeight + 100) {
              return null; // Mark for removal
            }
            
            // Continue moving forever - no stopping in space!
            return {
              ...circle,
              x: newX,
              y: newY,
              velocityX: newVelocityX,
              velocityY: newVelocityY,
              launchTime: circle.launchTime || Date.now()
            };
          }

          // Add gentle floating movement to ALL circles (even stationary ones)
          if (!circle.isLaunched || (!circle.velocityX && !circle.velocityY)) {
            // Initialize gentle floating if not already set
            if (!circle.floatVelocityX || !circle.floatVelocityY) {
              // Random gentle drift in space
              const angle = Math.random() * 2 * Math.PI;
              const speed = 0.2 + Math.random() * 0.3; // Very slow floating speed (0.2 to 0.5 pixels per frame)
              circle.floatVelocityX = Math.cos(angle) * speed;
              circle.floatVelocityY = Math.sin(angle) * speed;
            }
            
            // Apply gentle floating movement
            const newX = circle.x + circle.floatVelocityX;
            const newY = circle.y + circle.floatVelocityY;
            
            // Gentle boundary bouncing for floating circles
            let newFloatVelocityX = circle.floatVelocityX;
            let newFloatVelocityY = circle.floatVelocityY;
            
            if (newX <= 30 || newX >= window.innerWidth - 30) {
              newFloatVelocityX = -newFloatVelocityX; // Reverse X direction
            }
            if (newY <= 30 || newY >= window.innerHeight - 30) {
              newFloatVelocityY = -newFloatVelocityY; // Reverse Y direction
            }
            
            // Keep within bounds
            const boundedX = Math.max(30, Math.min(window.innerWidth - 30, newX));
            const boundedY = Math.max(30, Math.min(window.innerHeight - 30, newY));
            
            return {
              ...circle,
              x: boundedX,
              y: boundedY,
              floatVelocityX: newFloatVelocityX,
              floatVelocityY: newFloatVelocityY
            };
          }

          return circle;
        }).filter(circle => circle !== null); // Remove null circles
      });
    };

    const intervalId = setInterval(animateFrame, 16);
    return () => clearInterval(intervalId);
  }, [scene]);

  
  // Mouse movement for cannon rotation
  useEffect(() => {
  if (scene !== 'scene3') return;
  
  const handleMouseMove = (e) => {
    const cannonBaseX = window.innerWidth - 35;
    const cannonBaseY = window.innerHeight - 1;
    
    const deltaX = e.clientX - cannonBaseX;
    const deltaY = e.clientY - cannonBaseY;
    
    let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 90;
    // Remove the angle constraint to allow full 90-degree left rotation
    angle = Math.max(-90, Math.min(90, angle)); // Changed from -60,60 to -90,90
    setCannonAngle(angle);
  };

  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("contextmenu", handleTutorialRightClick);

  return () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("contextmenu", handleTutorialRightClick);
  };
}, [scene, handleTutorialRightClick]);

  if (scene === 'scene1') {
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
          <source src="./video/bubble_bg.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Tutorial Popup for Scene 1 */}
        <div className={tutorialStyles.tutorialOverlay}>
          <div className={tutorialStyles.tutorialPopup}>
            <div className={tutorialStyles.tutorialContent}>
              <h2>Welcome to Linking Nodes!</h2>
              <p>In this level, you'll learn how to connect nodes together to form a linked list.</p>
              <p>When two nodes collide, they automatically link together, creating a chain of connected data.</p>
              <p>Your goal is to create the exact linked list structure shown in the expected results.</p>
              <button 
                onClick={onContinue}
                className={tutorialStyles.tutorialButton}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (scene === 'scene2') {
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
          <source src="./video/bubble_bg.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Tutorial instruction bar */}
        <div className={tutorialStyles.tutorialInstructionBar}>
          <h3>Watch how nodes automatically link when they collide</h3>
        </div>

        {/* Tutorial Circles */}
        {tutorialCircles.map(circle => (
          <div
            key={circle.id}
            className={styles.animatedCircle}
            style={{
              left: `${circle.x - 30}px`,
              top: `${circle.y - 30}px`,
              cursor: 'default',
              boxShadow: circle.isHead 
                ? '0 0 15px rgba(255, 100, 0, 0.6)'
                : circle.isTail 
                  ? '0 0 15px rgba(0, 100, 255, 0.6)'
                  : '0 4px 8px rgba(0, 0, 0, 0.3)'
            }}
          >
            <span className={styles.circleValue}>{circle.value}</span>
            <span className={styles.circleAddress}>{circle.address}</span>
            
            {/* Head/Tail labels */}
            {(circle.isHead || circle.isTail) && (
              <div 
                style={{
                  position: 'absolute',
                  top: '-25px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: circle.isHead ? '#ff6435' : '#3564ff',
                  color: 'white',
                  padding: '2px 6px',
                  borderRadius: '10px',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                  zIndex: 1000
                }}
              >
                {circle.isHead ? 'head' : 'tail'}
              </div>
            )}
          </div>
        ))}

        {/* Tutorial Connections */}
        <svg className={styles.connectionLines}>
          {tutorialConnections.map((connection) => {
            const fromCircle = tutorialCircles.find(c => c.id === connection.from);
            const toCircle = tutorialCircles.find(c => c.id === connection.to);
            
            if (!fromCircle || !toCircle) return null;
            
            return (
              <g key={connection.id}>
                <line
                  x1={fromCircle.x}
                  y1={fromCircle.y}
                  x2={toCircle.x}
                  y2={toCircle.y}
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

        {/* Continue button appears after linking demo */}
        {demoStep >= 1 && (
          <div className={tutorialStyles.tutorialOverlay}>
            <div className={tutorialStyles.tutorialPopup}>
              <div className={tutorialStyles.tutorialContent}>
                <h2>Perfect!</h2>
                <p>You can see how the two nodes automatically connected when they collided.</p>
                <p>The arrow shows the direction of the link - from the head node to the tail node.</p>
                <p>Notice how they bounced slightly after connecting!</p>
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

  if (scene === 'scene3') {
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
          <source src="./video/bubble_bg.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Tutorial instruction bar */}
        <div className={tutorialStyles.tutorialInstructionBar}>
          <h3>Right-click to shoot a new node and extend the chain</h3>
        </div>

        {/* Cannon */}
        <div 
          className={styles.rightSquare} 
          style={{ 
            outlineOffset: "5px",
            transform: `rotate(${cannonAngle}deg)`,
            transformOrigin: "bottom center"
          }} 
        >
          <div className={styles.cannonCircle}>
            <span style={{ fontSize: '10px' }}>
              {cannonCircle.value}
            </span>
            <span style={{ fontSize: '8px' }}>
              {cannonCircle.address}
            </span>
          </div>
        </div>

        {/* Tutorial Circles */}
        {tutorialCircles.map(circle => (
          <div
            key={circle.id}
            className={styles.animatedCircle}
            style={{
              left: `${circle.x - 30}px`,
              top: `${circle.y - 30}px`,
              cursor: 'default',
              opacity: circle.id.startsWith('inserted') ? 1 : 0.9,
              boxShadow: circle.id.startsWith('inserted') 
                ? '0 0 15px rgba(0, 255, 0, 0.6)' 
                : circle.isHead 
                  ? '0 0 15px rgba(255, 100, 0, 0.6)'
                  : circle.isTail 
                    ? '0 0 15px rgba(0, 100, 255, 0.6)'
                    : '0 4px 8px rgba(0, 0, 0, 0.3)'
            }}
          >
            <span className={styles.circleValue}>{circle.value}</span>
            <span className={styles.circleAddress}>{circle.address}</span>
            
            {/* Head/Tail labels */}
            {(circle.isHead || circle.isTail) && (
              <div 
                style={{
                  position: 'absolute',
                  top: '-25px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: circle.isHead ? '#ff6435' : '#3564ff',
                  color: 'white',
                  padding: '2px 6px',
                  borderRadius: '10px',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                  zIndex: 1000
                }}
              >
                {circle.isHead ? 'head' : 'tail'}
              </div>
            )}
          </div>
        ))}

        {/* Tutorial Bullets */}
        {tutorialBullets.map(bullet => (
          <div
            key={bullet.id}
            className={styles.animatedCircle}
            style={{
              left: `${bullet.x}px`,
              top: `${bullet.y}px`,
              cursor: 'default',
              opacity: 0.9,
              boxShadow: '0 0 15px rgba(255, 255, 0, 0.6)',
            }}
          >
            <span className={styles.circleValue}>{bullet.value}</span>
            <span className={styles.circleAddress}>{bullet.address}</span>
          </div>
        ))}

        {/* Tutorial Connections */}
        <svg className={styles.connectionLines}>
          {tutorialConnections.map((connection) => {
            const fromCircle = tutorialCircles.find(c => c.id === connection.from);
            const toCircle = tutorialCircles.find(c => c.id === connection.to);
            
            if (!fromCircle || !toCircle) return null;
            
            return (
              <g key={connection.id}>
                <line
                  x1={fromCircle.x}
                  y1={fromCircle.y}
                  x2={toCircle.x}
                  y2={toCircle.y}
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

        {/* Continue button appears after successful insertion */}
        {tutorialCircles.length > 2 && (
          <div className={tutorialStyles.tutorialOverlay}>
            <div className={tutorialStyles.tutorialPopup}>
              <div className={tutorialStyles.tutorialContent}>
                <h2>Excellent!</h2>
                <p>You successfully added a new node to the chain! Notice how the tail label moved to the new node.</p>
                <p>The green glow shows the newly inserted node, and you can see how the chain extended.</p>
                <p>Now you're ready to start the real challenges!</p>
                <button 
                  onClick={onContinue}
                  className={tutorialStyles.tutorialButton}
                >
                  Start Game
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (scene === 'scene4') {
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
        <source src="./video/bubble_bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Game Instructions Popup */}
      <div className={tutorialStyles.gameInstructionsOverlay}>
        <div className={tutorialStyles.gameInstructionsPopup}>
          <div className={tutorialStyles.gameInstructionsContent}>
            <div className={tutorialStyles.gameInstructionsHeader}>
              <h2>Linking Nodes - Game Instructions</h2>
            </div>
            
            <div className={tutorialStyles.gameInstructionsBody}>
              <ul>
                <li><strong>Objective:</strong> Create the exact linked list structure shown in the expected results</li>
                <li><strong>Controls:</strong> Click the cannon to select bullets, right-click to shoot</li>
                <li><strong>Linking:</strong> Nodes automatically connect when they collide</li>
                <li><strong>Chain Rules:</strong> New nodes extend from the tail, colliding with head removes the node</li>
                <li><strong>Deletion:</strong> Click a node 5 times to delete it (shows progress circle)</li>
                <li><strong>Challenges:</strong> Avoid black holes that can destroy your nodes!</li>
                <li><strong>Portal:</strong> Complete chains get sucked into the portal for scoring</li>
              </ul>
            </div>
            
            <div className={tutorialStyles.gameInstructionsFooter}>
              <button 
                onClick={onContinue}
                className={tutorialStyles.tutorialButton}
              >
                Continue to Practice
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

  return null;
}

TutorialScene.propTypes = {
  scene: PropTypes.string.isRequired,
  onContinue: PropTypes.func.isRequired,
  onValueShoot: PropTypes.func,
};

export default TutorialScene;
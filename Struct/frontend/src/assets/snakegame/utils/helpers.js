export const generateFood = (snake = []) => {
    const food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    
    // Make sure food doesn't spawn on snake
    const isOnSnake = snake.some(segment => segment.x === food.x && segment.y === food.y);
    if (isOnSnake) return generateFood(snake);
    
    return food;
  };
  
  export const checkCollision = (position, snake) => {
    return (
      position.x < 0 || position.x >= GRID_SIZE ||
      position.y < 0 || position.y >= GRID_SIZE ||
      snake.some(segment => segment.x === position.x && segment.y === position.y)
    );
  };
import { useState, useEffect, useCallback, useRef } from "react";

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Position = { x: number; y: number };

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 3;

const getRandomPosition = (snake: Position[]): Position => {
  let pos: Position;
  do {
    pos = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snake.some((s) => s.x === pos.x && s.y === pos.y));
  return pos;
};

export const useSnakeGame = () => {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 10 });
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [isRunning, setIsRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem("snake-high-score");
    return saved ? parseInt(saved) : 0;
  });

  const directionRef = useRef(direction);
  const snakeRef = useRef(snake);
  directionRef.current = direction;
  snakeRef.current = snake;

  const resetGame = useCallback(() => {
    const initial = [{ x: 10, y: 10 }];
    setSnake(initial);
    setFood(getRandomPosition(initial));
    setDirection("RIGHT");
    setGameOver(false);
    setScore(0);
    setIsRunning(false);
  }, []);

  const startGame = useCallback(() => {
    if (gameOver) resetGame();
    setIsRunning(true);
  }, [gameOver, resetGame]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const key = e.key;
      if (key === " " || key === "Enter") {
        e.preventDefault();
        if (!isRunning) startGame();
        return;
      }

      const dir = directionRef.current;
      if ((key === "ArrowUp" || key === "w") && dir !== "DOWN") setDirection("UP");
      else if ((key === "ArrowDown" || key === "s") && dir !== "UP") setDirection("DOWN");
      else if ((key === "ArrowLeft" || key === "a") && dir !== "RIGHT") setDirection("LEFT");
      else if ((key === "ArrowRight" || key === "d") && dir !== "LEFT") setDirection("RIGHT");
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isRunning, startGame]);

  useEffect(() => {
    if (!isRunning) return;

    const speed = Math.max(50, INITIAL_SPEED - score * SPEED_INCREMENT);

    const interval = setInterval(() => {
      const currentSnake = snakeRef.current;
      const head = { ...currentSnake[0] };
      const dir = directionRef.current;

      if (dir === "UP") head.y -= 1;
      else if (dir === "DOWN") head.y += 1;
      else if (dir === "LEFT") head.x -= 1;
      else if (dir === "RIGHT") head.x += 1;

      // Wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setIsRunning(false);
        setGameOver(true);
        return;
      }

      // Self collision
      if (currentSnake.some((s) => s.x === head.x && s.y === head.y)) {
        setIsRunning(false);
        setGameOver(true);
        return;
      }

      const newSnake = [head, ...currentSnake];

      // Eat food
      if (head.x === food.x && head.y === food.y) {
        setScore((prev) => {
          const newScore = prev + 1;
          if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem("snake-high-score", String(newScore));
          }
          return newScore;
        });
        setFood(getRandomPosition(newSnake));
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    }, speed);

    return () => clearInterval(interval);
  }, [isRunning, food, score, highScore]);

  return {
    snake,
    food,
    score,
    highScore,
    isRunning,
    gameOver,
    gridSize: GRID_SIZE,
    startGame,
    resetGame,
    setDirection,
    direction: directionRef.current,
  };
};

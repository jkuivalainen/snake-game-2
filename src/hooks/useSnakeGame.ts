import { useState, useEffect, useCallback, useRef } from "react";

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Position = { x: number; y: number };

export const BRANDS = [
  { label: 'HS.fi', bg: '#0072bb', fg: '#fff',    pts: 1 },
  { label: 'IS.fi', bg: '#da2128', fg: '#fff',    pts: 2 },
  { label: 'B2B',   bg: '#FFCC00', fg: '#1a1a1a', pts: 3 },
] as const;

export type Brand = typeof BRANDS[number];
export type FoodItem = Position & { brand: Brand };

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 3;

const getRandomPosition = (snake: Position[], otherFoods: Position[]): Position => {
  let pos: Position;
  do {
    pos = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (
    snake.some((s) => s.x === pos.x && s.y === pos.y) ||
    otherFoods.some((f) => f.x === pos.x && f.y === pos.y)
  );
  return pos;
};

const makeInitialFoods = (snake: Position[]): FoodItem[] => {
  const foods: FoodItem[] = [];
  for (const brand of BRANDS) {
    const pos = getRandomPosition(snake, foods);
    foods.push({ ...pos, brand });
  }
  return foods;
};

export const useSnakeGame = () => {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [foods, setFoods] = useState<FoodItem[]>(() =>
    makeInitialFoods([{ x: 10, y: 10 }])
  );
  const [lastEaten, setLastEaten] = useState<string | null>(null);
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
  const foodsRef = useRef(foods);
  const scoreRef = useRef(score);
  const highScoreRef = useRef(highScore);
  directionRef.current = direction;
  snakeRef.current = snake;
  foodsRef.current = foods;
  scoreRef.current = score;
  highScoreRef.current = highScore;

  const resetGame = useCallback(() => {
    const initial = [{ x: 10, y: 10 }];
    setSnake(initial);
    setFoods(makeInitialFoods(initial));
    setLastEaten(null);
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

    const speed = Math.max(50, INITIAL_SPEED - scoreRef.current * SPEED_INCREMENT);

    const interval = setInterval(() => {
      const currentSnake = snakeRef.current;
      const currentFoods = foodsRef.current;
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

      // Check food collision
      const eatenIndex = currentFoods.findIndex(
        (f) => f.x === head.x && f.y === head.y
      );

      if (eatenIndex !== -1) {
        const eaten = currentFoods[eatenIndex];
        const pts = eaten.brand.pts;
        setLastEaten(eaten.brand.label);
        setScore((prev) => {
          const newScore = prev + pts;
          if (newScore > highScoreRef.current) {
            setHighScore(newScore);
            localStorage.setItem("snake-high-score", String(newScore));
          }
          return newScore;
        });
        // Respawn only the eaten tile
        const newFoods = [...currentFoods];
        const otherFoods = newFoods.filter((_, i) => i !== eatenIndex);
        const newPos = getRandomPosition(newSnake, otherFoods);
        newFoods[eatenIndex] = { ...newPos, brand: eaten.brand };
        setFoods(newFoods);
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    }, speed);

    return () => clearInterval(interval);
  }, [isRunning]);

  return {
    snake,
    foods,
    lastEaten,
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

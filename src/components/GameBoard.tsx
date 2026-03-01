import React from "react";

type Position = { x: number; y: number };

interface GameBoardProps {
  snake: Position[];
  food: Position;
  gridSize: number;
}

const CELL_SIZE = 20;

const GameBoard: React.FC<GameBoardProps> = ({ snake, food, gridSize }) => {
  const boardSize = gridSize * CELL_SIZE;

  return (
    <div
      className="relative border-2 border-primary neon-border rounded-sm"
      style={{ width: boardSize, height: boardSize }}
    >
      {/* Grid lines */}
      <div className="absolute inset-0 opacity-[0.04]">
        {Array.from({ length: gridSize }).map((_, i) => (
          <React.Fragment key={i}>
            <div
              className="absolute top-0 bottom-0 border-l border-primary"
              style={{ left: i * CELL_SIZE }}
            />
            <div
              className="absolute left-0 right-0 border-t border-primary"
              style={{ top: i * CELL_SIZE }}
            />
          </React.Fragment>
        ))}
      </div>

      {/* Snake */}
      {snake.map((segment, index) => (
        <div
          key={index}
          className="absolute rounded-[3px] transition-all duration-75"
          style={{
            left: segment.x * CELL_SIZE + 1,
            top: segment.y * CELL_SIZE + 1,
            width: CELL_SIZE - 2,
            height: CELL_SIZE - 2,
            backgroundColor: index === 0
              ? "hsl(120 100% 50%)"
              : `hsl(120 100% ${Math.max(30, 50 - index * 2)}%)`,
            boxShadow: index === 0
              ? "0 0 8px hsl(120 100% 50% / 0.8)"
              : "none",
          }}
        />
      ))}

      {/* Food */}
      <div
        className="absolute rounded-full animate-pulse"
        style={{
          left: food.x * CELL_SIZE + 2,
          top: food.y * CELL_SIZE + 2,
          width: CELL_SIZE - 4,
          height: CELL_SIZE - 4,
          backgroundColor: "hsl(0 80% 55%)",
          boxShadow: "var(--food-glow)",
        }}
      />
    </div>
  );
};

export default GameBoard;

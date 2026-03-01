import React from "react";
import type { FoodItem } from "@/hooks/useSnakeGame";

type Position = { x: number; y: number };

interface GameBoardProps {
  snake: Position[];
  foods: FoodItem[];
  gridSize: number;
}

const CELL_SIZE = 20;

const GameBoard: React.FC<GameBoardProps> = ({ snake, foods, gridSize }) => {
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

      {/* Brand food tiles */}
      {foods.map((f) => (
        <div
          key={f.brand.label}
          style={{
            position: 'absolute',
            left: f.x * CELL_SIZE + 1,
            top: f.y * CELL_SIZE + 1,
            width: CELL_SIZE - 2,
            height: CELL_SIZE - 2,
            backgroundColor: f.brand.bg,
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: f.brand.label.length > 3 ? 5 : 6,
            fontWeight: 'bold',
            color: f.brand.fg,
            fontFamily: 'Helvetica Neue, Arial, sans-serif',
          }}
        >
          {f.brand.label}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;

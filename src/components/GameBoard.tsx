import React from "react";
import type { FoodItem } from "@/hooks/useSnakeGame";
import tuomasPng from "/tuomas.png?url";

type Position = { x: number; y: number };

interface GameBoardProps {
  snake: Position[];
  foods: FoodItem[];
  gridSize: number;
  milestoneFlash: boolean;
}

const CELL_SIZE = 20;

/**
 * Renders the snake game board: grid lines (via CSS background),
 * snake segments, and brand food tiles.
 */
const GameBoard: React.FC<GameBoardProps> = ({ snake, foods, gridSize, milestoneFlash }) => {
  const boardSize = gridSize * CELL_SIZE;

  return (
    <div
      className="relative border-2 border-primary neon-border rounded-sm"
      style={{
        width: boardSize,
        height: boardSize,
        backgroundImage: `
          repeating-linear-gradient(to right, hsl(var(--primary)/0.04) 1px, transparent 1px),
          repeating-linear-gradient(to bottom, hsl(var(--primary)/0.04) 1px, transparent 1px)
        `,
        backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
      }}
    >
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

      {/* Tuomas milestone flash — covers the game area only */}
      {milestoneFlash && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
          style={{ animation: 'tuomas-flash 0.8s steps(1) forwards' }}
        >
          <img
            src={tuomasPng}
            alt="Tuomas"
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
          />
        </div>
      )}

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

export default React.memo(GameBoard);

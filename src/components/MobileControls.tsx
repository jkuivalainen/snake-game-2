import React from "react";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import type { Direction } from "@/hooks/useSnakeGame";

/** Prevents the snake from reversing direction — created once at module scope. */
const OPPOSITE_DIRECTION: Record<Direction, Direction> = {
  UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT",
};

interface MobileControlsProps {
  onDirection: (dir: Direction) => void;
  currentDirection: Direction;
}

/**
 * On-screen D-pad for mobile devices. Blocks reversals so the snake
 * cannot turn 180° and immediately collide with itself.
 */
const MobileControls: React.FC<MobileControlsProps> = ({ onDirection, currentDirection }) => {
  const btn = (dir: Direction, icon: React.ReactNode) => (
    <button
      onClick={() => {
        if (OPPOSITE_DIRECTION[dir] !== currentDirection) onDirection(dir);
      }}
      className="w-14 h-14 flex items-center justify-center rounded-lg border border-primary/40 bg-muted/50 text-primary active:bg-primary/20 transition-colors"
    >
      {icon}
    </button>
  );

  return (
    <div className="grid grid-cols-3 gap-1 w-fit mx-auto mt-4 md:hidden">
      <div />
      {btn("UP", <ArrowUp size={24} />)}
      <div />
      {btn("LEFT", <ArrowLeft size={24} />)}
      {btn("DOWN", <ArrowDown size={24} />)}
      {btn("RIGHT", <ArrowRight size={24} />)}
    </div>
  );
};

export default React.memo(MobileControls);

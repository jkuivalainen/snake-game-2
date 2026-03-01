import { useSnakeGame } from "@/hooks/useSnakeGame";
import GameBoard from "@/components/GameBoard";
import MobileControls from "@/components/MobileControls";

const Index = () => {
  const {
    snake,
    food,
    score,
    highScore,
    isRunning,
    gameOver,
    gridSize,
    startGame,
    setDirection,
    direction,
  } = useSnakeGame();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-6 px-4 py-8 select-none">
      <h1 className="font-pixel text-2xl md:text-4xl text-primary neon-text-strong tracking-wider">
        SNAKE
      </h1>

      <div className="flex gap-8 font-pixel text-xs md:text-sm">
        <div className="text-muted-foreground">
          SCORE <span className="text-primary neon-text ml-2">{score}</span>
        </div>
        <div className="text-muted-foreground">
          BEST <span className="text-accent neon-text ml-2">{highScore}</span>
        </div>
      </div>

      <GameBoard snake={snake} food={food} gridSize={gridSize} />

      {!isRunning && (
        <button
          onClick={startGame}
          className="font-pixel text-sm px-8 py-3 border-2 border-primary text-primary neon-border rounded hover:bg-primary/10 transition-colors"
        >
          {gameOver ? "PLAY AGAIN" : "START"}
        </button>
      )}

      {!isRunning && !gameOver && (
        <p className="text-muted-foreground text-xs font-pixel">
          PRESS SPACE OR ENTER
        </p>
      )}

      {gameOver && (
        <p className="font-pixel text-destructive text-sm animate-pulse">
          GAME OVER
        </p>
      )}

      <MobileControls onDirection={setDirection} currentDirection={direction} />

      <p className="text-muted-foreground text-xs hidden md:block">
        Use arrow keys or WASD to move
      </p>
    </main>
  );
};

export default Index;

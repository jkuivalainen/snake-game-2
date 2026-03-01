import { useSnakeGame } from "@/hooks/useSnakeGame";
import GameBoard from "@/components/GameBoard";
import MobileControls from "@/components/MobileControls";

const Index = () => {
  const {
    snake,
    foods,
    lastEaten,
    score,
    highScore,
    isRunning,
    gameOver,
    milestoneFlash,
    gridSize,
    startGame,
    setDirection,
    direction,
  } = useSnakeGame();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-6 px-4 py-8 select-none">
      {/* Tuomas milestone flash overlay — triggered every 5 points */}
      {milestoneFlash && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          style={{ animation: 'tuomas-flash 0.8s steps(1) forwards' }}
        >
          <img
            src="/tuomas.png"
            alt="Tuomas"
            style={{ maxWidth: '60vw', maxHeight: '60vh', objectFit: 'contain' }}
          />
        </div>
      )}
      <div className="flex flex-col items-center gap-0.5">
        <div style={{ border: '2.5px solid #e5e5e5', padding: '3px 8px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 900, letterSpacing: '0.35em' }}>
            sanoma
          </span>
        </div>
        <div style={{ fontSize: '0.65rem', fontStyle: 'italic', color: '#e5e5e5' }}>
          Aina tulee sanomista.
        </div>
      </div>

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
        <div className="text-muted-foreground">
          EATEN <span className="text-primary neon-text ml-2">{lastEaten ?? '—'}</span>
        </div>
      </div>

      <GameBoard snake={snake} foods={foods} gridSize={gridSize} />

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

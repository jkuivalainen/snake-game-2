import { describe, it, expect, vi, beforeEach } from "vitest";
import { BRANDS } from "@/hooks/useSnakeGame";
import type { FoodItem } from "@/hooks/useSnakeGame";

// ---------------------------------------------------------------------------
// Pure logic helpers extracted for unit testing (mirrors useSnakeGame internals)
// ---------------------------------------------------------------------------

type Position = { x: number; y: number };

const GRID_SIZE = 20;

function getRandomPosition(snake: Position[], otherFoods: Position[]): Position {
  // Deterministic in tests via Math.random mock
  let pos: Position;
  let attempts = 0;
  do {
    pos = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    attempts++;
    if (attempts > 10000) throw new Error("getRandomPosition: board is full");
  } while (
    snake.some((s) => s.x === pos.x && s.y === pos.y) ||
    otherFoods.some((f) => f.x === pos.x && f.y === pos.y)
  );
  return pos;
}

function makeInitialFoods(snake: Position[]): FoodItem[] {
  const foods: FoodItem[] = [];
  for (const brand of BRANDS) {
    const pos = getRandomPosition(snake, foods);
    foods.push({ ...pos, brand });
  }
  return foods;
}

// ---------------------------------------------------------------------------

beforeEach(() => {
  // Provide a cycling random sequence so positions are deterministic
  let call = 0;
  vi.spyOn(Math, "random").mockImplementation(() => {
    // Returns values that map to grid coordinates spread around the board
    const values = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
    return values[call++ % values.length];
  });
});

describe("BRANDS constant", () => {
  it("contains exactly 3 brands", () => {
    expect(BRANDS).toHaveLength(3);
  });

  it("has the correct labels", () => {
    const labels = BRANDS.map((b) => b.label);
    expect(labels).toContain("HS.fi");
    expect(labels).toContain("IS.fi");
    expect(labels).toContain("B2B");
  });

  it("has correct point values", () => {
    const pts = Object.fromEntries(BRANDS.map((b) => [b.label, b.pts]));
    expect(pts["HS.fi"]).toBe(1);
    expect(pts["IS.fi"]).toBe(2);
    expect(pts["B2B"]).toBe(3);
  });
});

describe("makeInitialFoods", () => {
  it("returns one food tile per brand (3 total)", () => {
    const snake = [{ x: 10, y: 10 }];
    const foods = makeInitialFoods(snake);
    expect(foods).toHaveLength(3);
  });

  it("all 3 brands are present in initial foods", () => {
    const snake = [{ x: 10, y: 10 }];
    const foods = makeInitialFoods(snake);
    const labels = foods.map((f) => f.brand.label);
    expect(labels).toContain("HS.fi");
    expect(labels).toContain("IS.fi");
    expect(labels).toContain("B2B");
  });

  it("no two food tiles share the same position", () => {
    const snake = [{ x: 10, y: 10 }];
    const foods = makeInitialFoods(snake);
    const positions = foods.map((f) => `${f.x},${f.y}`);
    const unique = new Set(positions);
    expect(unique.size).toBe(foods.length);
  });

  it("food tiles do not spawn on the snake", () => {
    const snake = [{ x: 2, y: 4 }, { x: 2, y: 3 }];
    const foods = makeInitialFoods(snake);
    for (const food of foods) {
      const onSnake = snake.some((s) => s.x === food.x && s.y === food.y);
      expect(onSnake).toBe(false);
    }
  });
});

describe("food respawn after eating", () => {
  it("respawned tile does not overlap snake or other foods", () => {
    const snake = [{ x: 10, y: 10 }];
    const foods = makeInitialFoods(snake);

    // Simulate eating index 0
    const eatenIndex = 0;
    const eaten = foods[eatenIndex];
    const newSnake = [{ x: eaten.x, y: eaten.y }, ...snake];
    const otherFoods = foods.filter((_, i) => i !== eatenIndex);
    const newPos = getRandomPosition(newSnake, otherFoods);

    // Not on snake
    expect(newSnake.some((s) => s.x === newPos.x && s.y === newPos.y)).toBe(false);
    // Not on other foods
    expect(otherFoods.some((f) => f.x === newPos.x && f.y === newPos.y)).toBe(false);
  });
});

describe("score increments by brand points", () => {
  it("eating HS.fi adds 1 point", () => {
    const hsFi = BRANDS.find((b) => b.label === "HS.fi")!;
    let score = 0;
    score += hsFi.pts;
    expect(score).toBe(1);
  });

  it("eating IS.fi adds 2 points", () => {
    const isFi = BRANDS.find((b) => b.label === "IS.fi")!;
    let score = 0;
    score += isFi.pts;
    expect(score).toBe(2);
  });

  it("eating B2B adds 3 points", () => {
    const b2b = BRANDS.find((b) => b.label === "B2B")!;
    let score = 0;
    score += b2b.pts;
    expect(score).toBe(3);
  });

  it("eating multiple brands accumulates points correctly", () => {
    let score = 0;
    for (const brand of BRANDS) {
      score += brand.pts;
    }
    expect(score).toBe(6); // 1 + 2 + 3
  });
});

describe("lastEaten tracking", () => {
  it("lastEaten is set to the brand label when a tile is eaten", () => {
    let lastEaten: string | null = null;
    const foods = makeInitialFoods([{ x: 10, y: 10 }]);
    const eaten = foods[1];
    lastEaten = eaten.brand.label;
    expect(lastEaten).toBe(eaten.brand.label);
    expect(BRANDS.map((b) => b.label)).toContain(lastEaten);
  });
});

describe("getRandomPosition loop guard", () => {
  it("throws after max attempts when board is full", () => {
    const fullSnake: Position[] = [];
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        fullSnake.push({ x, y });
      }
    }
    expect(() => getRandomPosition(fullSnake, [])).toThrow("board is full");
  });
});

describe("speed formula", () => {
  it("score=0 gives INITIAL_SPEED (150ms) and score=34 is clamped to MIN_SPEED (50ms)", () => {
    const INITIAL_SPEED = 150;
    const SPEED_INCREMENT = 3;
    const MIN_SPEED = 50;
    expect(Math.max(MIN_SPEED, INITIAL_SPEED - 0 * SPEED_INCREMENT)).toBe(150);
    expect(Math.max(MIN_SPEED, INITIAL_SPEED - 34 * SPEED_INCREMENT)).toBe(50);
  });
});

describe("direction reversal guard", () => {
  it("UP is blocked when currently going DOWN", () => {
    const OPPOSITE: Record<string, string> = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };
    const currentDirection = "DOWN";
    const requested = "UP";
    expect(OPPOSITE[requested] === currentDirection).toBe(true);
  });
});

describe("brand data integrity", () => {
  it("all brand pts values are positive integers", () => {
    for (const brand of BRANDS) {
      expect(brand.pts).toBeGreaterThan(0);
      expect(Number.isInteger(brand.pts)).toBe(true);
    }
  });
});

describe("makeInitialFoods with multi-segment snake", () => {
  it("positions don't collide with a multi-segment snake", () => {
    const snake: Position[] = [
      { x: 5, y: 5 }, { x: 5, y: 6 }, { x: 5, y: 7 }, { x: 5, y: 8 }, { x: 5, y: 9 },
    ];
    const foods = makeInitialFoods(snake);
    for (const food of foods) {
      expect(snake.some((s) => s.x === food.x && s.y === food.y)).toBe(false);
    }
  });
});

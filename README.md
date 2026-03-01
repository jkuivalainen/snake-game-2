# Snake Game 2

A browser-based Snake game with Sanoma branding, built with React, TypeScript, and Vite.

**Live:** https://jkuivalainen.github.io/snake-game-2/

## Features

- Classic snake gameplay with increasing speed as your score grows
- **3 branded food tiles** — HS.fi (1 pt), IS.fi (2 pts), B2B (3 pts) — each respawns independently when eaten
- Sanoma logo and "Aina tulee sanomista." tagline
- EATEN counter showing the last consumed brand
- Persistent high score via localStorage
- Keyboard (arrow keys / WASD) and on-screen mobile controls
- Retro neon pixel aesthetic

## Tech stack

- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- Vitest for unit tests
- GitHub Actions → GitHub Pages for deployment

## Development

```sh
npm install
npm run dev       # http://localhost:5173
npm run test      # run tests
npm run build     # production build
```

## Project structure

```
src/
  hooks/useSnakeGame.ts    # game loop, brand/food logic, state
  components/GameBoard.tsx # board rendering with brand tiles
  pages/Index.tsx          # layout: logo, scoreboard, controls
  test/useSnakeGame.test.ts
```

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Marvel Champions Quiz** — an interactive True/False web quiz about the Marvel Champions: The Card Game board game. Targets the Brazilian player community. See `prd.md` for full specification.

## Monorepo Structure

```
quiz-marvel-champions/
├── frontend/   # React 18 + Vite + TypeScript + Tailwind CSS
└── backend/    # Node.js 20 + Express + SQLite (better-sqlite3) + Drizzle ORM
```

## Commands

### Frontend (`frontend/`)
```bash
npm run dev        # Start Vite dev server
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # ESLint
```

### Backend (`backend/`)
```bash
npm run dev        # Start Express dev server (ts-node or tsx)
npm run build      # Compile TypeScript
npm run start      # Run compiled backend
npm run db:migrate # Run Drizzle migrations
npm run db:seed    # Seed database with initial questions
```

## Architecture

### Frontend
- **State management:** React Context + `useReducer` — no external state library
- **Routing:** React Router v6
- **HTTP:** native `fetch` or Axios via `src/services/api.ts`
- **Local persistence:** `localStorage` for personal ranking history and session cache
- Key hooks: `useQuiz` (quiz game loop logic), `useLocalRanking` (localStorage ranking)

### Backend
- **Entry point:** `src/index.ts` — Express app setup + CORS + routes
- **Database:** SQLite file at `data/quiz.db`, schema defined with Drizzle ORM in `src/db/schema.ts`
- **Validation:** Zod on all incoming request bodies/query params
- **Seed:** `src/db/seed.ts` — minimum 100 questions distributed across categories and difficulties

### Data Model
Two tables: `questions` and `scores` (see `prd.md` §7.3 for full DDL).

`questions` fields: `id`, `statement`, `answer` (boolean), `explanation`, `category` (`basic|heroes|villains|advanced|campaign`), `difficulty` (`beginner|intermediate|advanced`), `expansion` (nullable), `created_at`

`scores` fields: `id`, `nickname`, `score`, `total`, `streak`, `difficulty`, `created_at`

### API Endpoints
- `GET /api/questions` — fetch random questions; params: `difficulty`, `category`, `limit` (default 1), `exclude` (comma-separated IDs)
- `GET /api/ranking?difficulty=all` — top 10 scores per difficulty
- `POST /api/scores` — save session result (nickname, score, total, streak, difficulty)
- `GET /api/health` — health check

## Visual Identity
- **Colors:** Red `#D0021B`, gold `#F5A623`, dark blue `#1A237E`, black `#0A0A0A`, white `#FFFFFF`
- **Fonts:** `Bebas Neue` (headings) + `Nunito` (body)
- **Tokens:** True/False buttons styled as physical game tokens (circular, hero/villain symbols)
- **Animation:** Card-flip transition on answer reveal
- Mobile-first; breakpoints at 320px, 768px, 1024px+

## Environment Variables (Backend)
| Variable | Purpose |
|---|---|
| `PORT` | Express server port |
| `FRONTEND_URL` | Allowed CORS origin |
| `DATABASE_PATH` | Path to SQLite file |

# Repository Guidelines

## Project Structure & Modules
- Frontend only, built with Vite + React + TypeScript.
- Entry points: `src/index.tsx` (mount) and `src/App.tsx` (stateful UI, localStorage persistence).
- UI pieces live in `src/components/`; shared values in `src/constants.ts`; types in `src/types.ts`; CSV import/export helpers in `src/utils/csvParser.ts`.
- Static template `index.html` and Vite config `vite.config.ts` at root. Repo docs and plans live in `docs/`.

## Setup, Build, and Dev Commands
- From root: install deps `npm install`.
- Run locally `npm run dev` (Vite dev server, hot reload).
- Production bundle `npm run build`; preview the built output `npm run preview`.
- Set `GEMINI_API_KEY` in `.env.local` at root before running; the app reads it at start.

## Coding Style & Naming
- TypeScript with React hooks and function components; prefer `const` + arrow functions.
- Indent 2 spaces; single quotes; trailing commas where sensible. Keep components small and pure; avoid mutating state directly.
- Components and types use `PascalCase`; helpers `camelCase`; exported constants `SCREAMING_SNAKE_CASE`; files in `components/` use `PascalCase.tsx`.
- Use the existing path alias `@/*` (tsconfig) if you reorganize imports.

## Testing Guidelines
- No automated test suite yet; do manual QA for pagination, sorting, CSV import/export, favorites, and status changes after edits.
- When adding logic-heavy code, prefer adding lightweight React Testing Library or vitest coverage; name test files `*.test.ts(x)` alongside the module.

## Commit & Pull Request Guidelines
- Use concise, imperative commit messages (e.g., `Add CSV error handling`); group related changes together.
- PRs should include: a short summary, key screenshots/gifs for UI changes, and clear manual test steps (commands + scenarios exercised). Link to any tracking issue.

## Environment & Data Notes
- User data persists in `localStorage` keys `my_library_books` and `my_library_activities`; changes should maintain backward compatibility of stored shape.
- CSV import expects headers matching the seed data in `src/constants.ts`; update both seed and parser if schema changes. Preserve `ITEMS_PER_PAGE` pagination behavior when adjusting lists.*** End Patch**​

# JobHunter — Codebase Memory

Project understanding snapshot. Generated 2026-08-06 via codebase-analysis skill.

## Overview

Personal job-application tracker. **npm-workspaces monorepo** with a React 19 + TypeScript SPA (`frontend/`) and a Fastify 5 + Prisma 7 + SQLite API (`backend/`). Deployed via Docker (nginx frontend + backend container). Note: `AGENTS.md`/`CLAUDE.md` are **stale** — they describe a json-server-only SPA with Interviews/Offers as stubs; the repo has since grown a real backend and all four pages are fully implemented.

## Commands

- `npm run dev` — concurrently starts FE (5173) + BE (5174); Vite proxies `/api` → 5174
- `npm run build` / `build:backend` — frontend (tsc -b + vite build) / backend tsc build
- `npm run lint` — ESLint 9 flat config (`eslint.config.js`), prettier as error
- `npm run test:run` — FE vitest once (jsdom); `npm run test:backend` — BE vitest (node env)
- `npm run mock-api` — legacy json-server on 3001 (`frontend/db.json`) — NOT wired to the dev proxy
- To run a single FE test: `npx vitest run src/path/to/file.test.tsx`

## Code Structure Map

### Root
- `package.json` — workspaces `frontend`+`backend`; scripts delegate to both; only dep `concurrently`
- `eslint.config.js`, `.prettierrc` — flat config; no semicolons, single quotes, trailing commas, 100 print width
- `docker-compose.yml`, `.github/workflows/ci.yml` — CI: lint → FE test → BE test → both builds (Node 20; Dockerfiles use Node 22)
- `backend_plan.md`, `planning.md`, `progress.md`, `todo.json`, `harness.md` — project planning docs

### Frontend (`frontend/`, `@` alias → `./src`)
- `src/main.tsx` — entry: StrictMode → ThemeProvider → LanguageProvider → App; imports global.css + forms.css
- `src/App.tsx` — QueryClientProvider → BrowserRouter → Routes: `/` Dashboard, `/applications`, `/interviews`, `/offers` under shared `<Layout />`
- `src/api/` — `endpoints.ts` (fetch client + all types), `client.ts` (QueryClient: staleTime 5m, gcTime 10m, smart retry, mutations never retry), `errors.ts` (ApiError)
- `src/hooks/api.ts` — one hook per entity/op; mutations invalidate collections + `['dashboard']`; interview/offer ops also invalidate `['applications']`
- `src/app/` — `Layout.tsx` (Sidebar + Header + Outlet + mobile bottom nav), `Sidebar.tsx` (desktop fixed 260px), `Header.tsx` (decorative search + lang/theme toggle + avatar), `ThemeProvider.tsx` (localStorage + `data-theme` attr), `LanguageProvider.tsx` (en/zh, ~140 keys, `t()`)
- `src/pages/` — `Dashboard.tsx` (StatCards + CircularProgress + QuickAddFAB), `Applications.tsx` / `Interviews.tsx` / `Offers.tsx` (all full CRUD via DataTable + Modals)
- `src/components/` — `DataTable.tsx` (+`.css`, generic `Column<T>`), `Modal.tsx` (+`.css`), `StatCard.tsx`, `CircularProgress.tsx`, `QuickAddFAB.tsx`, `QuickAddModal.tsx` (tabbed app/interview/offer forms), `ApplicationDetail.tsx`, `InterviewDetail.tsx`, `OfferDetail.tsx`
- `src/styles/` — `variables.css` (design tokens, dark-first + `[data-theme=light]`), `forms.css`, `global.css` (Tailwind layers + custom)
- `src/utils/format.ts` — formatCurrency/formatDate/formatStatus
- `src/test/` — `setup.ts`, `utils/testWrapper.tsx` (createTestWrapper), hooks + 8 component + 3 page + 1 util test files

### Backend (`backend/`)
- `src/server.ts` / `src/app.ts` — Fastify app, routes registered under `/api/v1`
- `src/plugins/prisma.ts` — Prisma 7 client with better-sqlite3 driver adapter
- `src/routes/` — `applications.ts`, `interviews.ts`, `offers.ts`, `dashboard.ts`; interviews/offers denormalize `company`/`position` from linked application; creating interview→app status `interviewing`, offer→`offer`, deletes recompute status
- `src/schemas/` — Zod schemas for application/interview/offer
- `src/scripts/` — `migrate.ts`, `seed.ts`
- `src/test/` — `helpers/createTestApp.ts` (Fastify inject + mocked Prisma), route + schema tests
- `prisma/schema.prisma` + migrations; `prisma.config.ts` (SQLite via `DATABASE_URL` in `.env`); `docker-entrypoint.sh`

## Data Model

- **Application**: id, company, position, location, salary, status (`applied|interviewing|offer|rejected`), appliedDate, lastUpdated, notes, url
- **Interview**: id, applicationId, company, position, type (`phone_screen|technical|behavioral|portfolio_review|final`), scheduledDate, status (`scheduled|completed|cancelled`), notes, interviewer, location
- **Offer**: id, applicationId, company, position, salary, bonus, equity, benefits[], status (`pending|accepted|declined|expired`), receivedDate, expirationDate, notes
- **DashboardStats**: activeApplications, upcomingInterviews, pendingOffers, progressPct

## Architecture Patterns

- **Data flow**: page → React Query hook → `api.*` fetch → `/api/v1/*` → Fastify → Prisma/SQLite → paginated JSON unwrapped to arrays (`endpoints.ts:62`)
- **Broad invalidation** over optimistic updates; cross-entity invalidation because backend drives application status transitions
- **Modal-based CRUD**; `key={selected.id}` forces fresh form state; deletes via `window.confirm`
- **Hybrid styling**: Tailwind utilities + CSS-variable glassmorphism + inline `style` objects
- **i18n**: all copy via `t()`; localStorage-persisted en/zh
- **Testing**: jsdom FE suite (mock fetch or hooks module), node BE suite (mock Prisma via Fastify inject); no coverage thresholds

## Notable Facts / Known Gaps

- `useApplication(id)` hook (`hooks/api.ts:13-19`) defined but **unused** (dead code)
- `useUpdateOffer` (`hooks/api.ts:127-137`) does NOT invalidate `['applications']` while create/delete do — Applications list can go stale after offer edit
- Header search input + page filter buttons are decorative (no handlers)
- No 404 route / error boundary; no route lazy-loading
- Nav definitions duplicated across `App.tsx`, `Layout.tsx`, `Sidebar.tsx`
- Hardcoded accent colors (`bg-blue-600`) bypass theme variables; `forms.css` has light-theme fragility (hardcoded white rgba)
- `Modal.tsx` lacks Escape-key handling (AGENTS.md claims it exists)
- Types hand-duplicated: FE interfaces ↔ Zod schemas ↔ Prisma enums (drift risk)
- json-server/`db.json` + `npm run mock-api` are legacy; Vite proxy targets the real backend at 5174
- Vite config not merged with vitest config (separate `vitest.config.ts`)
- CI Node 20 vs Docker Node 22 divergence

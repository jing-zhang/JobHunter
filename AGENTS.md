# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start Vite dev server
- `npm run build` — TypeScript type check + Vite production build
- `npm run test` — Run vitest in watch mode
- `npm run test:run` — Run vitest once (CI mode)
- `npm run lint` — ESLint check across all source files
- `npm run mock-api` — Start json-server on port 3001 (uses `db.json`)
- `npm run preview` — Preview production build locally
- To run a single test file: `npx vitest run src/path/to/file.test.tsx`

## Architecture

React 19 + TypeScript SPA for tracking job applications, interviews, and offers. Uses a glassmorphism dark-first design system.

### Data Layer
- **json-server** (`db.json`) serves as the mock backend, running on port 3001
- **@tanstack/react-query** manages server state — custom hooks in `src/hooks/api.ts` wrap queries/mutations and auto-invalidate related query keys on success
- **Fetch-based API client** in `src/api/endpoints.ts` (no axios), types defined alongside endpoints
- Query keys follow the pattern: `['applications']`, `['applications', id]`, `['dashboard', 'stats']`

### Routing & Layout
- `react-router-dom` v7 with nested routes under a shared `<Layout />` component
- Layout embeds `<Sidebar />` (fixed left nav) and `<Header />` (search, theme toggle, notifications)
- Routes: `/` (Dashboard), `/applications`, `/interviews`, `/offers`
- `ThemeProvider` wraps the entire app using React Context with localStorage persistence

### Pages
- **Dashboard** (complete) — StatCard grid, CircularProgress, QuickAddFAB
- **Applications** (complete) — DataTable with search/filter, detail/edit modal, add modal, full CRUD
- **Interviews** (placeholder stub), **Offers** (placeholder stub) — pending implementation

### Components
- **DataTable** — Generic typed table with `Column<T>` config. Supports string key or custom render function accessors. Row click handler prop.
- **Modal** — Controlled overlay with title, body, optional footer. Click-outside-to-close and Escape handling.
- **StatCard** — Metric display card with icon, title, and value.
- **CircularProgress** — SVG donut chart, configurable size/stroke.
- **QuickAddModal** — Add application form inside Modal, uses `useCreateApplication` mutation.
- **ApplicationDetail** — Edit/delete form inside a Modal, uses `useUpdateApplication` and `useDeleteApplication`.

### Design System
- CSS variables in `src/styles/variables.css` define colors, radius, shadows, fonts
- Dark theme is default; light theme via `[data-theme="light"]` overrides
- Glassmorphism via `.glass` and `.glass-card` utility classes (backdrop-filter blur, semi-transparent backgrounds)
- Form styles centralized in `src/styles/forms.css` (`.form-input`, `.form-row`, `.btn-secondary`, `.btn-danger`)
- `@` path alias maps to `./src` (configured in both vite.config.ts and tsconfig.app.json)

### Testing
- vitest + jsdom + @testing-library/react + @testing-library/jest-dom
- Test setup in `src/test/setup.ts` (imports jest-dom matchers)
- API hooks tested by mocking `globalThis.fetch` directly
- Component tests render with necessary providers (QueryClientProvider, etc.)
- 9 test files covering Dashboard, DataTable, Modal, StatCard, CircularProgress, QuickAddFAB, QuickAddModal, ApplicationDetail, and API hooks

### Code Style
- No semicolons, single quotes, trailing commas, 100 print width (enforced by prettier)
- Use `import type` for type-only imports
- React functional components with explicit `React.FC` annotations

# JobHunter Front‑End Development Plan

## 1️⃣ Project Layout & Folder Structure
```
src/
│─ app/            # Layout components (Sidebar, Header, Layout, ThemeProvider)
│─ pages/          # Route pages: Dashboard, Applications, Interviews, Offers
│─ components/     # Reusable UI primitives (StatCard, CircularProgress, DataTable, StatusBadge, FAB, QuickAddModal)
│─ hooks/          # Custom React‑Query hooks (useApplications, useInterviews, useOffers)
│─ api/            # API client wrappers (client.ts, endpoints.ts)
│─ styles/         # CSS variables, global styles, utilities
│─ types/          # TypeScript interfaces (Application, Interview, Offer)
│─ utils/          # Small helpers (date formatting, copy‑to‑clipboard)
public/            # Static assets (favicon, logo)
mock/              # JSON‑Server / MockAPI config (db.json, routes.json)
tests/             # Vitest unit & component tests
vite.config.ts    # Vite configuration (alias @ → src/)
tsconfig.json     # TypeScript config
package.json       # Scripts & dependencies
```

## 2️⃣ Design System (CSS Variables)
```css
/* src/styles/variables.css */
:root {
  --color-bg: #0d1117;
  --color-surface: #1a202c;
  --color-primary: #0ea5e9;
  --color-primary-light: #38bdf8;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
  --color-text-primary: #f3f4f6;
  --color-text-secondary: #9ca3af;
  --radius: .75rem;
  --shadow-glass: 0 8px 32px rgba(0,0,0,.25);
  --font-sans: 'Inter', system-ui, sans-serif;
}
```
*Glassmorphism* is applied via `backdrop-filter: blur(8px)` on cards.

## 3️⃣ Routing & Navigation (React‑Router‑Dom)
| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `Dashboard` | Overview cards, progress circles |
| `/applications` | `Applications` | Table of all applications |
| `/interviews` | `Interviews` | Upcoming interviews |
| `/offers` | `Offers` | Offer comparison |
All pages wrapped by `Layout` (persistent `Sidebar` + `Header`).

## 4️⃣ State & Data Fetching
| Concern | Tool | Reason |
|---------|------|--------|
| Global UI (theme, profile) | React Context (`ThemeProvider`) | Simple, no extra deps |
| Server data | React‑Query (`useQuery`, `useMutation`) | Caching, optimistic updates |
| Form state | Local component state (`useState`) – optional `react-hook-form` | Lightweight validation |

**MockAPI** (or `json-server`) will expose the same REST contract as the future backend.

## 5️⃣ Core Components (Blueprint)
- **Layout** – wraps pages, provides ThemeProvider.
- **Sidebar** – navigation icons (`lucide-react`), active link styling.
- **StatCard** – numeric metric with icon.
- **CircularProgress** – SVG donut showing overall progress.
- **DataTable** – generic sortable, paginated table.
- **StatusBadge** – colour‑coded status indicator.
- **FAB** – floating action button launching **QuickAddModal** (tabs for Application / Interview / Offer).

## 6️⃣ Future Backend API Spec
| Method | URL | Request | Response | Description |
|--------|-----|---------|----------|-------------|
| GET | `/api/v1/dashboard/stats` | – | `{ activeApplications, upcomingInterviews, progressPct }` | Dashboard summary |
| GET | `/api/v1/applications` | `?page=&size=&sort=` | `Application[]` | List with filters |
| POST | `/api/v1/applications` | `ApplicationCreate` | `Application` | Create new job app |
| GET | `/api/v1/applications/:id` | – | `ApplicationDetail` | Detail view |
| PATCH | `/api/v1/applications/:id/status` | `{ status }` | `Application` | Update stage |
| DELETE | `/api/v1/applications/:id` | – | `{ success:true }` | Remove |
| GET | `/api/v1/interviews` | `?upcoming=true` | `Interview[]` | List interviews |
| POST | `/api/v1/interviews` | `InterviewCreate` | `Interview` | Add |
| GET | `/api/v1/offers` | – | `Offer[]` | List offers |
| POST | `/api/v1/offers` | `OfferCreate` | `Offer` | Add |
| PATCH | `/api/v1/offers/:id/status` | `{ status }` | `Offer` | Update |
All endpoints return standard HTTP status codes (`200`, `201`, `400`, `404`, `500`).

## 7️⃣ Testing Strategy
- **Unit** – Vitest (`utils`, `hooks`).
- **Component** – React Testing Library.
- **Data fetching** – MSW to mock API.
- **E2E (optional)** – Playwright.
- Target coverage **≥ 85 %**.

## 8️⃣ CI / Deployment Pipeline
1. **Pre‑commit** – `husky` + `lint‑staged` (eslint, prettier, vitest).
2. **GitHub Actions** –
   - `build` (`npm run build`).
   - `test` (`npm run test`).
   - `lint` (`npm run lint`).
3. **Deploy** – Vite `dist/` to Netlify/Vercel/Azure.
4. **Versioning** – `standard-version` for semantic releases.

## 9️⃣ Milestones & Timeline (working days)
| Milestone | Tasks | Days |
|----------|-------|------|
| M0 – Planning | – | 0 |
| M1 – Scaffold | Vite init, TS, lint | 1 |
| M2 – Design System | CSS vars, global styles, theme toggle | 1 |
| M3 – Layout & Nav | Sidebar, Header, routes | 1 |
| M4 – Mock API | `json-server` config, React‑Query client | 1 |
| M5 – Dashboard | StatCard, CircularProgress, QuickAddModal | 2 |
| M6 – Applications | DataTable, CRUD hooks, filters | 2 |
| M7 – Interviews / Offers | Tables, calendar view, add‑modal reuse | 2 |
| M8 – Testing | Unit & component tests, CI config | 2 |
| M9 – Polish & Docs | Accessibility, responsive breakpoints, docs | 1 |
| M10 – Production Build | Vite build, CI validation, optional deployment | 1 |
**Total ≈ 13 days**.

## 10️⃣ Next Steps
- Approve the plan.
- Initialise Git repo under `d:\SourceCode\playground\JobHunter`.
- Run the scaffold command: `npx -y create-vite@latest . --template react-ts`.
- Add dev dependencies (`eslint`, `prettier`, `vitest`, `react-query`, `lucide-react`, etc.).
- Commit the initial skeleton and start implementing the layout.

---
*This file lives at `d:\SourceCode\playground\JobHunter\planning.md`.*

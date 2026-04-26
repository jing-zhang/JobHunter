# JobHunter

A modern, responsive, and fully-featured application for tracking your job hunt progress. Built with a React + Vite frontend and a Fastify + Prisma + SQLite backend.

## Features

- **Dashboard**: Get a birds-eye view of your job hunt progress with beautiful circular progress indicators and real-time statistics.
- **Applications Tracking**: Keep track of every job you've applied to, with details like position, company, salary, and status.
- **Interviews Management**: Schedule and track upcoming interviews, separating them from past ones.
- **Offer Comparison**: Compare job offers with detailed metrics like equity, bonus, and benefits.
- **Responsive Design**: Fully usable on both desktop and mobile devices.
- **Dark/Light Mode**: First-class support for theming using a custom ThemeProvider.
- **Accessibility**: ARIA labels and semantic HTML for screen reader compatibility.

## Technology Stack

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS + custom CSS variables (glassmorphism)
- **State Management**: React Query (server state) + Context API (theme state)
- **Routing**: React Router DOM v7
- **Icons**: Lucide React
- **Testing**: Vitest + React Testing Library

### Backend
- **Framework**: Fastify
- **Language**: TypeScript
- **ORM**: Prisma 7
- **Database**: SQLite (via `@prisma/adapter-better-sqlite3`)
- **Validation**: Zod
- **Logging**: Pino

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation

```bash
npm install
```

### Initialize the database

```bash
npm -w backend run prisma:migrate
```

### Running the application

You'll need two terminal windows to run both the frontend and backend servers simultaneously.

**Terminal 1: Backend**
```bash
npm run dev:backend
```
*The backend API starts on `http://localhost:3001`.*

**Terminal 2: Frontend**
```bash
npm run dev
```
*The frontend starts on `http://localhost:5173`.*

### Project layout

- `frontend/` — React + Vite SPA
- `backend/` — Fastify + Prisma API

## Testing

```bash
npm run test
```

Coverage:
```bash
npm run test:coverage
```

Backend tests:
```bash
npm run test:backend
```

## License

MIT

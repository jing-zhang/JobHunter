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

Optionally seed with sample data:
```bash
npm -w backend run seed
```

### Running the application

Start both frontend and backend concurrently:

```bash
npm run dev
```

This starts:
- **Frontend** on `http://localhost:5173`
- **Backend API** on `http://localhost:5174`

Or run them separately in two terminals:

**Terminal 1: Backend**
```bash
npm run dev:backend
```

**Terminal 2: Frontend**
```bash
npm run dev:frontend
```

### Production build

```bash
# Build both frontend and backend
npm run build
npm run build:backend

# Preview frontend build
npm run preview
```

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

# JobHunter 🚀

A modern, responsive, and fully-featured application for tracking your job hunt progress. Built with a React + Vite frontend and a Fastify + Prisma + SQLite backend.

## 🌟 Features

- **Dashboard**: Get a birds-eye view of your job hunt progress with beautiful circular progress indicators and real-time statistics.
- **Applications Tracking**: Keep track of every job you've applied to, with details like position, company, salary, and status.
- **Interviews Management**: Schedule and track upcoming interviews, separating them from past ones.
- **Offer Comparison**: Compare job offers with detailed metrics like equity, bonus, and benefits.
- **Responsive Design**: fully usable on both desktop and mobile devices.
- **Dark/Light Mode**: First-class support for theming using a custom ThemeProvider.
- **Accessibility**: ARIA labels and semantic HTML for screen reader compatibility.

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom CSS Variables (Glassmorphism)
- **State Management**: React Query (Server State), Context API (Theme State)
- **Routing**: React Router DOM v6
- **Icons**: Lucide React
- **Testing**: Vitest + React Testing Library

### Backend
- **Framework**: Fastify
- **Language**: TypeScript
- **ORM**: Prisma 7
- **Database**: SQLite (via `@prisma/adapter-better-sqlite3`)
- **Validation**: Zod
- **Logging**: Pino

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation

1. **Clone the repository** (if applicable) and navigate to the root directory:
   ```bash
   cd JobHunter
   ```

2. **Install frontend dependencies**:
   ```bash
   npm install
   ```

3. **Install backend dependencies**:
   ```bash
   cd backend
   npm install
   ```

4. **Initialize the database**:
   ```bash
   npx prisma migrate dev
   ```

### Running the Application

You'll need two terminal windows to run both the frontend and backend servers simultaneously.

**Terminal 1: Backend Server**
```bash
cd backend
npm run dev
```
*The backend API will start on `http://localhost:3001`.*

**Terminal 2: Frontend App**
```bash
# From the project root
npm run dev
```
*The React app will start on `http://localhost:5173`.*

## 🧪 Testing

The project maintains a high test coverage for critical UI components and custom hooks.

To run the test suite:
```bash
npm run test
```

To run tests with coverage reporting:
```bash
npm run coverage
```

## 🏗️ Architecture

- **Glassmorphism UI**: Uses CSS backdrop-filters mixed with Tailwind classes to create a beautiful frosted-glass effect across cards and overlays.
- **React Query Hooks**: Data fetching is abstracted into custom hooks (`useApplications`, `useInterviews`, etc.) ensuring components remain clean and focused on rendering.
- **Relational Backend**: The Prisma schema tightly couples Applications to Interviews and Offers, allowing complex queries (like Dashboard stats) to be resolved efficiently.

## 📜 License
MIT

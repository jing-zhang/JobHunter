# Engineering Harness: JobHunter

This document defines the engineering standards and testing strategies for the JobHunter project.

## 🛠 Tech Stack
- **Frontend**: React 18, Vite, TypeScript
- **Styling**: Vanilla CSS (Custom Properties / Variables)
- **Routing**: React Router 6
- **State/Data**: TanStack Query (React Query)
- **Icons**: Lucide React
- **Mocking**: MockAPI.io / json-server / MSW
- **Testing**: Vitest, React Testing Library

## 🧪 Testing Strategy
All core logic and UI components must be covered by tests.
- **Unit Tests**: Business logic, utility functions, and custom hooks.
- **Integration Tests**: Component interactions and data flow.
- **Mocking**: Use MSW for intercepting network requests during tests.

## 🏗 Coding Standards
- **Component Structure**: Functional components using hooks.
- **Styling**: Prefer CSS variables in `variables.css` for consistent design. Use BEM or simple semantic classes.
- **File Naming**: PascalCase for components (`StatCard.tsx`), camelCase for hooks and utils (`useApplications.ts`).

## 🔄 Development Workflow
1. **Plan**: Update `planning.md` if scope changes.
2. **Execute**: Work through `todo.json` tasks.
3. **Verify**: Run `npm run test` before committing.
4. **Update**: Mark progress in `progress.md`.

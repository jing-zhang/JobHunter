# JobHunter Frontend - Comprehensive Codebase Analysis

## Project Overview

JobHunter is a React-based job search management application designed to help users track their job applications, interviews, and offers throughout their job hunting journey. The frontend is a modern, type-safe application built with React 19, TypeScript, and Vite.

**Project Type:** React 19 + TypeScript + Vite  
**Purpose:** Job application tracking and management dashboard  
**Status:** Active development (v0.0.0)

---

## Structure

### Directory Organization

```
frontend/
├── public/              # Static assets
├── src/
│   ├── api/            # API client and endpoint definitions
│   ├── app/            # Application shell (Layout, Header, Sidebar, Providers)
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page-level containers (Dashboard, Applications, Interviews, Offers)
│   ├── hooks/          # Custom React hooks (API integration)
│   ├── styles/         # Global and component-specific styling
│   ├── utils/          # Utility functions (formatting, helpers)
│   ├── test/           # Test files matching src structure
│   ├── assets/         # Images and visual assets
│   ├── App.tsx         # Root application component
│   └── main.tsx        # Application entry point
├── vite.config.ts      # Vite build configuration
├── tsconfig.json       # TypeScript configuration
├── tailwind.config.js  # Tailwind CSS configuration
├── vitest.config.ts    # Testing configuration
└── package.json        # Dependencies and scripts
```

### Module Boundaries

- **api/** - Isolated API client layer with centralized endpoint definitions
- **app/** - Shell components providing layout and context providers
- **components/** - Reusable, composable UI components
- **pages/** - Page-level containers that orchestrate components and data
- **hooks/** - React Query hooks wrapping API endpoints for data management
- **styles/** - Organized CSS with Tailwind and custom variables

---

## Patterns

### Architectural Style

**Layered Architecture with React Query Data Management**

The application follows a clear layered architecture:

1. **Presentation Layer** (components/, pages/)
   - React components with isolated responsibilities
   - Pages compose smaller components to build features
   - Reusable UI components (DataTable, Modal, StatCard)

2. **Data Access Layer** (api/, hooks/)
   - Centralized API client configuration
   - React Query for state management and caching
   - Custom hooks abstracting query/mutation logic

3. **Shell Layer** (app/)
   - Layout and navigation structure
   - Context providers (Theme, Language, React Query)
   - Header and Sidebar navigation

### Design Patterns

#### 1. **React Query Pattern**
- Centralized `queryClient` in `api/client.ts`
- Custom hooks (useApplications, useDashboardStats) wrap `useQuery`/`useMutation`
- Automatic cache invalidation on mutations
- Built-in retry logic with configurable behavior

```typescript
// Example: Applications data hook
export const useApplications = () => {
  return useQuery({
    queryKey: ['applications'],
    queryFn: api.getApplications,
  })
}

// Mutations invalidate related caches
export const useCreateApplication = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.createApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
```

#### 2. **Generic Component Pattern**
- `DataTable` component accepts `Column[]` interface
- `Modal` wrapper for detail views
- `StatCard` for dashboard statistics
- Composable and reusable across pages

#### 3. **Context Provider Pattern**
- `ThemeProvider` - light/dark mode management
- `LanguageProvider` - i18n support (English/中文)
- Providers composed in `main.tsx` entry point

#### 4. **Floating Action Button (FAB) Pattern**
- `QuickAddFAB` for rapid data entry
- `QuickAddModal` for form interactions
- Accessible quick action pattern

### Data Flow

#### Application Data Flow

```
User Action (e.g., create application)
  ↓
Component calls mutation hook
  ↓
useCreateApplication() → api.createApplication()
  ↓
POST request via queryClient
  ↓
Server response
  ↓
Query invalidation (applications + dashboard)
  ↓
Automatic cache refetch
  ↓
UI updates with fresh data
```

#### Query Key Strategy

Query keys are organized hierarchically:
- `['applications']` - All applications list
- `['applications', id]` - Single application
- `['interviews']` - All interviews list
- `['offers']` - All offers list
- `['dashboard', 'stats']` - Dashboard statistics

Mutations on any entity invalidate:
- The entity's own queries
- Related entity queries (e.g., creating an interview also invalidates applications)
- Dashboard stats

#### Page Data Requirements

- **Dashboard** - Fetches `useDashboardStats()` for overview metrics
- **Applications** - Fetches `useApplications()` with filtering/search
- **Interviews** - Fetches `useInterviews()` with details display
- **Offers** - Fetches `useOffers()` with financial comparison features

### Code Organization Patterns

#### Component Structure
```typescript
// Reusable component with props interface
interface DataTableColumn<T> {
  header: string
  accessor: keyof T
  // ... column configuration
}

const DataTable = <T,>({ columns, data }: Props<T>) => {
  // Generic, reusable table implementation
}
```

#### Page Composition
```typescript
// Pages use multiple hooks and compose components
const Applications = () => {
  const { data: apps, isLoading, error } = useApplications()
  const deleteApp = useDeleteApplication()
  
  return (
    <>
      <DataTable columns={columns} data={apps} />
      <QuickAddFAB />
      <ApplicationDetail />
    </>
  )
}
```

#### Error Handling
- API layer provides custom `ApiError` class
- Components receive error state from hooks
- User-facing error messages via UI components

---

## Technology Decisions

### Core Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^19.2.5 | UI framework |
| react-dom | ^19.2.5 | DOM rendering |
| react-router-dom | ^7.14.2 | Client-side routing |
| @tanstack/react-query | ^5.99.2 | State/data management |
| lucide-react | ^1.8.0 | Icon library |
| tailwindcss | ^3.4.19 | Utility CSS framework |
| typescript | ~6.0.2 | Type safety |

### Build & Development

- **Vite** (v8) - Fast build tool and dev server
- **TypeScript** - Static typing for reliability
- **Vitest** - Unit testing framework
- **Tailwind CSS** - Utility-first styling
- **PostCSS** - CSS processing
- **json-server** - Mock API server for development

### Testing Infrastructure

- **Vitest** - Fast unit test runner
- **React Testing Library** - Component testing
- **JSDOM** - DOM simulation for tests
- Coverage tracking with Vitest coverage plugin

### Development Scripts

```json
{
  "dev": "vite",                    // Start dev server
  "build": "tsc -b && vite build",  // Type check & build
  "lint": "eslint .",               // Code linting
  "mock-api": "json-server ...",    // Mock backend server
  "test": "vitest",                 // Watch mode tests
  "test:run": "vitest run",         // Single test run
  "test:coverage": "vitest run --coverage"  // Coverage report
}
```

---

## Application Flows

### Navigation Flow

```
App.tsx (Route Setup)
  ↓
Layout (Sidebar + Header)
  ↓
Pages:
  - Dashboard (/)
  - Applications (/applications)
  - Interviews (/interviews)
  - Offers (/offers)
```

**Navigation Components:**
- Desktop: Sidebar (vertical navigation)
- Mobile: Bottom navigation + Header
- Responsive design with breakpoints

**Header Features:**
- Search functionality
- Language toggle (EN / 中文)
- Theme toggle (light/dark)
- User profile section

### State Management Flow

```
QueryClient (cache layer)
  ↓
Custom Hooks (useApplications, etc.)
  ↓
Components (read query status, dispatch mutations)
  ↓
Event Handlers (trigger mutations)
  ↓
API Requests
  ↓
Query Invalidation
  ↓
Automatic refetch & UI update
```

### Feature Workflows

#### Creating an Application
1. User clicks QuickAddFAB or "Add" button
2. QuickAddModal opens
3. Form submission calls `useCreateApplication()`
4. Mutation sends POST to `/applications`
5. Cache invalidation triggers refetch
6. Applications list and Dashboard update automatically

#### Viewing Application Details
1. User clicks on application row in DataTable
2. ApplicationDetail modal opens
3. Displays formatted application data
4. Edit/Delete buttons trigger mutations
5. Changes immediately reflect in main list

#### Filtering & Search
- DataTable supports column filtering
- Real-time search across applications/interviews/offers
- Client-side filtering on fetched data

---

## Data Models

### Core Entities

**Application**
```typescript
{
  id: number
  company: string
  position: string
  status: 'applied' | 'rejected' | 'offer' | 'accepted'
  appliedDate: string
  // ... additional fields
}
```

**Interview**
```typescript
{
  id: number
  company: string
  position: string
  interviewer?: string
  date: string
  notes?: string
  // ... additional fields
}
```

**Offer**
```typescript
{
  id: number
  company: string
  position: string
  salary: number
  bonus?: number
  equity?: number
  expirationDate: string
  // ... additional fields
}
```

**DashboardStats**
```typescript
{
  totalApplications: number
  pendingApplications: number
  upcomingInterviews: number
  pendingOffers: number
  acceptanceRate: number
  // ... calculated metrics
}
```

---

## Deployment & DevOps

### Docker Support
- `Dockerfile` - Container configuration for production
- `nginx.conf` - Nginx reverse proxy configuration
- Optimized for containerized deployment

### Build Output
- Production build: optimized bundles
- TypeScript compilation before build
- Static asset optimization

---

## Key Files Reference

| File | Purpose |
|------|---------|
| src/App.tsx | Root component with routing setup |
| src/main.tsx | Entry point with context providers |
| src/api/client.ts | QueryClient configuration |
| src/api/endpoints.ts | API functions and data types |
| src/hooks/api.ts | React Query hooks layer |
| src/app/Layout.tsx | Main layout with responsive nav |
| src/components/DataTable.tsx | Generic table component |
| src/components/Modal.tsx | Modal wrapper |
| src/pages/Dashboard.tsx | Dashboard overview page |
| src/pages/Applications.tsx | Applications management page |
| src/pages/Interviews.tsx | Interviews tracking page |
| src/pages/Offers.tsx | Offers comparison page |

---

## Development Workflow

### Getting Started
```bash
npm install                 # Install dependencies
npm run mock-api           # Start mock backend (port 3001)
npm run dev                # Start dev server (port 5173)
```

### Testing
```bash
npm test                   # Run tests in watch mode
npm run test:run          # Run tests once
npm run test:coverage     # Generate coverage report
```

### Build
```bash
npm run build              # Build for production
npm run lint               # Check code quality
```

---

## Integration Points

### Backend API Contract
- Mock API runs on `http://localhost:3001`
- Uses json-server for development
- Production backend URL configurable via environment

### API Endpoints Pattern
- RESTful CRUD operations
- JSON request/response format
- Query string parameters for filtering

### Error Handling Strategy
- Custom `ApiError` class for type-safe errors
- Component-level error state management
- User-facing error messages in UI

---

## Code Quality & Testing

### Type Safety
- Full TypeScript coverage
- Strict mode enabled in `tsconfig.json`
- Type-safe React hooks and components

### Testing Coverage
- Component unit tests in `src/test/components/`
- Hook tests in `src/test/hooks/`
- Page integration tests in `src/test/pages/`
- Utility function tests in `src/test/utils/`

### Linting & Formatting
- ESLint for code quality
- Prettier for consistent formatting
- React-specific rules enabled

---

## Performance Considerations

### React Query Optimization
- Automatic caching reduces redundant requests
- Stale time configuration for cache freshness
- Smart retry logic with exponential backoff
- Query invalidation strategy minimizes refetches

### Component Optimization
- Memoization for expensive computations
- Lazy loading for routes (optional)
- Efficient re-render patterns

### Build Optimization
- Vite's fast bundling
- Tree-shaking of unused code
- Production bundle optimization

---

## Extensibility Points

### Adding New Features
1. Create data types in `api/endpoints.ts`
2. Add API functions to `api/endpoints.ts`
3. Create custom hooks in `hooks/api.ts`
4. Build components composing the hooks
5. Create page or add to existing page
6. Add route in `App.tsx`

### Adding New Pages
1. Create component in `pages/`
2. Import and add route in `App.tsx`
3. Add navigation item in `Sidebar.tsx` or Header

### Styling
- Tailwind CSS utility classes
- Custom CSS in component or styles/ folder
- Theme variables in `styles/variables.css`
- Dark mode via class-based theme provider

---

## Known Patterns & Best Practices

### Do's
✅ Use custom hooks for all API calls  
✅ Leverage React Query for data management  
✅ Compose components to build pages  
✅ Keep components focused and single-responsibility  
✅ Use TypeScript for type safety  
✅ Test components with React Testing Library  

### Don'ts
❌ Direct fetch calls without React Query  
❌ Managing data state with useState for server data  
❌ Bypassing custom hooks for API access  
❌ Large monolithic components  
❌ Prop drilling without context  

---

## Summary

The JobHunter frontend is a well-structured React application following modern best practices with clear separation of concerns. It demonstrates:

- **Clean Architecture** - Distinct layers (UI, hooks, API)
- **Type Safety** - Full TypeScript coverage
- **Data Management** - React Query for caching and synchronization
- **Reusable Patterns** - Generic components and custom hooks
- **Testing Ready** - Component and hook test infrastructure
- **Scalable Design** - Easy to add new features and pages

The codebase is maintainable, extensible, and ready for adding new job tracking features or enhancing existing functionality.


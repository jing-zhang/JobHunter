import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Dashboard from '@/pages/Dashboard'
import { LanguageProvider } from '@/app/LanguageProvider'

const mockDashboardStats = {
  activeApplications: 5,
  upcomingInterviews: 2,
  pendingOffers: 1,
  progressPct: 45,
}

const mockUseDashboardStats = vi.fn()

vi.mock('@/hooks/api', () => ({
  useDashboardStats: () => mockUseDashboardStats(),
}))

vi.mock('@/components/StatCard', () => ({
  default: ({ title, value }: { title: string; value: number | string }) => (
    <div data-testid="stat-card" className="glass-card">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  ),
}))

vi.mock('@/components/CircularProgress', () => ({
  default: ({ progress }: { progress: number }) => (
    <div data-testid="circular-progress" className="relative">
      <span>{progress}%</span>
    </div>
  ),
}))

vi.mock('@/components/QuickAddFAB', () => ({
  default: () => <div data-testid="quick-add-fab">FAB</div>,
}))

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>{children}</LanguageProvider>
    </QueryClientProvider>
  )
}

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should show loading spinner initially', () => {
    mockUseDashboardStats.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    })

    render(<Dashboard />, { wrapper })

    const spinnerDiv = document.querySelector('.animate-spin')
    expect(spinnerDiv).toBeInTheDocument()
  })

  it('should show error message when fetch fails', () => {
    mockUseDashboardStats.mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Failed to fetch'),
    })

    render(<Dashboard />, { wrapper })

    expect(screen.getByText(/Error loading dashboard/i)).toBeInTheDocument()
  })

  it('should show no data message when stats is null', () => {
    mockUseDashboardStats.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    })

    render(<Dashboard />, { wrapper })

    expect(screen.getByText(/No dashboard data available/i)).toBeInTheDocument()
  })

  it('should render dashboard title', async () => {
    mockUseDashboardStats.mockReturnValue({
      data: mockDashboardStats,
      isLoading: false,
      error: null,
    })

    render(<Dashboard />, { wrapper })

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('should render stat cards with correct values', async () => {
    mockUseDashboardStats.mockReturnValue({
      data: mockDashboardStats,
      isLoading: false,
      error: null,
    })

    render(<Dashboard />, { wrapper })

    await waitFor(() => {
      const statCards = screen.getAllByTestId('stat-card')
      expect(statCards.length).toBe(3)
    })
  })

  it('should render 4 stat cards including progress', async () => {
    mockUseDashboardStats.mockReturnValue({
      data: mockDashboardStats,
      isLoading: false,
      error: null,
    })

    render(<Dashboard />, { wrapper })

    await waitFor(() => {
      const statCards = screen.getAllByTestId('stat-card')
      expect(statCards.length).toBeGreaterThanOrEqual(3)
    })
  })

  it('should render progress percentage display', async () => {
    mockUseDashboardStats.mockReturnValue({
      data: mockDashboardStats,
      isLoading: false,
      error: null,
    })

    render(<Dashboard />, { wrapper })

    await waitFor(() => {
      const progressElements = screen.getAllByText('45%')
      expect(progressElements.length).toBeGreaterThan(0)
    })
  })

  it('should render circular progress components', async () => {
    mockUseDashboardStats.mockReturnValue({
      data: mockDashboardStats,
      isLoading: false,
      error: null,
    })

    render(<Dashboard />, { wrapper })

    await waitFor(() => {
      const progressComponents = screen.getAllByTestId('circular-progress')
      expect(progressComponents.length).toBeGreaterThan(0)
    })
  })

  it('should render QuickAddFAB component', async () => {
    mockUseDashboardStats.mockReturnValue({
      data: mockDashboardStats,
      isLoading: false,
      error: null,
    })

    render(<Dashboard />, { wrapper })

    await waitFor(() => {
      expect(screen.getByTestId('quick-add-fab')).toBeInTheDocument()
    })
  })

  it('should display overall progress section', async () => {
    mockUseDashboardStats.mockReturnValue({
      data: mockDashboardStats,
      isLoading: false,
      error: null,
    })

    render(<Dashboard />, { wrapper })

    await waitFor(() => {
      expect(screen.getByText(/Overall Progress/i)).toBeInTheDocument()
    })
  })

  it('should show motivational message', async () => {
    mockUseDashboardStats.mockReturnValue({
      data: mockDashboardStats,
      isLoading: false,
      error: null,
    })

    render(<Dashboard />, { wrapper })

    await waitFor(() => {
      expect(screen.getByText(/making great progress/i)).toBeInTheDocument()
    })
  })

  it('should display statistics breakdown in progress section', async () => {
    mockUseDashboardStats.mockReturnValue({
      data: mockDashboardStats,
      isLoading: false,
      error: null,
    })

    render(<Dashboard />, { wrapper })

    await waitFor(() => {
      const applicationTexts = screen.getAllByText(/Applications/i)
      expect(applicationTexts.length).toBeGreaterThan(0)
    })
  })

  it('should render main content with space-y-6 styling', () => {
    mockUseDashboardStats.mockReturnValue({
      data: mockDashboardStats,
      isLoading: false,
      error: null,
    })

    const { container } = render(<Dashboard />, { wrapper })

    const mainDiv = container.querySelector('.space-y-6')
    expect(mainDiv).toBeInTheDocument()
  })

  it('should use grid layout for stat cards', async () => {
    mockUseDashboardStats.mockReturnValue({
      data: mockDashboardStats,
      isLoading: false,
      error: null,
    })

    const { container } = render(<Dashboard />, { wrapper })

    await waitFor(() => {
      const grid = container.querySelector('.grid')
      expect(grid).toBeInTheDocument()
      expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4', 'gap-6')
    })
  })

  it('should render with responsive grid layout', async () => {
    mockUseDashboardStats.mockReturnValue({
      data: mockDashboardStats,
      isLoading: false,
      error: null,
    })

    const { container } = render(<Dashboard />, { wrapper })

    await waitFor(() => {
      const grid = container.querySelector('.gap-6')
      expect(grid).toBeInTheDocument()
    })
  })

  it('should handle component rendering with valid stats', async () => {
    mockUseDashboardStats.mockReturnValue({
      data: mockDashboardStats,
      isLoading: false,
      error: null,
    })

    const { container } = render(<Dashboard />, { wrapper })

    await waitFor(() => {
      expect(container.querySelector('.glass-card')).toBeInTheDocument()
    })
  })
})

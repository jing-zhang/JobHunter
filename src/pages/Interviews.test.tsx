import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Interviews from './Interviews'
import type { Interview } from '@/api/endpoints'

const mockInterviews: Interview[] = [
  {
    id: 1,
    applicationId: 101,
    company: 'Google',
    position: 'Frontend Engineer',
    type: 'technical',
    scheduledDate: '2026-05-10T10:00:00Z',
    status: 'scheduled',
    notes: 'Coding interview',
    interviewer: 'John Doe',
    location: 'Remote',
  },
  {
    id: 2,
    applicationId: 102,
    company: 'Meta',
    position: 'Software Engineer',
    type: 'phone_screen',
    scheduledDate: '2026-05-12T14:00:00Z',
    status: 'completed',
    notes: 'Recruiter call',
    interviewer: 'Jane Smith',
    location: 'Remote',
  },
]

const mockUseInterviews = vi.fn()
const mockUseApplications = vi.fn()

vi.mock('@/hooks/api', () => ({
  useInterviews: () => mockUseInterviews(),
  useApplications: () => mockUseApplications(),
  useCreateApplication: vi.fn(),
  useCreateInterview: vi.fn(),
  useCreateOffer: vi.fn(),
}))

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

describe('Interviews Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders interviews list correctly', () => {
    mockUseInterviews.mockReturnValue({
      data: mockInterviews,
      isLoading: false,
      error: null,
    })
    mockUseApplications.mockReturnValue({
      data: [],
      isLoading: false,
    })

    render(<Interviews />, { wrapper })

    expect(screen.getByText('Interviews')).toBeInTheDocument()
    expect(screen.getByText('Google')).toBeInTheDocument()
    expect(screen.getByText('Meta')).toBeInTheDocument()
    expect(screen.getByText('Frontend Engineer')).toBeInTheDocument()
    expect(screen.getByText('Technical')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('filters interviews by search term', () => {
    mockUseInterviews.mockReturnValue({
      data: mockInterviews,
      isLoading: false,
      error: null,
    })
    mockUseApplications.mockReturnValue({
      data: [],
      isLoading: false,
    })

    render(<Interviews />, { wrapper })

    const searchInput = screen.getByPlaceholderText(/search companies/i)
    fireEvent.change(searchInput, { target: { value: 'Google' } })

    expect(screen.getByText('Google')).toBeInTheDocument()
    expect(screen.queryByText('Meta')).not.toBeInTheDocument()
  })

  it('shows loading state', () => {
    mockUseInterviews.mockReturnValue({
      data: [],
      isLoading: true,
      error: null,
    })
    mockUseApplications.mockReturnValue({
      data: [],
      isLoading: false,
    })

    render(<Interviews />, { wrapper })

    expect(screen.getByText(/loading data.../i)).toBeInTheDocument()
  })

  it('shows error state', () => {
    mockUseInterviews.mockReturnValue({
      data: [],
      isLoading: false,
      error: new Error('Network error'),
    })

    render(<Interviews />, { wrapper })

    expect(screen.getByText(/error loading interviews/i)).toBeInTheDocument()
  })
})

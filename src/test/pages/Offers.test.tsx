import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Offers from '@/pages/Offers'
import type { Offer } from '@/api/endpoints'

const mockOffers: Offer[] = [
  {
    id: 1,
    applicationId: 101,
    company: 'Google',
    position: 'Frontend Engineer',
    salary: 150000,
    bonus: 20000,
    equity: '100k RSU',
    benefits: ['Health', 'Dental'],
    status: 'pending',
    receivedDate: '2026-05-01',
    expirationDate: '2026-05-15',
    notes: 'Good offer',
  },
  {
    id: 2,
    applicationId: 102,
    company: 'Meta',
    position: 'Software Engineer',
    salary: 160000,
    bonus: 25000,
    equity: '150k RSU',
    benefits: ['Health', 'Dental', 'Vision'],
    status: 'accepted',
    receivedDate: '2026-05-05',
    expirationDate: '2026-05-20',
    notes: 'Accepted!',
  },
]

const mockUseOffers = vi.fn()
const mockUseApplications = vi.fn()

vi.mock('@/hooks/api', () => ({
  useOffers: () => mockUseOffers(),
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

describe('Offers Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders offers list correctly', () => {
    mockUseOffers.mockReturnValue({
      data: mockOffers,
      isLoading: false,
      error: null,
    })
    mockUseApplications.mockReturnValue({
      data: [],
      isLoading: false,
    })

    render(<Offers />, { wrapper })

    expect(screen.getByText('Job Offers')).toBeInTheDocument()
    expect(screen.getByText('Google')).toBeInTheDocument()
    expect(screen.getByText('Meta')).toBeInTheDocument()
    expect(screen.getByText('$150,000')).toBeInTheDocument()
    expect(screen.getByText('100k RSU')).toBeInTheDocument()
  })

  it('filters offers by search term', () => {
    mockUseOffers.mockReturnValue({
      data: mockOffers,
      isLoading: false,
      error: null,
    })
    mockUseApplications.mockReturnValue({
      data: [],
      isLoading: false,
    })

    render(<Offers />, { wrapper })

    const searchInput = screen.getByPlaceholderText(/search companies/i)
    fireEvent.change(searchInput, { target: { value: 'Google' } })

    expect(screen.getByText('Google')).toBeInTheDocument()
    expect(screen.queryByText('Meta')).not.toBeInTheDocument()
  })

  it('shows loading state', () => {
    mockUseOffers.mockReturnValue({
      data: [],
      isLoading: true,
      error: null,
    })
    mockUseApplications.mockReturnValue({
      data: [],
      isLoading: false,
    })

    render(<Offers />, { wrapper })

    expect(screen.getByText(/loading data.../i)).toBeInTheDocument()
  })

  it('shows error state', () => {
    mockUseOffers.mockReturnValue({
      data: [],
      isLoading: false,
      error: new Error('Network error'),
    })

    render(<Offers />, { wrapper })

    expect(screen.getByText(/error loading offers/i)).toBeInTheDocument()
  })
})

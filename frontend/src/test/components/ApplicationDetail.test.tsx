import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ApplicationDetail from '@/components/ApplicationDetail'
import type { Application } from '@/api/endpoints'
import * as apiHooks from '@/hooks/api'
import { createTestWrapper } from '@/test/utils/testWrapper'

// Mock the hooks
vi.mock('@/hooks/api', () => ({
  useUpdateApplication: vi.fn(),
  useDeleteApplication: vi.fn(),
}))

const mockApplication: Application = {
  id: 1,
  company: 'Google',
  position: 'Software Engineer',
  location: 'Mountain View, CA',
  salary: 150000,
  status: 'applied',
  appliedDate: '2023-01-01',
  lastUpdated: '2023-01-01',
  notes: 'Some notes',
  url: 'https://google.com/jobs',
}

const wrapper = createTestWrapper()

describe('ApplicationDetail', () => {
  const mockUpdateMutate = vi.fn()
  const mockDeleteMutate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(apiHooks.useUpdateApplication as any).mockReturnValue({
      mutateAsync: mockUpdateMutate,
      isPending: false,
    })
    ;(apiHooks.useDeleteApplication as any).mockReturnValue({
      mutateAsync: mockDeleteMutate,
      isPending: false,
    })
  })

  it('renders application details correctly', () => {
    render(<ApplicationDetail application={mockApplication} onClose={vi.fn()} />, { wrapper })

    expect(screen.getByDisplayValue('Google')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Software Engineer')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Applied')).toBeInTheDocument()
    expect(screen.getByDisplayValue('150000')).toBeInTheDocument()
  })

  it('calls update mutation when form is submitted', async () => {
    render(<ApplicationDetail application={mockApplication} onClose={vi.fn()} />, { wrapper })

    fireEvent.change(screen.getByDisplayValue('Google'), { target: { value: 'Alphabet' } })
    fireEvent.submit(screen.getByRole('button', { name: /save changes/i }))

    expect(mockUpdateMutate).toHaveBeenCalledWith({
      id: 1,
      data: expect.objectContaining({ company: 'Alphabet' }),
    })
  })

  it('calls delete mutation when delete button is clicked', async () => {
    window.confirm = vi.fn().mockReturnValue(true)
    render(<ApplicationDetail application={mockApplication} onClose={vi.fn()} />, { wrapper })

    fireEvent.click(screen.getByRole('button', { name: /delete/i }))

    expect(mockDeleteMutate).toHaveBeenCalledWith(1)
  })
})

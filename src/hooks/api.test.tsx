import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useApplications, useCreateApplication } from '@/hooks/api'

// Mock fetch globally
const fetchMock = vi.fn()
;(globalThis as any).fetch = fetchMock

describe('API Hooks', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
    vi.clearAllMocks()
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )

  describe('useApplications', () => {
    it('should fetch applications successfully', async () => {
      const mockApplications = [
        {
          id: 1,
          company: 'Test Company',
          position: 'Developer',
          location: 'Remote',
          salary: 100000,
          status: 'applied' as const,
          appliedDate: '2024-01-01',
          lastUpdated: '2024-01-01',
          notes: 'Test notes',
          url: 'https://test.com',
        },
      ]

      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApplications),
      })

      const { result } = renderHook(() => useApplications(), { wrapper })

      expect(result.current.isLoading).toBe(true)

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockApplications)
      expect(fetchMock).toHaveBeenCalledWith('http://localhost:3001/applications')
    })

    it('should handle fetch error', async () => {
      fetchMock.mockRejectedValueOnce(new Error('Network error'))

      const { result } = renderHook(() => useApplications(), { wrapper })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error?.message).toBe('Network error')
    })
  })

  describe('useCreateApplication', () => {
    it('should create application successfully', async () => {
      const newApplication = {
        company: 'New Company',
        position: 'Senior Developer',
        location: 'San Francisco, CA',
        salary: 120000,
        status: 'applied' as const,
        appliedDate: '2024-01-15',
        lastUpdated: '2024-01-15',
        notes: 'Excited about this opportunity',
        url: 'https://newcompany.com/jobs',
      }

      const createdApplication = { ...newApplication, id: 1 }

      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(createdApplication),
      })

      const { result } = renderHook(() => useCreateApplication(), { wrapper })

      result.current.mutate(newApplication)

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(createdApplication)
      expect(fetchMock).toHaveBeenCalledWith('http://localhost:3001/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newApplication),
      })
    })
  })
})
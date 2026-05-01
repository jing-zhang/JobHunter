import { QueryClient } from '@tanstack/react-query'
import { ApiError } from './errors'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error) => {
        // Don't retry on 4xx client errors (except 408 Request Timeout and 429 Too Many Requests)
        if (error instanceof ApiError && error.status && error.status >= 400 && error.status < 500) {
          // Still retry on 408 (timeout) and 429 (rate limit)
          if (error.status === 408 || error.status === 429) {
            return failureCount < 3
          }
          return false
        }
        return failureCount < 3
      },
    },
    mutations: {
      retry: false,
    },
  },
})

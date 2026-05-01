export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public details?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}
import { ApiError } from './errors'

const API_BASE_URL = '/api/v1'

// Types
export interface Application {
  id: number
  company: string
  position: string
  location: string
  salary: number
  status: 'applied' | 'interviewing' | 'offer' | 'rejected'
  appliedDate: string
  lastUpdated: string
  notes: string
  url: string
}

export interface Interview {
  id: number
  applicationId: number
  company: string
  position: string
  type: 'phone_screen' | 'technical' | 'behavioral' | 'portfolio_review' | 'final'
  scheduledDate: string
  status: 'scheduled' | 'completed' | 'cancelled'
  notes: string
  interviewer: string
  location: string
}

export interface Offer {
  id: number
  applicationId: number
  company: string
  position: string
  salary: number
  bonus: number
  equity: string
  benefits: string[]
  status: 'pending' | 'accepted' | 'declined' | 'expired'
  receivedDate: string
  expirationDate: string
  notes: string
}

export interface DashboardStats {
  activeApplications: number
  upcomingInterviews: number
  pendingOffers: number
  progressPct: number
}

// API functions
export const api = {
  // Applications
  getApplications: async (): Promise<Application[]> => {
    const response = await fetch(`${API_BASE_URL}/applications`)
    if (!response.ok) throw new ApiError('Failed to fetch applications', response.status)
    const result = await response.json()
    // Handle both paginated response (with data property) and array response
    return Array.isArray(result) ? result : result.data || []
  },

  getApplication: async (id: number): Promise<Application> => {
    const response = await fetch(`${API_BASE_URL}/applications/${id}`)
    if (!response.ok) throw new ApiError('Failed to fetch application', response.status)
    return response.json()
  },

  createApplication: async (data: Omit<Application, 'id'>): Promise<Application> => {
    const response = await fetch(`${API_BASE_URL}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const details = await response.text().catch(() => '')
      throw new ApiError(`Failed to create application: ${details}`, response.status, details)
    }
    return response.json()
  },

  updateApplication: async (id: number, data: Partial<Application>): Promise<Application> => {
    const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const details = await response.text().catch(() => '')
      throw new ApiError(`Failed to update application: ${details}`, response.status, details)
    }
    return response.json()
  },

  deleteApplication: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      const details = await response.text().catch(() => '')
      throw new ApiError(`Failed to delete application: ${details}`, response.status, details)
    }
  },

  // Interviews
  getInterviews: async (): Promise<Interview[]> => {
    const response = await fetch(`${API_BASE_URL}/interviews`)
    if (!response.ok) throw new ApiError('Failed to fetch interviews', response.status)
    const result = await response.json()
    // Handle both paginated response (with data property) and array response
    return Array.isArray(result) ? result : result.data || []
  },

  createInterview: async (data: Omit<Interview, 'id'>): Promise<Interview> => {
    const response = await fetch(`${API_BASE_URL}/interviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new ApiError('Failed to create interview', response.status)
    return response.json()
  },

  updateInterview: async (id: number, data: Partial<Interview>): Promise<Interview> => {
    const response = await fetch(`${API_BASE_URL}/interviews/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const details = await response.text().catch(() => '')
      throw new ApiError(`Failed to update interview: ${details}`, response.status, details)
    }
    return response.json()
  },

  deleteInterview: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/interviews/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      const details = await response.text().catch(() => '')
      throw new ApiError(`Failed to delete interview: ${details}`, response.status, details)
    }
  },

  // Offers
  getOffers: async (): Promise<Offer[]> => {
    const response = await fetch(`${API_BASE_URL}/offers`)
    if (!response.ok) throw new ApiError('Failed to fetch offers', response.status)
    const result = await response.json()
    // Handle both paginated response (with data property) and array response
    return Array.isArray(result) ? result : result.data || []
  },

  createOffer: async (data: Omit<Offer, 'id'>): Promise<Offer> => {
    const response = await fetch(`${API_BASE_URL}/offers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new ApiError('Failed to create offer', response.status)
    return response.json()
  },

  updateOffer: async (id: number, data: Partial<Offer>): Promise<Offer> => {
    const response = await fetch(`${API_BASE_URL}/offers/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new ApiError('Failed to update offer', response.status)
    return response.json()
  },

  deleteOffer: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/offers/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      const details = await response.text().catch(() => '')
      throw new ApiError(`Failed to delete offer: ${details}`, response.status, details)
    }
  },

  // Dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await fetch(`${API_BASE_URL}/dashboard/stats`)
    if (!response.ok) throw new ApiError('Failed to fetch dashboard stats', response.status)
    const data = await response.json()
    return data.stats
  },
}

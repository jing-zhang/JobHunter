const API_BASE_URL = 'http://localhost:3001/api/v1'

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
    if (!response.ok) throw new Error('Failed to fetch applications')
    return response.json()
  },

  getApplication: async (id: number): Promise<Application> => {
    const response = await fetch(`${API_BASE_URL}/applications/${id}`)
    if (!response.ok) throw new Error('Failed to fetch application')
    return response.json()
  },

  createApplication: async (data: Omit<Application, 'id'>): Promise<Application> => {
    const response = await fetch(`${API_BASE_URL}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to create application')
    return response.json()
  },

  updateApplication: async (id: number, data: Partial<Application>): Promise<Application> => {
    const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to update application')
    return response.json()
  },

  deleteApplication: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Failed to delete application')
  },

  // Interviews
  getInterviews: async (): Promise<Interview[]> => {
    const response = await fetch(`${API_BASE_URL}/interviews`)
    if (!response.ok) throw new Error('Failed to fetch interviews')
    return response.json()
  },

  createInterview: async (data: Omit<Interview, 'id'>): Promise<Interview> => {
    const response = await fetch(`${API_BASE_URL}/interviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to create interview')
    return response.json()
  },

  // Offers
  getOffers: async (): Promise<Offer[]> => {
    const response = await fetch(`${API_BASE_URL}/offers`)
    if (!response.ok) throw new Error('Failed to fetch offers')
    return response.json()
  },

  createOffer: async (data: Omit<Offer, 'id'>): Promise<Offer> => {
    const response = await fetch(`${API_BASE_URL}/offers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to create offer')
    return response.json()
  },

  updateOffer: async (id: number, data: Partial<Offer>): Promise<Offer> => {
    const response = await fetch(`${API_BASE_URL}/offers/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to update offer')
    return response.json()
  },

  // Dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await fetch(`${API_BASE_URL}/dashboard/stats`)
    if (!response.ok) throw new Error('Failed to fetch dashboard stats')
    const data = await response.json()
    return data.stats
  },
}

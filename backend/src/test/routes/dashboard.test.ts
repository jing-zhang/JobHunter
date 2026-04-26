import { describe, expect, it, vi } from 'vitest'
import dashboardRoutes from '../../routes/dashboard.js'
import { createTestApp } from '../helpers/createTestApp.js'

describe('dashboard routes', () => {
  it('GET /stats returns aggregated stats and clamps progressPct', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'))

    const prisma = {
      application: {
        count: vi
          .fn()
          .mockResolvedValueOnce(2) // activeApplications
          .mockResolvedValueOnce(10), // totalApplications
      },
      interview: {
        count: vi.fn().mockResolvedValue(3),
      },
      offer: {
        count: vi.fn().mockResolvedValue(1),
      },
    }

    const app = createTestApp(prisma)
    await app.register(dashboardRoutes, { prefix: '/api/v1/dashboard' })
    await app.ready()

    const res = await app.inject({ method: 'GET', url: '/api/v1/dashboard/stats' })

    expect(res.statusCode).toBe(200)
    expect(JSON.parse(res.payload)).toEqual({
      stats: {
        activeApplications: 2,
        upcomingInterviews: 3,
        pendingOffers: 1,
        progressPct: 80,
      },
    })

    expect(prisma.interview.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: 'scheduled',
          scheduledDate: { gte: expect.any(Date) },
        }),
      }),
    )

    await app.close()
    vi.useRealTimers()
  })

  it('GET /stats returns 0 progress when no applications exist', async () => {
    const prisma = {
      application: {
        count: vi
          .fn()
          .mockResolvedValueOnce(0) // activeApplications
          .mockResolvedValueOnce(0), // totalApplications
      },
      interview: {
        count: vi.fn().mockResolvedValue(0),
      },
      offer: {
        count: vi.fn().mockResolvedValue(0),
      },
    }

    const app = createTestApp(prisma)
    await app.register(dashboardRoutes, { prefix: '/api/v1/dashboard' })
    await app.ready()

    const res = await app.inject({ method: 'GET', url: '/api/v1/dashboard/stats' })

    expect(res.statusCode).toBe(200)
    expect(JSON.parse(res.payload)).toEqual({
      stats: {
        activeApplications: 0,
        upcomingInterviews: 0,
        pendingOffers: 0,
        progressPct: 0,
      },
    })

    await app.close()
  })
})

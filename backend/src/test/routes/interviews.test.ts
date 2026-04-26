import { describe, expect, it, vi } from 'vitest'
import interviewRoutes from '../../routes/interviews.js'
import { createTestApp } from '../helpers/createTestApp.js'

describe('interviews routes', () => {
  it('GET / supports upcoming=true and applicationId filters', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'))

    const prisma = {
      interview: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: 1,
            applicationId: 2,
            scheduledDate: '2024-01-02T00:00:00.000Z',
            status: 'scheduled',
            type: 'technical',
            application: { company: 'Acme', position: 'Engineer' },
          },
        ]),
      },
    }

    const app = createTestApp(prisma)
    await app.register(interviewRoutes, { prefix: '/api/v1/interviews' })
    await app.ready()

    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/interviews?upcoming=true&applicationId=2',
    })

    expect(res.statusCode).toBe(200)
    expect(JSON.parse(res.payload)).toEqual([
      expect.objectContaining({
        id: 1,
        applicationId: 2,
        company: 'Acme',
        position: 'Engineer',
      }),
    ])

    expect(prisma.interview.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          applicationId: 2,
          status: 'scheduled',
          scheduledDate: { gte: expect.any(Date) },
        }),
        orderBy: { scheduledDate: 'asc' },
        include: { application: { select: { company: true, position: true } } },
      }),
    )

    await app.close()
    vi.useRealTimers()
  })

  it('POST / returns 400 on validation error', async () => {
    const prisma = {
      interview: {
        create: vi.fn(),
      },
    }

    const app = createTestApp(prisma)
    await app.register(interviewRoutes, { prefix: '/api/v1/interviews' })
    await app.ready()

    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/interviews',
      headers: { 'content-type': 'application/json' },
      payload: { applicationId: -1, type: '', scheduledDate: 'not-a-date' },
    })

    expect(res.statusCode).toBe(400)
    expect(JSON.parse(res.payload)).toEqual(expect.objectContaining({ error: 'Validation Error' }))
    expect(prisma.interview.create).not.toHaveBeenCalled()

    await app.close()
  })
})

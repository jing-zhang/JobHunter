import { describe, expect, it, vi } from 'vitest'
import applicationRoutes from '../../routes/applications.js'
import { createTestApp } from '../helpers/createTestApp.js'

describe('applications routes', () => {
  it('GET / returns applications ordered by lastUpdated desc', async () => {
    const prisma = {
      application: {
        findMany: vi.fn().mockResolvedValue([{ id: 1, company: 'Acme' }]),
      },
    }

    const app = createTestApp(prisma)
    await app.register(applicationRoutes, { prefix: '/api/v1/applications' })
    await app.ready()

    const res = await app.inject({ method: 'GET', url: '/api/v1/applications' })

    expect(res.statusCode).toBe(200)
    expect(JSON.parse(res.payload)).toEqual([{ id: 1, company: 'Acme' }])
    expect(prisma.application.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { lastUpdated: 'desc' },
        include: { _count: { select: { interviews: true, offers: true } } },
      }),
    )

    await app.close()
  })

  it('GET /:id returns 404 when not found', async () => {
    const prisma = {
      application: {
        findUnique: vi.fn().mockResolvedValue(null),
      },
    }

    const app = createTestApp(prisma)
    await app.register(applicationRoutes, { prefix: '/api/v1/applications' })
    await app.ready()

    const res = await app.inject({ method: 'GET', url: '/api/v1/applications/123' })

    expect(res.statusCode).toBe(404)
    expect(JSON.parse(res.payload)).toEqual({ error: 'Application not found' })

    await app.close()
  })

  it('POST / returns 400 on validation error', async () => {
    const prisma = {
      application: {
        create: vi.fn(),
      },
    }

    const app = createTestApp(prisma)
    await app.register(applicationRoutes, { prefix: '/api/v1/applications' })
    await app.ready()

    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/applications',
      headers: { 'content-type': 'application/json' },
      payload: { company: '', position: '' },
    })

    expect(res.statusCode).toBe(400)
    expect(JSON.parse(res.payload)).toEqual(expect.objectContaining({ error: 'Validation Error' }))
    expect(prisma.application.create).not.toHaveBeenCalled()

    await app.close()
  })

  it('PATCH /:id returns 404 when prisma reports missing record', async () => {
    const prisma = {
      application: {
        update: vi.fn().mockRejectedValue({ code: 'P2025' }),
      },
    }

    const app = createTestApp(prisma)
    await app.register(applicationRoutes, { prefix: '/api/v1/applications' })
    await app.ready()

    const res = await app.inject({
      method: 'PATCH',
      url: '/api/v1/applications/1',
      headers: { 'content-type': 'application/json' },
      payload: { status: 'rejected' },
    })

    expect(res.statusCode).toBe(404)
    expect(JSON.parse(res.payload)).toEqual({ error: 'Application not found' })

    await app.close()
  })
})

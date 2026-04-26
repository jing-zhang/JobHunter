import { describe, expect, it, vi } from 'vitest'
import offerRoutes from '../../routes/offers.js'
import { createTestApp } from '../helpers/createTestApp.js'

describe('offers routes', () => {
  it('GET / returns offers with company + position mapped from application', async () => {
    const prisma = {
      offer: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: 1,
            applicationId: 3,
            salary: 100000,
            status: 'pending',
            receivedDate: '2024-01-01T00:00:00.000Z',
            application: { company: 'Globex', position: 'Dev' },
          },
        ]),
      },
    }

    const app = createTestApp(prisma)
    await app.register(offerRoutes, { prefix: '/api/v1/offers' })
    await app.ready()

    const res = await app.inject({ method: 'GET', url: '/api/v1/offers' })

    expect(res.statusCode).toBe(200)
    expect(JSON.parse(res.payload)).toEqual([
      expect.objectContaining({
        id: 1,
        company: 'Globex',
        position: 'Dev',
      }),
    ])
    expect(prisma.offer.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { receivedDate: 'desc' },
        include: { application: { select: { company: true, position: true } } },
      }),
    )

    await app.close()
  })

  it('POST / returns 400 on validation error', async () => {
    const prisma = {
      offer: {
        create: vi.fn(),
      },
    }

    const app = createTestApp(prisma)
    await app.register(offerRoutes, { prefix: '/api/v1/offers' })
    await app.ready()

    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/offers',
      headers: { 'content-type': 'application/json' },
      payload: { applicationId: 0, salary: -1 },
    })

    expect(res.statusCode).toBe(400)
    expect(JSON.parse(res.payload)).toEqual(expect.objectContaining({ error: 'Validation Error' }))
    expect(prisma.offer.create).not.toHaveBeenCalled()

    await app.close()
  })

  it('DELETE /:id returns 404 when prisma reports missing record', async () => {
    const prisma = {
      offer: {
        delete: vi.fn().mockRejectedValue({ code: 'P2025' }),
      },
    }

    const app = createTestApp(prisma)
    await app.register(offerRoutes, { prefix: '/api/v1/offers' })
    await app.ready()

    const res = await app.inject({ method: 'DELETE', url: '/api/v1/offers/999' })

    expect(res.statusCode).toBe(404)
    expect(JSON.parse(res.payload)).toEqual({ error: 'Offer not found' })

    await app.close()
  })
})


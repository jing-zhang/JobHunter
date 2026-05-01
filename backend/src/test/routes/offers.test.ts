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
        count: vi.fn().mockResolvedValue(1),
      },
    }

    const app = createTestApp(prisma)
    await app.register(offerRoutes, { prefix: '/api/v1/offers' })
    await app.ready()

    const res = await app.inject({ method: 'GET', url: '/api/v1/offers' })

    expect(res.statusCode).toBe(200)
    const body = JSON.parse(res.payload)
    expect(body.data).toEqual([
      expect.objectContaining({
        id: 1,
        company: 'Globex',
        position: 'Dev',
      }),
    ])
    expect(body.pagination).toMatchObject({ page: 1, limit: 20, total: 1 })

    expect(prisma.offer.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 0,
        take: 20,
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
      $transaction: vi.fn(async (fn: (tx: unknown) => unknown) => {
        return fn({
          offer: {
            findUnique: vi.fn().mockResolvedValue(null),
            delete: vi.fn(),
          },
          application: {
            findUnique: vi.fn(),
            update: vi.fn(),
          },
        })
      }),
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

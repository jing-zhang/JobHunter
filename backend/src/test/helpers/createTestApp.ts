import Fastify from 'fastify'
import type { FastifyInstance } from 'fastify'

export function createTestApp(prisma: unknown): FastifyInstance {
  const app = Fastify({ logger: false })
  app.decorate('prisma', prisma as any)
  return app
}


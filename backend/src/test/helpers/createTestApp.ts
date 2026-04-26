import Fastify from 'fastify'
import type { FastifyInstance } from 'fastify'
import type { PrismaClient } from '@prisma/client'

export function createTestApp(prisma: unknown): FastifyInstance {
  const app = Fastify({ logger: false })
  app.decorate('prisma', prisma as PrismaClient)
  return app
}

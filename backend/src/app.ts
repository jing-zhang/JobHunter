import Fastify from 'fastify'
import cors from '@fastify/cors'
import prismaPlugin from './plugins/prisma.js'
import applicationRoutes from './routes/applications.js'
import interviewRoutes from './routes/interviews.js'
import offerRoutes from './routes/offers.js'
import dashboardRoutes from './routes/dashboard.js'

const buildApp = async () => {
  const fastify = Fastify({
    logger: {
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      },
    },
  })

  // Register plugins
  await fastify.register(cors, {
    origin: true, // For development, allow all origins
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })

  await fastify.register(prismaPlugin)

  // Register routes
  await fastify.register(applicationRoutes, { prefix: '/api/v1/applications' })
  await fastify.register(interviewRoutes, { prefix: '/api/v1/interviews' })
  await fastify.register(offerRoutes, { prefix: '/api/v1/offers' })
  await fastify.register(dashboardRoutes, { prefix: '/api/v1/dashboard' })

  // Health check
  fastify.get('/health', async () => {
    return { status: 'ok' }
  })

  return fastify
}

export default buildApp

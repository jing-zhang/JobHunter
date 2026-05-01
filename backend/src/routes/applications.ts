import { FastifyInstance } from 'fastify'
import { CreateApplicationSchema, UpdateApplicationSchema } from '../schemas/application.js'

export default async function applicationRoutes(fastify: FastifyInstance) {
  // GET all applications
  fastify.get('/', async (request, reply) => {
    const { page = '1', limit = '20' } = request.query as { page?: string; limit?: string }
    
    const pageNum = Math.max(1, parseInt(page) || 1)
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20))
    const skip = (pageNum - 1) * limitNum
    
    try {
      const [applications, total] = await Promise.all([
        fastify.prisma.application.findMany({
          skip,
          take: limitNum,
          orderBy: { lastUpdated: 'desc' },
          include: {
            _count: {
              select: { interviews: true, offers: true },
            },
          },
        }),
        fastify.prisma.application.count()
      ])
      
      return {
        data: applications,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
          hasNext: pageNum * limitNum < total,
          hasPrev: pageNum > 1
        }
      }
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Internal Server Error' })
    }
  })

  // GET single application by ID
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    
    // Validate ID is a positive integer
    const idNum = parseInt(id)
    if (isNaN(idNum) || idNum <= 0 || !Number.isInteger(idNum)) {
      return reply.status(400).send({ error: 'Invalid ID format. ID must be a positive integer.' })
    }
    
    try {
      const application = await fastify.prisma.application.findUnique({
        where: { id: idNum },
        include: {
          interviews: true,
          offers: true,
        },
      })

      if (!application) {
        return reply.status(404).send({ error: 'Application not found' })
      }

      return application
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Internal Server Error' })
    }
  })

  // POST create new application
  fastify.post('/', async (request, reply) => {
    const parseResult = CreateApplicationSchema.safeParse(request.body)

    if (!parseResult.success) {
      return reply
        .status(400)
        .send({ error: 'Validation Error', details: parseResult.error.format() })
    }

    try {
      const application = await fastify.prisma.application.create({
        data: {
          ...parseResult.data,
          appliedDate: parseResult.data.appliedDate
            ? new Date(parseResult.data.appliedDate)
            : new Date(),
        },
      })
      return reply.status(201).send(application)
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Internal Server Error' })
    }
  })

  // PATCH update application
  fastify.patch('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    
    // Validate ID is a positive integer
    const idNum = parseInt(id)
    if (isNaN(idNum) || idNum <= 0 || !Number.isInteger(idNum)) {
      return reply.status(400).send({ error: 'Invalid ID format. ID must be a positive integer.' })
    }
    
    const parseResult = UpdateApplicationSchema.safeParse(request.body)

    if (!parseResult.success) {
      return reply
        .status(400)
        .send({ error: 'Validation Error', details: parseResult.error.format() })
    }

    try {
      const application = await fastify.prisma.application.update({
        where: { id: idNum },
        data: {
          ...parseResult.data,
          appliedDate: parseResult.data.appliedDate
            ? new Date(parseResult.data.appliedDate)
            : undefined,
        },
      })
      return application
    } catch (error) {
      fastify.log.error(error)
      if ((error as { code?: string }).code === 'P2025') {
        return reply.status(404).send({ error: 'Application not found' })
      }
      return reply.status(500).send({ error: 'Internal Server Error' })
    }
  })

  // DELETE application
  fastify.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    
    // Validate ID is a positive integer
    const applicationId = parseInt(id)
    if (isNaN(applicationId) || applicationId <= 0 || !Number.isInteger(applicationId)) {
      return reply.status(400).send({ error: 'Invalid ID format. ID must be a positive integer.' })
    }
    
    try {
      await fastify.prisma.$transaction(async (tx) => {
        // Prisma enables PRAGMA foreign_keys = ON for SQLite automatically,
        // so onDelete: Cascade in the schema handles this. The explicit
        // deletes below are defensive — safe to remove if Prisma's FK
        // enforcement is confirmed working.
        await tx.interview.deleteMany({ where: { applicationId } })
        await tx.offer.deleteMany({ where: { applicationId } })
        await tx.application.delete({ where: { id: applicationId } })
      })
      return reply.status(204).send()
    } catch (error) {
      fastify.log.error(error)
      if ((error as { code?: string }).code === 'P2025') {
        return reply.status(404).send({ error: 'Application not found' })
      }
      return reply.status(500).send({ error: 'Internal Server Error' })
    }
  })
}

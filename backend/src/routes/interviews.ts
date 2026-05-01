import { FastifyInstance } from 'fastify'
import { CreateInterviewSchema, UpdateInterviewSchema } from '../schemas/interview.js'

export default async function interviewRoutes(fastify: FastifyInstance) {
  // GET interviews
  fastify.get('/', async (request, reply) => {
    const { upcoming, applicationId, page = '1', limit = '20' } = request.query as {
      upcoming?: string
      applicationId?: string
      page?: string
      limit?: string
    }

    const pageNum = Math.max(1, parseInt(page) || 1)
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20))
    const skip = (pageNum - 1) * limitNum
    
    const where: Record<string, unknown> = {}
    if (upcoming === 'true') {
      where.scheduledDate = { gte: new Date() }
      where.status = 'scheduled'
    }
    if (applicationId) {
      where.applicationId = parseInt(applicationId)
    }

    try {
      const [interviews, total] = await Promise.all([
        fastify.prisma.interview.findMany({
          where,
          skip,
          take: limitNum,
          orderBy: { scheduledDate: 'asc' },
          include: {
            application: {
              select: { company: true, position: true },
            },
          },
        }),
        fastify.prisma.interview.count({ where })
      ])
      
      const data = interviews.map((i) => ({
        ...i,
        company: i.application?.company || '',
        position: i.application?.position || '',
      }))
      
      return {
        data,
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

  // POST create interview
  fastify.post('/', async (request, reply) => {
    const parseResult = CreateInterviewSchema.safeParse(request.body)

    if (!parseResult.success) {
      return reply
        .status(400)
        .send({ error: 'Validation Error', details: parseResult.error.format() })
    }

    try {
      const [, interview] = await fastify.prisma.$transaction([
        fastify.prisma.application.update({
          where: { id: parseResult.data.applicationId },
          data: {
            // Move application into interviewing when an interview is scheduled.
            status: 'interviewing',
          },
        }),
        fastify.prisma.interview.create({
          data: {
            ...parseResult.data,
            scheduledDate: new Date(parseResult.data.scheduledDate),
          },
        }),
      ])
      return reply.status(201).send(interview)
    } catch (error) {
      fastify.log.error(error)
      if ((error as { code?: string }).code === 'P2025') {
        return reply.status(404).send({ error: 'Application not found' })
      }
      return reply.status(500).send({ error: 'Internal Server Error' })
    }
  })

  // PATCH update interview
  fastify.patch('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    
    // Validate ID is a positive integer
    const idNum = parseInt(id)
    if (isNaN(idNum) || idNum <= 0 || !Number.isInteger(idNum)) {
      return reply.status(400).send({ error: 'Invalid ID format. ID must be a positive integer.' })
    }
    
    const parseResult = UpdateInterviewSchema.safeParse(request.body)

    if (!parseResult.success) {
      return reply
        .status(400)
        .send({ error: 'Validation Error', details: parseResult.error.format() })
    }

    try {
      const interview = await fastify.prisma.interview.update({
        where: { id: idNum },
        data: {
          ...parseResult.data,
          scheduledDate: parseResult.data.scheduledDate
            ? new Date(parseResult.data.scheduledDate)
            : undefined,
        },
      })
      return interview
    } catch (error) {
      fastify.log.error(error)
      if ((error as { code?: string }).code === 'P2025') {
        return reply.status(404).send({ error: 'Interview not found' })
      }
      return reply.status(500).send({ error: 'Internal Server Error' })
    }
  })

  // DELETE interview
  fastify.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    
    // Validate ID is a positive integer
    const interviewId = parseInt(id)
    if (isNaN(interviewId) || interviewId <= 0 || !Number.isInteger(interviewId)) {
      return reply.status(400).send({ error: 'Invalid ID format. ID must be a positive integer.' })
    }
    
    try {
      const interview = await fastify.prisma.interview.findUnique({
        where: { id: interviewId },
        select: { applicationId: true },
      })

      if (!interview) {
        return reply.status(404).send({ error: 'Interview not found' })
      }

      await fastify.prisma.$transaction(async (tx) => {
        await tx.interview.delete({
          where: { id: interviewId },
        })

        const counts = await tx.application.findUnique({
          where: { id: interview.applicationId },
          select: {
            _count: {
              select: { interviews: true, offers: true },
            },
          },
        })

        // If the application was deleted separately (or cascading didn't run),
        // there's nothing to update.
        if (!counts) return

        const interviewsCount = counts?._count.interviews ?? 0
        const offersCount = counts?._count.offers ?? 0

        const nextStatus =
          offersCount > 0 ? 'offer' : interviewsCount > 0 ? 'interviewing' : 'applied'

        await tx.application.update({
          where: { id: interview.applicationId },
          data: { status: nextStatus },
        })
      })
      return reply.status(204).send()
    } catch (error) {
      fastify.log.error(error)
      if ((error as { code?: string }).code === 'P2025') {
        return reply.status(404).send({ error: 'Interview not found' })
      }
      return reply.status(500).send({ error: 'Internal Server Error' })
    }
  })
}

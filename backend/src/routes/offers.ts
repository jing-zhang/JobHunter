import { FastifyInstance } from 'fastify'
import { CreateOfferSchema, UpdateOfferSchema } from '../schemas/offer.js'

export default async function offerRoutes(fastify: FastifyInstance) {
  // GET all offers
  fastify.get('/', async (request, reply) => {
    const { page = '1', limit = '20' } = request.query as { page?: string; limit?: string }
    
    const pageNum = Math.max(1, parseInt(page) || 1)
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20))
    const skip = (pageNum - 1) * limitNum
    
    try {
      const [offers, total] = await Promise.all([
        fastify.prisma.offer.findMany({
          skip,
          take: limitNum,
          orderBy: { receivedDate: 'desc' },
          include: {
            application: {
              select: { company: true, position: true },
            },
          },
        }),
        fastify.prisma.offer.count()
      ])
      
      const data = offers.map((o: { application?: { company: string; position: string } }) => ({
        ...o,
        company: o.application?.company || '',
        position: o.application?.position || '',
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

  // POST create offer
  fastify.post('/', async (request, reply) => {
    const parseResult = CreateOfferSchema.safeParse(request.body)

    if (!parseResult.success) {
      return reply
        .status(400)
        .send({ error: 'Validation Error', details: parseResult.error.format() })
    }

    try {
      const benefits = Array.isArray(parseResult.data.benefits)
        ? JSON.stringify(parseResult.data.benefits)
        : parseResult.data.benefits
      const [, offer] = await fastify.prisma.$transaction([
        fastify.prisma.application.update({
          where: { id: parseResult.data.applicationId },
          data: {
            status: 'offer',
          },
        }),
        fastify.prisma.offer.create({
          data: {
            ...parseResult.data,
            benefits,
            receivedDate: parseResult.data.receivedDate
              ? new Date(parseResult.data.receivedDate)
              : new Date(),
            expirationDate: parseResult.data.expirationDate
              ? new Date(parseResult.data.expirationDate)
              : null,
          },
        }),
      ])
      return reply.status(201).send(offer)
    } catch (error) {
      fastify.log.error(error)
      if ((error as { code?: string }).code === 'P2025') {
        return reply.status(404).send({ error: 'Application not found' })
      }
      return reply.status(500).send({ error: 'Internal Server Error' })
    }
  })

  // PATCH update offer
  fastify.patch('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    
    // Validate ID is a positive integer
    const idNum = parseInt(id)
    if (isNaN(idNum) || idNum <= 0 || !Number.isInteger(idNum)) {
      return reply.status(400).send({ error: 'Invalid ID format. ID must be a positive integer.' })
    }
    
    const parseResult = UpdateOfferSchema.safeParse(request.body)

    if (!parseResult.success) {
      return reply
        .status(400)
        .send({ error: 'Validation Error', details: parseResult.error.format() })
    }

    try {
      const benefits =
        parseResult.data.benefits === undefined
          ? undefined
          : Array.isArray(parseResult.data.benefits)
            ? JSON.stringify(parseResult.data.benefits)
            : parseResult.data.benefits
      const offer = await fastify.prisma.offer.update({
        where: { id: idNum },
        data: {
          ...parseResult.data,
          benefits,
          receivedDate: parseResult.data.receivedDate
            ? new Date(parseResult.data.receivedDate)
            : undefined,
          expirationDate: parseResult.data.expirationDate
            ? new Date(parseResult.data.expirationDate)
            : undefined,
        },
      })
      return offer
    } catch (error) {
      fastify.log.error(error)
      if ((error as { code?: string }).code === 'P2025') {
        return reply.status(404).send({ error: 'Offer not found' })
      }
      return reply.status(500).send({ error: 'Internal Server Error' })
    }
  })

  // DELETE offer
  fastify.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    
    // Validate ID is a positive integer
    const offerId = parseInt(id)
    if (isNaN(offerId) || offerId <= 0 || !Number.isInteger(offerId)) {
      return reply.status(400).send({ error: 'Invalid ID format. ID must be a positive integer.' })
    }
    
    try {
      await fastify.prisma.$transaction(async (tx) => {
        // Check if offer exists first
        const offer = await tx.offer.findUnique({
          where: { id: offerId },
          select: { applicationId: true },
        })

        if (!offer) {
          throw new Error('Offer not found')
        }

        await tx.offer.delete({
          where: { id: offerId },
        })

        const application = await tx.application.findUnique({
          where: { id: offer.applicationId },
          select: {
            _count: {
              select: { interviews: true, offers: true },
            },
          },
        })

        // Application may already be deleted (or cascading didn't run).
        if (!application) return

        const interviewsCount = application._count.interviews ?? 0
        const offersCount = application._count.offers ?? 0

        const nextStatus =
          offersCount > 0 ? 'offer' : interviewsCount > 0 ? 'interviewing' : 'applied'

        await tx.application.update({
          where: { id: offer.applicationId },
          data: { status: nextStatus },
        })
      })
      return reply.status(204).send()
    } catch (error) {
      fastify.log.error(error)
      const message = (error as { message?: string }).message || ''
      if ((error as { code?: string }).code === 'P2025' || message === 'Offer not found') {
        return reply.status(404).send({ error: 'Offer not found' })
      }
      return reply.status(500).send({ error: 'Internal Server Error' })
    }
  })
}

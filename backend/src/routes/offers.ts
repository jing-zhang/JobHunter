import { FastifyInstance } from "fastify";
import { CreateOfferSchema, UpdateOfferSchema } from "../schemas/offer.js";

export default async function offerRoutes(fastify: FastifyInstance) {
  // GET all offers
  fastify.get("/", async (request, reply) => {
    try {
      const offers = await fastify.prisma.offer.findMany({
        orderBy: { receivedDate: "desc" },
        include: {
          application: {
            select: { company: true, position: true },
          },
        },
      });
      return offers.map((o: any) => ({
        ...o,
        company: o.application?.company || "",
        position: o.application?.position || "",
      }));
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: "Internal Server Error" });
    }
  });

  // POST create offer
  fastify.post("/", async (request, reply) => {
    const parseResult = CreateOfferSchema.safeParse(request.body);

    if (!parseResult.success) {
      return reply.status(400).send({ error: "Validation Error", details: parseResult.error.format() });
    }

    try {
      const benefits =
        Array.isArray(parseResult.data.benefits) ? JSON.stringify(parseResult.data.benefits) : parseResult.data.benefits;
      const [, offer] = await fastify.prisma.$transaction([
        fastify.prisma.application.update({
          where: { id: parseResult.data.applicationId },
          data: {
            status: "offer",
          },
        }),
        fastify.prisma.offer.create({
          data: {
            ...parseResult.data,
            benefits,
            receivedDate: parseResult.data.receivedDate ? new Date(parseResult.data.receivedDate) : new Date(),
            expirationDate: parseResult.data.expirationDate ? new Date(parseResult.data.expirationDate) : null,
          },
        }),
      ]);
      return reply.status(201).send(offer);
    } catch (error) {
      fastify.log.error(error);
      if ((error as any).code === "P2025") {
        return reply.status(404).send({ error: "Application not found" });
      }
      return reply.status(500).send({ error: "Internal Server Error" });
    }
  });

  // PATCH update offer
  fastify.patch("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const parseResult = UpdateOfferSchema.safeParse(request.body);

    if (!parseResult.success) {
      return reply.status(400).send({ error: "Validation Error", details: parseResult.error.format() });
    }

    try {
      const benefits =
        parseResult.data.benefits === undefined
          ? undefined
          : Array.isArray(parseResult.data.benefits)
            ? JSON.stringify(parseResult.data.benefits)
            : parseResult.data.benefits;
      const offer = await fastify.prisma.offer.update({
        where: { id: parseInt(id) },
        data: {
          ...parseResult.data,
          benefits,
          receivedDate: parseResult.data.receivedDate ? new Date(parseResult.data.receivedDate) : undefined,
          expirationDate: parseResult.data.expirationDate ? new Date(parseResult.data.expirationDate) : undefined,
        },
      });
      return offer;
    } catch (error) {
      fastify.log.error(error);
      if ((error as any).code === "P2025") {
        return reply.status(404).send({ error: "Offer not found" });
      }
      return reply.status(500).send({ error: "Internal Server Error" });
    }
  });

  // DELETE offer
  fastify.delete("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      const offerId = parseInt(id);
      await fastify.prisma.$transaction(async (tx) => {
        // Check if offer exists first
        const offer = await tx.offer.findUnique({
          where: { id: offerId },
          select: { applicationId: true },
        });

        if (!offer) {
          throw new Error("Offer not found");
        }

        await tx.offer.delete({
          where: { id: offerId },
        });

        const application = await tx.application.findUnique({
          where: { id: offer.applicationId },
          select: {
            _count: {
              select: { interviews: true, offers: true },
            },
          },
        });

        // Application may already be deleted (or cascading didn't run).
        if (!application) return;

        const interviewsCount = application._count.interviews ?? 0;
        const offersCount = application._count.offers ?? 0;

        const nextStatus = offersCount > 0 ? "offer" : interviewsCount > 0 ? "interviewing" : "applied";

        await tx.application.update({
          where: { id: offer.applicationId },
          data: { status: nextStatus },
        });
      });
      return reply.status(204).send();
    } catch (error) {
      fastify.log.error(error);
      const message = (error as any).message || "";
      if ((error as any).code === "P2025" || message === "Offer not found") {
        return reply.status(404).send({ error: "Offer not found" });
      }
      return reply.status(500).send({ error: "Internal Server Error" });
    }
  });
}

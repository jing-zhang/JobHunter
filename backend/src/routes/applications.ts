import { FastifyInstance } from "fastify";
import { CreateApplicationSchema, UpdateApplicationSchema } from "../schemas/application.js";

export default async function applicationRoutes(fastify: FastifyInstance) {
  // GET all applications
  fastify.get("/", async (request, reply) => {
    try {
      const applications = await fastify.prisma.application.findMany({
        orderBy: { lastUpdated: "desc" },
        include: {
          _count: {
            select: { interviews: true, offers: true },
          },
        },
      });
      return applications;
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: "Internal Server Error" });
    }
  });

  // GET single application by ID
  fastify.get("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      const application = await fastify.prisma.application.findUnique({
        where: { id: parseInt(id) },
        include: {
          interviews: true,
          offers: true,
        },
      });

      if (!application) {
        return reply.status(404).send({ error: "Application not found" });
      }

      return application;
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: "Internal Server Error" });
    }
  });

  // POST create new application
  fastify.post("/", async (request, reply) => {
    const parseResult = CreateApplicationSchema.safeParse(request.body);

    if (!parseResult.success) {
      return reply.status(400).send({ error: "Validation Error", details: parseResult.error.format() });
    }

    try {
      const application = await fastify.prisma.application.create({
        data: {
          ...parseResult.data,
          appliedDate: parseResult.data.appliedDate ? new Date(parseResult.data.appliedDate) : new Date(),
        },
      });
      return reply.status(201).send(application);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: "Internal Server Error" });
    }
  });

  // PATCH update application
  fastify.patch("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const parseResult = UpdateApplicationSchema.safeParse(request.body);

    if (!parseResult.success) {
      return reply.status(400).send({ error: "Validation Error", details: parseResult.error.format() });
    }

    try {
      const application = await fastify.prisma.application.update({
        where: { id: parseInt(id) },
        data: {
          ...parseResult.data,
          appliedDate: parseResult.data.appliedDate ? new Date(parseResult.data.appliedDate) : undefined,
        },
      });
      return application;
    } catch (error) {
      fastify.log.error(error);
      if ((error as any).code === "P2025") {
        return reply.status(404).send({ error: "Application not found" });
      }
      return reply.status(500).send({ error: "Internal Server Error" });
    }
  });

  // DELETE application
  fastify.delete("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      const applicationId = parseInt(id);
      await fastify.prisma.$transaction(async (tx) => {
        // Ensure dependent rows are removed even if SQLite FK cascading isn't enabled.
        await tx.interview.deleteMany({ where: { applicationId } });
        await tx.offer.deleteMany({ where: { applicationId } });
        await tx.application.delete({ where: { id: applicationId } });
      });
      return reply.status(204).send();
    } catch (error) {
      fastify.log.error(error);
      if ((error as any).code === "P2025") {
        return reply.status(404).send({ error: "Application not found" });
      }
      return reply.status(500).send({ error: "Internal Server Error" });
    }
  });
}

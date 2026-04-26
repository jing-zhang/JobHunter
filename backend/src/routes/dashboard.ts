import { FastifyInstance } from "fastify";

export default async function dashboardRoutes(fastify: FastifyInstance) {
  fastify.get("/stats", async (request, reply) => {
    try {
      const activeApplications = await fastify.prisma.application.count({
        where: {
          status: {
            in: ["applied", "interviewing"],
          },
        },
      });

      const upcomingInterviews = await fastify.prisma.interview.count({
        where: {
          status: "scheduled",
          scheduledDate: {
            gte: new Date(),
          },
        },
      });

      const pendingOffers = await fastify.prisma.offer.count({
        where: {
          status: "pending",
        },
      });

      // Simple progress percentage logic: 
      // (interviews + offers) / total applications * 100
      const totalApplications = await fastify.prisma.application.count();
      const progressPct = totalApplications > 0 
        ? Math.round(((totalApplications - activeApplications) / totalApplications) * 100) 
        : 0;

      return {
        stats: {
          activeApplications,
          upcomingInterviews,
          pendingOffers,
          progressPct: Math.min(progressPct, 100),
        },
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: "Internal Server Error" });
    }
  });
}

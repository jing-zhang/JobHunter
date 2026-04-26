import Fastify from "fastify";
import cors from "@fastify/cors";
import prismaPlugin from "./plugins/prisma.js";

const buildApp = async () => {
  const fastify = Fastify({
    logger: {
      transport: {
        target: "pino-pretty",
        options: {
          translateTime: "HH:MM:ss Z",
          ignore: "pid,hostname",
        },
      },
    },
  });

  // Register plugins
  await fastify.register(cors, {
    origin: true, // For development, allow all origins
  });

  await fastify.register(prismaPlugin);

  // Health check
  fastify.get("/health", async () => {
    return { status: "ok" };
  });

  return fastify;
};

export default buildApp;

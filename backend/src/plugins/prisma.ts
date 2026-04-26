import fp from "fastify-plugin";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import Database from "better-sqlite3";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

export default fp(async (fastify) => {
  const url = process.env.DATABASE_URL || "file:./dev.db";
  // Remove 'file:' prefix if present for better-sqlite3
  const dbPath = url.startsWith("file:") ? url.slice(5) : url;
  
  const adapter = new PrismaBetterSqlite3({ url: url }) as any;
  const prisma = new PrismaClient({ adapter });

  await prisma.$connect();

  fastify.decorate("prisma", prisma);

  fastify.addHook("onClose", async (server) => {
    await server.prisma.$disconnect();
    client.close();
  });
});

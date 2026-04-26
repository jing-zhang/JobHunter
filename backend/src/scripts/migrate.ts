import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import Database from "better-sqlite3";

// Determine absolute paths
const DB_JSON_PATH = path.resolve(process.cwd(), "../db.json");
const SQLITE_PATH = path.resolve(process.cwd(), "dev.db");

console.log(`Reading data from: ${DB_JSON_PATH}`);
console.log(`Writing data to: ${SQLITE_PATH}`);

// Initialize Prisma with the Better-SQLite3 adapter
const url = "file:./dev.db";
const adapter = new PrismaBetterSqlite3({ url }) as any;
const prisma = new PrismaClient({ adapter });

async function main() {
  // Read and parse db.json
  const rawData = fs.readFileSync(DB_JSON_PATH, "utf-8");
  const data = JSON.parse(rawData);

  console.log("Starting migration...");

  // 1. Migrate Applications
  if (data.applications && data.applications.length > 0) {
    console.log(`Migrating ${data.applications.length} applications...`);
    for (const app of data.applications) {
      await prisma.application.upsert({
        where: { id: app.id },
        update: {},
        create: {
          id: app.id,
          company: app.company,
          position: app.position,
          location: app.location,
          salary: app.salary,
          status: app.status,
          appliedDate: new Date(app.appliedDate),
          lastUpdated: new Date(app.lastUpdated),
          notes: app.notes,
          url: app.url,
        },
      });
    }
  }

  // 2. Migrate Interviews
  if (data.interviews && data.interviews.length > 0) {
    console.log(`Migrating ${data.interviews.length} interviews...`);
    for (const interview of data.interviews) {
      await prisma.interview.upsert({
        where: { id: interview.id },
        update: {},
        create: {
          id: interview.id,
          applicationId: interview.applicationId,
          type: interview.type,
          scheduledDate: new Date(interview.scheduledDate),
          status: interview.status,
          notes: interview.notes,
          interviewer: interview.interviewer,
          location: interview.location,
        },
      });
    }
  }

  // 3. Migrate Offers
  if (data.offers && data.offers.length > 0) {
    console.log(`Migrating ${data.offers.length} offers...`);
    for (const offer of data.offers) {
      await prisma.offer.upsert({
        where: { id: offer.id },
        update: {},
        create: {
          id: offer.id,
          applicationId: offer.applicationId,
          salary: offer.salary,
          bonus: offer.bonus,
          equity: offer.equity,
          benefits: Array.isArray(offer.benefits) ? JSON.stringify(offer.benefits) : offer.benefits,
          status: offer.status,
          receivedDate: new Date(offer.receivedDate),
          expirationDate: offer.expirationDate ? new Date(offer.expirationDate) : null,
          notes: offer.notes,
        },
      });
    }
  }

  console.log("Migration completed successfully.");
}

main()
  .catch((e) => {
    console.error("Migration failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

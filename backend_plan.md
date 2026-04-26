# JobHunter Backend Development Plan

This document outlines the strategy for transitioning the JobHunter application from a mock JSON server to a persistent, type-safe backend.

## 🚀 Technology Stack
For a personal-use application that needs to be lightweight yet robust, I recommend:

- **Runtime**: Node.js (TypeScript)
- **Framework**: [Fastify](https://www.fastify.io/) — extremely fast, low overhead, and excellent TS support.
- **Database**: [SQLite](https://sqlite.org/) — serverless, file-based, and requires zero configuration.
- **ORM**: [Prisma](https://www.prisma.io/) — provides a type-safe client and easy schema migrations.
- **Validation**: [Zod](https://zod.dev/) — shared schema validation between frontend and backend.
- **Logging**: [Pino](https://getpino.io/) — built into Fastify for efficient logging.

---

## 📂 Project Structure (Backend)
I suggest keeping the backend in a `backend/` directory within the current workspace or as a separate folder if you prefer a monorepo feel.

```text
backend/
├── prisma/
│   └── schema.prisma      # Database models & relations
├── src/
│   ├── routes/            # API endpoints grouped by feature
│   │   ├── applications.ts
│   │   ├── interviews.ts
│   │   ├── offers.ts
│   │   └── dashboard.ts
│   ├── services/          # Business logic & DB queries
│   ├── schemas/           # Zod validation schemas
│   ├── plugins/           # Fastify plugins (CORS, Prisma, etc.)
│   ├── app.ts             # Fastify instance setup
│   └── server.ts          # Entry point
├── .env                   # Environment variables (DB path)
└── package.json
```

---

## 🛠️ Data Model (Prisma Schema)
Based on your current `db.json`, here is the proposed relational schema:

```prisma
// backend/prisma/schema.prisma

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Application {
  id           Int         @id @default(autoincrement())
  company      String
  position     String
  location     String?
  salary       Int?
  status       String      // e.g., 'applied', 'interviewing', 'offer', 'rejected'
  appliedDate  DateTime    @default(now())
  lastUpdated  DateTime    @updatedAt
  notes        String?
  url          String?
  interviews   Interview[]
  offers       Offer[]
}

model Interview {
  id            Int         @id @default(autoincrement())
  application   Application @relation(fields: [applicationId], references: [id], onDelete: Cascade)
  applicationId Int
  type          String      // e.g., 'technical', 'behavioral'
  scheduledDate DateTime
  status        String      // e.g., 'scheduled', 'completed', 'cancelled'
  notes         String?
  interviewer   String?
  location      String?     // e.g., 'Zoom', 'Office'
}

model Offer {
  id             Int         @id @default(autoincrement())
  application    Application @relation(fields: [applicationId], references: [id], onDelete: Cascade)
  applicationId  Int
  salary         Int
  bonus          Int?
  equity         String?
  benefits       String?     // Store as JSON or string
  status         String      // e.g., 'pending', 'accepted', 'rejected'
  receivedDate   DateTime    @default(now())
  expirationDate DateTime?
  notes          String?
}
```

---

## 🗓️ Implementation Phases

### Phase 1: Setup & Initialization
- [ ] Initialize Node/TS project in `backend/`
- [ ] Install dependencies: `fastify`, `@prisma/client`, `zod`, `dotenv`
- [ ] Initialize Prisma: `npx prisma init`
- [ ] Configure `schema.prisma` and run initial migration: `npx prisma migrate dev`

### Phase 2: Core API Endpoints
- [ ] **Applications**: CRUD (Get all, Get by ID, Create, Update Status, Delete)
- [ ] **Interviews**: CRUD and "Upcoming" filter
- [ ] **Offers**: CRUD and comparison logic
- [ ] **Dashboard**: Aggregate stats (active apps, upcoming interviews, offer count)

### Phase 3: Integration & Migration
- [ ] **Seed Script**: Create a script to import your current `db.json` into the SQLite database.
- [ ] **Frontend Update**: Change the `baseURL` in your React `api/client.ts` to point to the new backend.
- [ ] **CORS**: Enable CORS in Fastify to allow requests from the Vite dev server.

### Phase 4: Extras (Personal Use Focus)
- [ ] **Auto-Backup**: Simple script to backup the `dev.db` file to a cloud drive (e.g., Dropbox/Google Drive).
- [ ] **Deployment**: Instructions for running locally as a service (e.g., using `pm2`).

---

## ❓ Why this suggestion?
1. **Low Friction**: You don't need to install Postgres or Docker. SQLite is just a file.
2. **Type Safety**: Prisma generates types automatically from your schema, which can be exported or shared with your frontend.
3. **Performance**: Fastify and SQLite are incredibly efficient for a single-user application.
4. **Future-Proof**: If you ever want to move to the cloud (e.g., Supabase or AWS), Prisma makes it easy to switch from SQLite to PostgreSQL with minimal code changes.

Would you like to start with **Phase 1** and initialize the backend project?

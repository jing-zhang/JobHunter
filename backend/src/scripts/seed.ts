import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const url = process.env.DATABASE_URL || 'file:./dev.db'
const adapter = new PrismaBetterSqlite3({ url }) as any
const prisma = new PrismaClient({ adapter })

const toIso = (d: Date) => d.toISOString()

async function main() {
  const now = new Date()

  // Reset (order matters because of FKs)
  await prisma.offer.deleteMany()
  await prisma.interview.deleteMany()
  await prisma.application.deleteMany()

  const applications = await prisma.application.createManyAndReturn({
    data: [
      {
        company: 'Acme Corp',
        position: 'Frontend Engineer',
        location: 'Remote',
        salary: 135000,
        status: 'applied',
        appliedDate: new Date(Date.UTC(2026, 3, 20)),
        notes: 'Found via referral.',
        url: 'https://example.com/jobs/acme-frontend',
      },
      {
        company: 'Globex',
        position: 'Full Stack Developer',
        location: 'Toronto, ON',
        salary: 145000,
        status: 'interviewing',
        appliedDate: new Date(Date.UTC(2026, 3, 10)),
        notes: 'Recruiter reached out on LinkedIn.',
        url: 'https://example.com/jobs/globex-fullstack',
      },
      {
        company: 'Initech',
        position: 'Backend Engineer',
        location: 'Hybrid',
        salary: 155000,
        status: 'offer',
        appliedDate: new Date(Date.UTC(2026, 2, 28)),
        notes: 'Strong match with Go + Fastify experience.',
        url: 'https://example.com/jobs/initech-backend',
      },
      {
        company: 'Hooli',
        position: 'Software Engineer',
        location: 'San Francisco, CA',
        salary: 180000,
        status: 'rejected',
        appliedDate: new Date(Date.UTC(2026, 1, 14)),
        notes: 'Rejected after onsite.',
        url: 'https://example.com/jobs/hooli-swe',
      },
    ],
  })

  const acme = applications.find((a) => a.company === 'Acme Corp')!
  const globex = applications.find((a) => a.company === 'Globex')!
  const initech = applications.find((a) => a.company === 'Initech')!

  await prisma.interview.createMany({
    data: [
      {
        applicationId: globex.id,
        type: 'technical',
        scheduledDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
        status: 'scheduled',
        interviewer: 'John Doe',
        location: 'Zoom',
        notes: 'Leetcode medium + system design light.',
      },
      {
        applicationId: globex.id,
        type: 'behavioral',
        scheduledDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        status: 'completed',
        interviewer: 'Jane Smith',
        location: 'Zoom',
        notes: 'Team fit + motivation.',
      },
      {
        applicationId: initech.id,
        type: 'final',
        scheduledDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        status: 'completed',
        interviewer: 'Hiring Manager',
        location: 'Office',
        notes: 'Architecture deep dive.',
      },
    ],
  })

  await prisma.offer.createMany({
    data: [
      {
        applicationId: initech.id,
        salary: 165000,
        bonus: 20000,
        equity: '120k RSU / 4y',
        benefits: JSON.stringify(['Health', 'Dental', 'Vision', '401k Match']),
        status: 'pending',
        receivedDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        expirationDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
        notes: 'Negotiating base + sign-on.',
      },
    ],
  })

  // Keep statuses consistent (in case schema defaults change)
  await prisma.application.update({
    where: { id: acme.id },
    data: { status: 'applied' },
  })
  await prisma.application.update({
    where: { id: globex.id },
    data: { status: 'interviewing' },
  })
  await prisma.application.update({
    where: { id: initech.id },
    data: { status: 'offer' },
  })

  const counts = {
    applications: await prisma.application.count(),
    interviews: await prisma.interview.count(),
    offers: await prisma.offer.count(),
  }

  console.log('Seeded data:', counts)
  console.log('Database URL:', url)
  console.log('Seed run at:', toIso(now))
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


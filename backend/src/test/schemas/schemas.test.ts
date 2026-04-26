import { describe, expect, it } from 'vitest'
import { CreateApplicationSchema } from '../../schemas/application.js'
import { CreateInterviewSchema } from '../../schemas/interview.js'
import { CreateOfferSchema } from '../../schemas/offer.js'

describe('zod schemas', () => {
  it('accepts empty url for applications', () => {
    const parsed = CreateApplicationSchema.parse({
      company: 'Acme',
      position: 'Engineer',
      url: '',
    })

    expect(parsed.url).toBe('')
  })

  it('requires scheduledDate to be an ISO datetime string', () => {
    const res = CreateInterviewSchema.safeParse({
      applicationId: 1,
      type: 'technical',
      scheduledDate: '2024-01-01',
    })

    expect(res.success).toBe(false)
  })

  it('requires positive salary for offers', () => {
    const res = CreateOfferSchema.safeParse({
      applicationId: 1,
      salary: -5,
    })

    expect(res.success).toBe(false)
  })
})


import { z } from 'zod'

const DateStringSchema = z
  .string()
  .min(1)
  .refine((value) => !Number.isNaN(Date.parse(value)), 'Invalid date')

export const CreateInterviewSchema = z.object({
  applicationId: z.number().int().positive(),
  type: z.enum(['phone_screen', 'technical', 'behavioral', 'portfolio_review', 'final']),
  // Accept `datetime-local` values like `YYYY-MM-DDTHH:mm` from the browser.
  scheduledDate: DateStringSchema,
  status: z.enum(['scheduled', 'completed', 'cancelled']).default('scheduled'),
  notes: z.string().optional().nullable(),
  interviewer: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
})

export const UpdateInterviewSchema = CreateInterviewSchema.partial()

export type CreateInterviewInput = z.infer<typeof CreateInterviewSchema>
export type UpdateInterviewInput = z.infer<typeof UpdateInterviewSchema>

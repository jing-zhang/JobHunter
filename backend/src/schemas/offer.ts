import { z } from "zod";

export const CreateOfferSchema = z.object({
  applicationId: z.number().int().positive(),
  salary: z.number().positive(),
  bonus: z.number().optional().nullable(),
  equity: z.string().optional().nullable(),
  benefits: z.string().optional().nullable(),
  status: z.enum(["pending", "accepted", "rejected"]).default("pending"),
  receivedDate: z.string().datetime().optional().nullable(),
  expirationDate: z.string().datetime().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const UpdateOfferSchema = CreateOfferSchema.partial();

export type CreateOfferInput = z.infer<typeof CreateOfferSchema>;
export type UpdateOfferInput = z.infer<typeof UpdateOfferSchema>;

import { z } from "zod";

const DateStringSchema = z
  .string()
  .min(1)
  .refine((value) => !Number.isNaN(Date.parse(value)), "Invalid date");

export const CreateOfferSchema = z.object({
  applicationId: z.number().int().positive(),
  salary: z.number().positive(),
  bonus: z.number().optional().nullable(),
  equity: z.string().optional().nullable(),
  // Frontend sends `benefits` as an array; store as JSON string in DB.
  benefits: z.union([z.array(z.string()), z.string()]).optional().nullable(),
  // Frontend uses `declined`/`expired`; backend historically used `rejected`.
  status: z.enum(["pending", "accepted", "declined", "expired", "rejected"]).default("pending"),
  receivedDate: DateStringSchema.optional().nullable(),
  expirationDate: DateStringSchema.optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const UpdateOfferSchema = CreateOfferSchema.partial();

export type CreateOfferInput = z.infer<typeof CreateOfferSchema>;
export type UpdateOfferInput = z.infer<typeof UpdateOfferSchema>;

import { z } from "zod";

const DateStringSchema = z
  .string()
  .min(1)
  .refine((value) => !Number.isNaN(Date.parse(value)), "Invalid date");

export const CreateApplicationSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  position: z.string().min(1, "Position is required"),
  location: z.string().optional().nullable(),
  salary: z.number().optional().nullable(),
  status: z.enum(["applied", "interviewing", "offer", "rejected"]).default("applied"),
  // Frontend often sends `YYYY-MM-DD`; accept any Date.parse-able string.
  appliedDate: DateStringSchema.optional().nullable(),
  notes: z.string().optional().nullable(),
  url: z.string().url("Invalid URL").optional().or(z.literal("")).nullable(),
});

export const UpdateApplicationSchema = CreateApplicationSchema.partial();

export type CreateApplicationInput = z.infer<typeof CreateApplicationSchema>;
export type UpdateApplicationInput = z.infer<typeof UpdateApplicationSchema>;

import { z } from "zod";

export const CreateApplicationSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  position: z.string().min(1, "Position is required"),
  location: z.string().optional().nullable(),
  salary: z.number().optional().nullable(),
  status: z.enum(["applied", "interviewing", "offer", "rejected"]).default("applied"),
  appliedDate: z.string().datetime().optional().nullable(),
  notes: z.string().optional().nullable(),
  url: z.string().url("Invalid URL").optional().or(z.literal("")).nullable(),
});

export const UpdateApplicationSchema = CreateApplicationSchema.partial();

export type CreateApplicationInput = z.infer<typeof CreateApplicationSchema>;
export type UpdateApplicationInput = z.infer<typeof UpdateApplicationSchema>;

import { z } from "zod";

export const adminEventSchema = z.object({
  title: z.string().min(2).max(160),
  description: z.string().min(10).max(1024),
  moreDescription: z.string().max(4000).optional().or(z.literal("")),
  domain: z.string().min(2).max(120),
  highlights: z.string().max(1024).optional().or(z.literal("")),
  timeline: z.string().max(1024).optional().or(z.literal("")),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD")
    .optional()
    .or(z.literal("")),
  thumbnailUrl: z.string().url().max(1024).optional().or(z.literal("")),
  detailImageUrl: z.string().url().max(1024).optional().or(z.literal("")),
});

export type AdminEventInput = z.infer<typeof adminEventSchema>;

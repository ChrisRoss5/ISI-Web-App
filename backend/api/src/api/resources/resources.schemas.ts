import * as z from "zod";

export const resourceSchema = z.object({
  location: z.string().min(1, "Content is required"),
  indicator: z.string().min(1, "Content is required"),
  subject: z.string().min(1, "Content is required"),
  measure: z.string().min(1, "Content is required"),
  frequency: z.string().min(1, "Content is required"),
  time: z.string().min(1, "Content is required"),
  value: z.number(),
  flagCodes: z.string().nullable(),
});

export type ResourceInput = z.infer<typeof resourceSchema>;

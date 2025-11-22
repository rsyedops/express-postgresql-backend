import z from "zod";

export const errorResponseSchema = z.object({
  errors: z.record(z.string(), z.array(z.string())),
});
export type ErrorResponse = z.infer<typeof errorResponseSchema>;

import { Request } from "express";
import z from "zod";

export const errorResponseSchema = z.object({
  errors: z.record(z.string(), z.array(z.string())),
});
export type ErrorResponse = z.infer<typeof errorResponseSchema>;

export const authenticatedRequestSchema = z.object({
  userId: z.string(),
});
export type AuthenticatedRequest = Request & z.infer<typeof authenticatedRequestSchema>;

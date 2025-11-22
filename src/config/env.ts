import z from "zod";

export const env = z
  .object({
    DATABASE_URL: z.url(),
    JWT_EXP: z.coerce.number(),
    JWT_ISSUER: z.string(),
    JWT_SECRET: z.string(),
    PORT: z.coerce.number(),
  })
  .parse(process.env);

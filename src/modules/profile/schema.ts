import z from "zod";

export const profileSchema = z.object({
  bio: z.string().nullable(),
  following: z.boolean(),
  image: z.string().nullable(),
  username: z.string(),
});
export const profileResponseSchema = z.object({
  profile: profileSchema,
});

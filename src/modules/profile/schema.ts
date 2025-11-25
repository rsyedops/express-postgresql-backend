import z from "zod";

export const profileResponseSchema = z.object({
  profile: z.object({
    bio: z.string().nullable(),
    following: z.boolean(),
    image: z.string().nullable(),
    username: z.string(),
  }),
});

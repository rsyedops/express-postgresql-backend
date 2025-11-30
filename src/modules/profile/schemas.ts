import z from "zod";

export const profileSchema = z.object({
  bio: z.string().nullable(),
  following: z.boolean(),
  image: z.string().nullable(),
  username: z.string(),
});
export type Profile = z.infer<typeof profileSchema>;

export const profileResponseSchema = z.object({
  profile: profileSchema,
});
export type ProfileResponse = z.infer<typeof profileResponseSchema>;

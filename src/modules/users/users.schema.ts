import z from "zod";

export const registerUserSchema = z.object({
  user: z.object(
    {
      email: z.email("valid email is required"),
      password: z.string("password is required"),
      username: z.string("username is required"),
    },
    "user is required",
  ),
});
export type registerUserParams = z.infer<typeof registerUserSchema>;

export const registerUserResponse = z.object({
  user: z.object({
    email: z.email(),
    token: z.string(),
    username: z.string(),
  }),
});
export type RegisterUserResponse = z.infer<typeof registerUserResponse>;

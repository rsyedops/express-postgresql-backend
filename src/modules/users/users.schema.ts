import z from "zod";

export const registerUserSchema = z.object({
  user: z.object({
    email: z.email("valid email is required"),
    password: z.string("password is required"),
    username: z.string("username is required"),
  }),
});
export type registerUserParams = z.infer<typeof registerUserSchema>;

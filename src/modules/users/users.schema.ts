import z from "zod";

const userCredentials = z.object(
  {
    email: z.email("valid email is required"),
    password: z.string("password is required"),
  },
  "user is required",
);

const credentialsWithUsername = userCredentials.extend({
  username: z.string("username is required"),
});

export const loginUserSchema = z.object({
  user: userCredentials,
});
export type LoginUserParams = z.infer<typeof loginUserSchema>;

export const registerUserSchema = z.object({
  user: credentialsWithUsername,
});
export type registerUserParams = z.infer<typeof registerUserSchema>;

// strip extra unwanted keys (e.g. hashed password)
export const authenticateUserResponse = z.object({
  user: credentialsWithUsername.omit({ password: true }).extend({
    token: z.string(),
  }),
});

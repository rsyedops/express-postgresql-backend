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

export const updateUserSchema = z.object({
  user: z.strictObject({
    bio: z.string().optional(),
    email: z.email().optional(),
    image: z.string().optional(),
    password: z.string().optional(),
    username: z.string().optional(),
  }),
});
export type UpdateUserParams = z.infer<typeof updateUserSchema>;

// strip extra unwanted keys (e.g. hashed password)
export const authenticateUserResponseSchema = z.object({
  user: credentialsWithUsername.omit({ password: true }).extend({
    bio: z.string().nullable(),
    image: z.string().nullable(),
    token: z.string(),
  }),
});
export type AuthenticateUserResponse = z.infer<typeof authenticateUserResponseSchema>;

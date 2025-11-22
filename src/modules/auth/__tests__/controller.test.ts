import { app } from "#app.js";
import { ConflictRequestError, NotFoundError, UnauthorizedError } from "#shared/errors.js";
import { errorResponseSchema } from "#shared/schemas.js";
import request from "supertest";
import { describe, expect, it, vi } from "vitest";

import { registerUserParams } from "../schema.js";
import * as usersService from "../service.js";

vi.mock("#modules/auth/service.ts", () => ({
  createUser: vi.fn(),
  loginUser: vi.fn(),
}));

vi.mock("#config/env.ts", () => ({
  env: {
    DATABASE_URL: "postgres://user:pass@localhost:5432/test",
    JWT_EXP: "test-jwt-exp",
    JWT_ISSUER: "test-jwt-issuer",
    JWT_SECRET: "test-jwt-secret",
    PORT: "3000",
  },
}));

const createUser = usersService.createUser as ReturnType<typeof vi.fn>;
const loginUser = usersService.loginUser as ReturnType<typeof vi.fn>;

describe("POST /api/users", () => {
  it("creates user and returns 201 with correct JSON response", async () => {
    const params: registerUserParams = {
      user: {
        email: "test@example.com",
        password: "test-password",
        username: "test",
      },
    };

    const mockedUser = {
      email: params.user.email,
      token: "jwt.token",
      username: params.user.username,
    };

    createUser.mockResolvedValueOnce({
      ...mockedUser,
      id: "uuid",
    });

    const res = await request(app).post("/api/users").send(params);

    expect(res.status).toBe(201);
    // should parse response schema and return without extra info (no id or hashed password)
    expect(res.body).toStrictEqual({ user: mockedUser });
  });

  it("rejects existing emails and/or usernames with 409", async () => {
    const params: registerUserParams = {
      user: {
        email: "existing@email.com",
        password: "password",
        username: "existing",
      },
    };

    createUser.mockRejectedValueOnce(new ConflictRequestError("email already exists"));

    const res = await request(app).post("/api/users").send(params);

    expect(res.status).toBe(409);
    expect(res.body).toStrictEqual({
      error: "email already exists",
    });
  });

  it("validates request body with correct error response", async () => {
    const params = {
      email: "email@example.com",
      password: "password",
      username: "username",
    };

    const res = await request(app).post("/api/users").send(params);

    expect(res.status).toBe(422);
    expect(res.body).toStrictEqual({
      errors: {
        user: ["user is required"],
      },
    });

    const res2 = await request(app).post("/api/users").send({
      user: {},
    });
    const err = errorResponseSchema.parse(res2.body);

    expect(res2.status).toBe(422);
    expect(err.errors.user).toHaveLength(3);
  });
});

describe("POST /api/users/login", () => {
  it("responds with proper format and no extra properties when credentials are correct", async () => {
    const params = {
      user: {
        email: "test@example.com",
        password: "test-password",
      },
    };

    const mockedUser = {
      email: params.user.email,
      token: "jwt.token",
      username: "test",
    };

    loginUser.mockResolvedValueOnce({
      ...mockedUser,
      hashedPassword: "hashed",
      id: "uuid",
    });

    const res = await request(app).post("/api/users/login").send(params);

    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual({ user: mockedUser });
  });

  it("validates request body with correct error response", async () => {
    const res = await request(app).post("/api/users/login").send({
      email: "email@example.com",
      password: "password",
    });

    expect(res.status).toBe(422);
    expect(res.body).toStrictEqual({
      errors: {
        user: ["user is required"],
      },
    });

    const res2 = await request(app).post("/api/users/login").send({ user: {} });
    const err = errorResponseSchema.parse(res2.body);

    expect(res2.status).toBe(422);
    expect(err.errors.user).toHaveLength(2);
  });

  it("returns 401 when password is invalid", async () => {
    const params = { user: { email: "user@example.com", password: "wrong" } };
    loginUser.mockRejectedValueOnce(new UnauthorizedError("password is invalid"));

    const res = await request(app).post("/api/users/login").send(params);

    expect(res.status).toBe(401);
    expect(res.body).toStrictEqual({ error: "password is invalid" });
  });

  it("returns 404 when user is not found", async () => {
    const params = { user: { email: "missing@example.com", password: "pw" } };
    loginUser.mockRejectedValueOnce(new NotFoundError(`user with email: ${params.user.email} not found`));

    const res = await request(app).post("/api/users/login").send(params);

    expect(res.status).toBe(404);
    expect(res.body).toStrictEqual({ error: `user with email: ${params.user.email} not found` });
  });
});

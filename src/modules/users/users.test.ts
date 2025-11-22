import { app } from "#app.js";
import { ConflictRequestError } from "#shared/errors.js";
import { errorResponseSchema } from "#shared/schemas.js";
import request from "supertest";
import { describe, expect, it, vi } from "vitest";

import { registerUserParams, registerUserResponse } from "./users.schema.js";
import * as usersService from "./users.service.js";

vi.mock("./users.service.ts", () => ({
  createUser: vi.fn(),
}));

const createUser = usersService.createUser as ReturnType<typeof vi.fn>;

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

    createUser.mockResolvedValueOnce(mockedUser);

    const res = await request(app).post("/api/users").send(params);

    const newUser = registerUserResponse.parse(res.body);

    expect(res.status).toBe(201);
    expect(newUser.user).toStrictEqual(mockedUser);
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

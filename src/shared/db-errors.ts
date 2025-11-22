import { DrizzleQueryError } from "drizzle-orm";
import pg from "pg";

export const isUniqueConstraintError = (err: unknown): err is DrizzleQueryError & { cause: pg.DatabaseError } => {
  if (err instanceof DrizzleQueryError && err.cause instanceof pg.DatabaseError && err.cause.code === "23505")
    return true;

  return false;
};

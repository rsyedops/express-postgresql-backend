import { HttpError } from "#shared/errors.js";
import { ErrorResponse } from "#shared/schemas.js";
import { ErrorRequestHandler } from "express";
import z, { ZodError } from "zod";

export const errorMiddleware: ErrorRequestHandler = (err, _req, res, next) => {
  console.log(err);
  if (err instanceof ZodError) {
    return res.status(422).json({
      errors: z.flattenError(err).fieldErrors,
    } satisfies ErrorResponse);
  }

  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      error: err.message,
    });
  }

  res.status(500).json({
    error: "something went wrong",
  });
  next();
};

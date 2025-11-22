export class HttpError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
  }
}
export class BadRequestError extends HttpError {
  constructor(message = "Bad request") {
    super(message, 400);
  }
}

export class ConflictRequestError extends HttpError {
  constructor(message = "Conflict") {
    super(message, 409);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

export class NotFoundError extends HttpError {
  constructor(message = "Not found") {
    super(message, 404);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

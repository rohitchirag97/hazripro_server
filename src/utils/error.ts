import type { ErrorHandler, NotFoundHandler } from "hono";
import { ZodError } from "zod";

export const onError: ErrorHandler = (error, c) => {
  if (error instanceof ZodError) {
    const errors = error.issues.map((issue) => ({
      field: issue.path.join(".") || "root",
      message: issue.message,
    }));

    return c.json({ status: "error", errors }, 400);
  }

  const message =
    error instanceof Error && error.message.trim()
      ? error.message
      : "Something went wrong";

  return c.json({ status: "error", message }, 500);
};

export const onNotFound: NotFoundHandler = (c) => {
  return c.json(
    { status: "error", message: `Route not found: ${c.req.method} ${c.req.path}` },
    404,
  );
};

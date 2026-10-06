import { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export const sendResponse = (
  c: Context,
  status: "success" | "error",
  message: string,
  data?: any,
  statusCode: ContentfulStatusCode = 200,
) => {
  return c.json(
    {
      status,
      message,
      data,
    },
    statusCode,
  );
};
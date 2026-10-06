import { Context } from "hono";

import { getUserById } from "@/services/user.services";
import { verifyToken } from "@/services/jwt.services";
import { sendResponse } from "@/utils/response";

export const authenticate = async (c: Context, next: () => Promise<void>) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendResponse(c, "error", "Unauthorized", null, 401);
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = verifyToken(token);
    if (!decoded) {
      return sendResponse(c, "error", "Unauthorized", null, 401);
    }
    if (typeof decoded === "string" || !decoded.id) {
      return sendResponse(c, "error", "Unauthorized", null, 401);
    }
    const user = await getUserById(decoded.id);
    if (!user) {
      return sendResponse(c, "error", "Unauthorized", null, 401);
    }
    c.set("user", user);
    await next();
  } catch (error) {
    return sendResponse(c, "error", "Unauthorized", null, 401);
  }
};

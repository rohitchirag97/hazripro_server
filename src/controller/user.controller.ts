import { Context } from "hono";
import { updateUserSchema } from "@/validator/user.validator";
import { updateUser } from "@/services/user.services";

export const updateMe = async (c: Context) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ status: "error", message: "Unauthorized" }, 401);
  }
  const updates = updateUserSchema.parse(await c.req.json());
  const updatedUser = await updateUser(user.id, updates);
  if (!updatedUser) {
    return c.json({ status: "error", message: "User not found" }, 404);
  }
  return c.json(
    {
      status: "success",
      message: "User updated successfully",
      user: updatedUser,
    },
    200,
  );
};
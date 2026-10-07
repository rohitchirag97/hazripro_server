import { Context } from "hono";
import {
  createEmployeeSchema,
  updateUserSchema,
} from "@/validator/user.validator";
import { createUser, updateUser } from "@/services/user.services";
import { addUserToOrganization } from "@/services/organizations.services";
import { sendResponse } from "@/utils/response";

export const updateMe: (c: Context) => Promise<Response> = async (
  c: Context,
) => {
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

export const createEmployeeController: (
  c: Context,
) => Promise<Response> = async (c: Context) => {
  const user = c.get("user");
  if (!user) {
    return sendResponse(c, "error", "Unauthorized", null, 401);
  }
  const employeeData = createEmployeeSchema.parse(await c.req.json());
  const createdEmployee = await createUser(employeeData);
  if (!createdEmployee) {
    return sendResponse(c, "error", "Failed to create employee", null, 500);
  }
  await addUserToOrganization(
    employeeData.organizationId,
    createdEmployee.id,
    employeeData.role as Parameters<typeof addUserToOrganization>[2],
  );
  return sendResponse(
    c,
    "success",
    "Employee created successfully",
    { employee: createdEmployee },
    201,
  );
};
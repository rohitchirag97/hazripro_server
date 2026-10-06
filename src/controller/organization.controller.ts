import { Context } from "hono";
import {
  addUserToOrganization,
  createOrganizationService,
  getOrganizationBySlug,
  getOrganizationwithUser,
  getUsersOrganizations,
} from "@/services/organizations.services";
import { sendResponse } from "@/utils/response";
import { createOrganizationSchema } from "@/validator/organization.validator";

export const createOrganization: (c: Context) => Promise<any> = async (
  c: Context,
) => {
  const user = c.get("user");
  if (!user) {
    return sendResponse(c, "error", "Unauthorized", null, 401);
  }
  const { name, slug } = await createOrganizationSchema.parseAsync(
    await c.req.json(),
  );
  const existingOrganization = await getOrganizationBySlug(slug);
  if (existingOrganization) {
    return sendResponse(c, "error", "Organization already exists", null, 400);
  }
  const organization = await createOrganizationService({
    name,
    slug,
    userId: user.id,
  });
  return sendResponse(
    c,
    "success",
    "Organization created successfully",
    organization,
    201,
  );
};

export const getUsersOrganizationsController: (
  c: Context,
) => Promise<any> = async (c: Context) => {
  const user = c.get("user");
  if (!user) {
    return sendResponse(c, "error", "Unauthorized", null, 401);
  }
  const organizations = await getUsersOrganizations(user.id);
  return sendResponse(
    c,
    "success",
    "Organizations fetched successfully",
    organizations,
    200,
  );
};

export const getOrganizationBySlugController: (
  c: Context,
) => Promise<any> = async (c: Context) => {
  const user = c.get("user");
  if (!user) {
    return sendResponse(c, "error", "Unauthorized", null, 401);
  }
  const { organizationSlug } = c.req.param();
  const organization = await getOrganizationwithUser(organizationSlug);
  if (!organization) {
    return sendResponse(c, "error", "Organization not found", null, 404);
  }
  if (!organization.users?.includes(user.id)) {
    return sendResponse(c, "error", "Forbidden", null, 403);
  }
  return sendResponse(
    c,
    "success",
    "Organization fetched successfully",
    organization,
    200,
  );
};

export const addUserToOrganizationController: (
  c: Context,
) => Promise<any> = async (c: Context) => {
  const user = c.get("user");
  if (!user) {
    return sendResponse(c, "error", "Unauthorized", null, 401);
  }
  const { organizationSlug, userId, role } = await c.req.json();
  const organization = await getOrganizationwithUser(organizationSlug);
  if (!organization) {
    return sendResponse(c, "error", "Organization not found", null, 404);
  }
  if (!organization.users?.includes(user.id)) {
    return sendResponse(c, "error", "Forbidden", null, 403);
  }
  const addedUser = await addUserToOrganization(organization.id, userId, role);
  return sendResponse(
    c,
    "success",
    "User added to organization successfully",
    addedUser,
    200,
  );
};

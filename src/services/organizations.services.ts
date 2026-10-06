import db from "@/utils/db";
import { eq } from "drizzle-orm";
import {
  organizationsTable,
  userOrganizationsTable,
  UserRole,
} from "@/drizzle/schema";
import type {
  CreateOrganizationInput,
  Organization,
  OrganizationWithUsers,
} from "@/types/organization.types";

export const createOrganizationService: (
  data: CreateOrganizationInput,
) => Promise<Organization> = async (data: CreateOrganizationInput) => {
  return db.transaction(async (trx) => {
    const [newOrganization] = await trx
      .insert(organizationsTable)
      .values({ name: data.name, slug: data.slug })
      .returning();

    await trx.insert(userOrganizationsTable).values({
      organizationId: newOrganization.id,
      userId: data.userId,
      role: UserRole.SUPER_ADMIN,
    });
    return newOrganization;
  });
};

export const getOrganizationBySlug: (
  slug: string,
) => Promise<typeof organizationsTable.$inferSelect | null> = async (
  slug: string,
) => {
  const [organization] = await db
    .select()
    .from(organizationsTable)
    .where(eq(organizationsTable.slug, slug))
    .limit(1);

  return organization ?? null;
};

export const getOrganizationwithUser: (
  slug: string,
) => Promise<OrganizationWithUsers | null> = async (slug: string) => {
  const organizationRows = await db
    .select({
      id: organizationsTable.id,
      name: organizationsTable.name,
      slug: organizationsTable.slug,
      userId: userOrganizationsTable.userId,
    })
    .from(organizationsTable)
    .leftJoin(
      userOrganizationsTable,
      eq(organizationsTable.id, userOrganizationsTable.organizationId),
    )
    .where(eq(organizationsTable.slug, slug));

  if (organizationRows.length === 0) return null;

  const organization = organizationRows[0];
  return {
    id: organization.id,
    name: organization.name,
    slug: organization.slug,
    users: [
      ...new Set(
        organizationRows.flatMap((row) => (row.userId ? [row.userId] : [])),
      ),
    ],
  };
};

export const getUsersOrganizations: (
  userId: string,
) => Promise<Organization[]> = async (userId: string) => {
  const organizations = await db
    .select({
      id: organizationsTable.id,
      name: organizationsTable.name,
      slug: organizationsTable.slug,
      isActive: organizationsTable.isActive,
    })
    .from(organizationsTable)
    .innerJoin(
      userOrganizationsTable,
      eq(organizationsTable.id, userOrganizationsTable.organizationId),
    )
    .where(eq(userOrganizationsTable.userId, userId));

  return organizations as Organization[];
};

export const addUserToOrganization: (
  organizationId: string,
  userId: string,
  role: UserRole,
) => Promise<typeof userOrganizationsTable.$inferSelect | null> = async (
  organizationId: string,
  userId: string,
  role: UserRole,
) => {
  const [addedUser] = await db
    .insert(userOrganizationsTable)
    .values({ organizationId, userId, role })
    .returning();
  return addedUser ?? null;
};
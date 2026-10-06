import { boolean, uuid, pgTable, varchar } from "drizzle-orm/pg-core";

export enum UserRole {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  EMPLOYEE = "employee",
}

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  fname: varchar("fname", { length: 52 }).notNull(),
  lname: varchar("lname", { length: 52 }).notNull(),
  phone: varchar("phone", { length: 15 }).notNull(),
});

export const organizationsTable = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 52 }).notNull(),
  slug: varchar("slug", { length: 52 }).notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

export const userOrganizationsTable = pgTable("user_organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizationsTable.id),
  role: varchar("role", { length: 52 }).notNull().default(UserRole.EMPLOYEE),
  isActive: boolean("is_active").notNull().default(true),
});

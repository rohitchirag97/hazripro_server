import { eq } from "drizzle-orm";

import db from "@/utils/db";
import { usersTable } from "@/drizzle/schema";

import type { User, CreateUserInput, UpdateUserInput } from "@/types/user.types";

export const createUser: (user: CreateUserInput) => Promise<User> = async (
  user: CreateUserInput,
) => {
  const [newUser] = await db.insert(usersTable).values(user).returning();
  return newUser;
};

export const getUserbyPhone: (phone: string) => Promise<User | null> = async (
  phone: string,
) => {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.phone, phone))
    .limit(1);
  return user ?? null;
};

export const getUserById: (id: string) => Promise<User | null> = async (
  id: string,
) => {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, id as unknown as string))
    .limit(1);
  return user ?? null;
};

export const updateUser = async (
  id: string,
  updates: UpdateUserInput,
): Promise<User | null> => {
  const [updatedUser] = await db
    .update(usersTable)
    .set(updates)
    .where(eq(usersTable.id, id))
    .returning();
  return updatedUser ?? null;
};

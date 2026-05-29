import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { hashPassword } from "@/lib/password";

export type UserRole = "user" | "admin";

export type StoredUser = {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: UserRole;
  createdAt: string;
};

const dataDir = path.join(process.cwd(), "data");
const usersPath = path.join(dataDir, "users.json");

export async function getStoredUsers(): Promise<StoredUser[]> {
  try {
    const raw = await readFile(usersPath, "utf8");
    return JSON.parse(raw) as StoredUser[];
  } catch {
    return [];
  }
}

export async function saveStoredUsers(users: StoredUser[]) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(usersPath, `${JSON.stringify(users, null, 2)}\n`, "utf8");
}

export async function findStoredUserByEmail(email: string) {
  const users = await getStoredUsers();
  return users.find((user) => user.email.toLowerCase() === email.trim().toLowerCase());
}

export async function createStoredUser(input: { email: string; name: string; password: string }) {
  const users = await getStoredUsers();
  const normalizedEmail = input.email.trim().toLowerCase();

  if (users.some((user) => user.email.toLowerCase() === normalizedEmail)) {
    return null;
  }

  const user: StoredUser = {
    id: `user_${randomUUID()}`,
    email: normalizedEmail,
    name: input.name.trim() || normalizedEmail.split("@")[0],
    passwordHash: hashPassword(input.password),
    role: "user",
    createdAt: new Date().toISOString()
  };

  users.push(user);
  await saveStoredUsers(users);
  return user;
}

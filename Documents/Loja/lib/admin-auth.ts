import "server-only";

import { scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { adminCookieName, verifyAdminSessionToken } from "@/lib/admin-session";

export type AdminUser = {
  id: string;
  email: string;
  passwordHash: string;
  role?: string;
};

export function getAdminUsers() {
  const json = process.env.ADMIN_USERS_JSON;

  if (json) {
    try {
      const users = JSON.parse(json) as AdminUser[];
      return users.filter((user) => user.id && user.email && user.passwordHash);
    } catch {
      return [];
    }
  }

  const email = process.env.ADMIN_EMAIL;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!email || !passwordHash) {
    return [];
  }

  return [{ id: "primary", email, passwordHash, role: "owner" }];
}

export function findAdminByEmail(email: string) {
  return getAdminUsers().find((user) => user.email.toLowerCase() === email.trim().toLowerCase());
}

export function verifyPassword(password: string, storedHash: string) {
  const [algorithm, salt, hash] = storedHash.split(":");

  if (algorithm !== "scrypt" || !salt || !hash) {
    return false;
  }

  const expected = Buffer.from(hash, "hex");
  const actual = scryptSync(password, salt, expected.length);

  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export async function isAdminAuthenticated() {
  const token = (await cookies()).get(adminCookieName)?.value;
  return Boolean(await verifyAdminSessionToken(token));
}

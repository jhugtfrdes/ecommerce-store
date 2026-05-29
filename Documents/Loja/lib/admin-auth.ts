import "server-only";

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

export async function isAdminAuthenticated() {
  const token = (await cookies()).get(adminCookieName)?.value;
  const session = await verifyAdminSessionToken(token);
  return session?.role === "admin";
}

import "server-only";

import { cookies } from "next/headers";
import { findAdminByEmail } from "@/lib/admin-auth";
import { adminCookieName, verifyAdminSessionToken } from "@/lib/admin-session";
import { findStoredUserByEmail } from "@/lib/users";

export async function getCurrentSession() {
  return verifyAdminSessionToken((await cookies()).get(adminCookieName)?.value);
}

export async function findIdentityByEmail(email: string) {
  const admin = findAdminByEmail(email);

  if (admin) {
    return {
      id: admin.id,
      email: admin.email,
      name: admin.email.split("@")[0],
      passwordHash: admin.passwordHash,
      role: "admin" as const
    };
  }

  const user = await findStoredUserByEmail(email);

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    passwordHash: user.passwordHash,
    role: user.role
  };
}

import "server-only";

import { getCurrentSession } from "@/lib/auth";

export async function isAdminAuthenticated() {
  const session = await getCurrentSession();
  return session?.role === "admin";
}

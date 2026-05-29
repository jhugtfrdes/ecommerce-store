import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const cookieName = "noir_admin";

export function adminCookieName() {
  return cookieName;
}

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "admin123";
}

export function createAdminToken() {
  const secret = process.env.ADMIN_SESSION_SECRET || getAdminPassword();
  return createHash("sha256").update(`${getAdminPassword()}:${secret}`).digest("hex");
}

export async function isAdminAuthenticated() {
  const token = (await cookies()).get(cookieName)?.value;
  return verifyAdminToken(token);
}

export function verifyAdminToken(token?: string) {
  if (!token) {
    return false;
  }

  const expected = createAdminToken();
  const tokenBuffer = Buffer.from(token);
  const expectedBuffer = Buffer.from(expected);

  return tokenBuffer.length === expectedBuffer.length && timingSafeEqual(tokenBuffer, expectedBuffer);
}

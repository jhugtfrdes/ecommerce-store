import { POST as logout } from "@/app/api/auth/logout/route";

export async function POST() {
  return logout();
}

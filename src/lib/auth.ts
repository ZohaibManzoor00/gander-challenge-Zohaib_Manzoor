import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

import { User } from "@/db/schema";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function getAuthenticatedUser() {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;

  try {
    const user = jwt.verify(token, JWT_SECRET);
    return user;
  } catch {
    return null;
  }
}

export function getUserFromRequest(
  req: Request
): { id: string; email: string; name: string; role: string } | null {
  const cookie = req.headers.get("cookie");
  if (!cookie) return null;
  const token = cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("token="))
    ?.split("=")[1];
  if (!token) return null;
  try {
    const payload = jwt.verify(token, JWT_SECRET) as User;
    return payload;
  } catch {
    return null;
  }
}

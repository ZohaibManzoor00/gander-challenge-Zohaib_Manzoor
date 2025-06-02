import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { User } from "@/db/schema";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET() {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return NextResponse.json({ user: null });
  }

  try {
    const user = jwt.verify(token, JWT_SECRET) as User;
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null });
  }
}

import { and, eq } from "drizzle-orm";
import { users } from "../schema";
import { db } from "..";
import { v4 as uuidGen } from "uuid";

export async function authenticateUser(email: string, password: string) {
  try {
    const user = await db
      .select()
      .from(users)
      .where(and(eq(users.email, email), eq(users.password, password)))
      .limit(1)
      .then((rows) => rows[0] ?? null);

    return user ?? null;
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
}

export async function createUser(userData: {
  email: string;
  password: string;
  name: string;
  role: "admin" | "crew";
  crewId?: string;
}) {
  try {
    const [user] = await db
      .insert(users)
      .values({
        id: uuidGen(),
        email: userData.email,
        password: userData.password,
        name: userData.name,
        role: userData.role,
        crewId: userData.crewId ?? null,
      })
      .returning();

    return user ?? null;
  } catch (error) {
    console.error("Create user error:", error);
    return null;
  }
}

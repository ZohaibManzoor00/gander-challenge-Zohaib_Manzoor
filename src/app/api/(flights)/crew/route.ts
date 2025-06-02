import { getAllCrew } from "@/db/actions/crew-actions";
import { getUserFromRequest } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const user = getUserFromRequest(req);
  if (!user || user.role != "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const flights = await getAllCrew();
    return NextResponse.json(flights);
  } catch (error) {
    console.error("GET /api/crew error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

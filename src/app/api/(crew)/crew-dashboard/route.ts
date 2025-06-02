import { getCrewByUserId, getCrewDashboard } from "@/db/actions/crew-actions";
import { getUserFromRequest } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const crewMember = await getCrewByUserId(user.id);

    if (!crewMember) {
      return NextResponse.json({ error: "Crew not found" }, { status: 404 });
    }

    const data = await getCrewDashboard(crewMember.id);
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/crew-dashboard error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

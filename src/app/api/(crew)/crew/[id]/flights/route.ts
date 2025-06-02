import { getCrewByUserId } from "@/db/actions/crew-actions";
import { getFlightsForCrew } from "@/db/actions/flight-actions";
import { getUserFromRequest } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.role !== "crew") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const crew = await getCrewByUserId(user.id);
    if (!crew) {
      return NextResponse.json(
        { error: "Crew member not found" },
        { status: 404 }
      );
    }
    const flights = await getFlightsForCrew(crew.id);
    return NextResponse.json(flights);
  } catch (error) {
    console.error("GET /api/crew[ID]/flights error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

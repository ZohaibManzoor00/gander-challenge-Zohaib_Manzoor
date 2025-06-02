import { NextResponse } from "next/server";

import {
  createFlight,
  getFlightsWithCrew,
  updateFlight,
} from "@/db/actions/flight-actions";
import { getUserFromRequest } from "@/lib/auth";
  
export async function GET(request: Request) {
  const user = getUserFromRequest(request);
  if (!user || user.role != "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const flights = await getFlightsWithCrew();
    return NextResponse.json(flights);
  } catch (error) {
    console.error("GET /api/flights error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const user = getUserFromRequest(request);
  if (!user || user.role != "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { flightData, crewIds } = await request.json();

    if (!flightData || !crewIds) {
      return NextResponse.json(
        { error: "Missing flightData or crewIds" },
        { status: 400 }
      );
    }

    const newFlight = await createFlight(flightData, crewIds);

    if (!newFlight) {
      return NextResponse.json(
        { error: "Failed to create flight" },
        { status: 500 }
      );
    }

    return NextResponse.json(newFlight, { status: 201 });
  } catch (error) {
    console.error("POST /api/flights error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const user = getUserFromRequest(request);
  if (!user || user.role != "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { flightId, flightData, crewIds } = await request.json();

    if (!flightId || !flightData || !crewIds) {
      return NextResponse.json(
        { error: "Missing flightId, flightData or crewIds" },
        { status: 400 }
      );
    }

    const updatedFlight = await updateFlight(flightId, flightData, crewIds);

    if (!updatedFlight) {
      return NextResponse.json(
        { error: "Failed to update flight" },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedFlight);
  } catch (error) {
    console.error("PUT /api/flights error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { db } from "@/db";
import { flights, crew, flightAssignments } from "@/db/schema";
import { eq, gte } from "drizzle-orm";

export async function getAllFlightDataForAI() {
  const now = new Date();

  try {
    const results = await db
      .select({
        id: flights.id,
        tailNumber: flights.aircraftTailNumber,
        departure: flights.departureAirport,
        arrival: flights.arrivalAirport,
        departureTime: flights.departureTime,
        arrivalTime: flights.arrivalTime,
        crew: crew.name,
        crewRole: crew.role,
      })
      .from(flights)
      .leftJoin(flightAssignments, eq(flightAssignments.flightId, flights.id))
      .leftJoin(crew, eq(crew.id, flightAssignments.crewId))
      .where(gte(flights.departureTime, now))
      .limit(50);

    return results;
  } catch {
    return [];
  }
}

import { eq, inArray, desc } from "drizzle-orm";
import { flights, flightAssignments } from "../schema";
import { db } from "..";
import { getAllCrew } from "./crew-actions";

export async function getAllFlights() {
  try {
    const allFlights = await db
      .select()
      .from(flights)
      .orderBy(desc(flights.departureTime));
    return allFlights;
  } catch (error) {
    console.error("Get flights error:", error);
    return [];
  }
}

export async function getFlightsWithCrew() {
  try {
    const allFlights = await getAllFlights();
    const allAssignments = await db.select().from(flightAssignments);
    const allCrew = await getAllCrew();

    const flightsWithCrew = allFlights.map((flight) => {
      const assignedCrewIds = allAssignments
        .filter((a) => a.flightId === flight.id)
        .map((a) => a.crewId);

      const assignedCrew = allCrew.filter((c) =>
        assignedCrewIds.includes(c.id)
      );

      return { ...flight, assignedCrew };
    });

    return flightsWithCrew;
  } catch (error) {
    console.error("Get flights with crew error:", error);
    return [];
  }
}

export async function getFlightsForCrew(crewId: string) {
  try {
    const assignments = await db
      .select()
      .from(flightAssignments)
      .where(eq(flightAssignments.crewId, crewId));

    if (!assignments.length) return [];

    const flightIds = assignments.map((a) => a.flightId);

    const flightsForCrew = await db
      .select()
      .from(flights)
      .where(inArray(flights.id, flightIds))
      .orderBy(desc(flights.departureTime));

    const allCrew = await getAllCrew();

    const flightsWithCrew = flightsForCrew.map((flight) => {
      const assignedCrewIds = assignments
        .filter((a) => a.flightId === flight.id)
        .map((a) => a.crewId);

      const assignedCrew = allCrew.filter((c) =>
        assignedCrewIds.includes(c.id)
      );

      return { ...flight, assignedCrew };
    });

    return flightsWithCrew;
  } catch (error) {
    console.error("Get flights for crew error:", error);
    return [];
  }
}

export async function createFlight(
  flightData: {
    aircraftTailNumber: string;
    departureAirport: string;
    arrivalAirport: string;
    departureTime: string;
    arrivalTime: string;
    notes?: string;
  },
  crewIds: string[]
) {
  try {
    const [flight] = await db
      .insert(flights)
      .values({
        aircraftTailNumber: flightData.aircraftTailNumber,
        departureAirport: flightData.departureAirport,
        arrivalAirport: flightData.arrivalAirport,
        departureTime: new Date(flightData.departureTime),
        arrivalTime: new Date(flightData.arrivalTime),
        notes: flightData.notes ?? null,
      })
      .returning();

    if (!flight) return null;

    if (crewIds.length > 0) {
      const assignments = crewIds.map((crewId) => ({
        flightId: flight.id,
        crewId,
      }));

      await db.insert(flightAssignments).values(assignments);
    }

    return flight;
  } catch (error) {
    console.error("Create flight error:", error);
    return null;
  }
}

export async function updateFlight(
  flightId: string,
  flightData: Partial<{
    aircraftTailNumber: string;
    departureAirport: string;
    arrivalAirport: string;
    departureTime: string;
    arrivalTime: string;
    notes?: string;
  }>,
  crewIds: string[]
) {
  try {
    const [updatedFlight] = await db
      .update(flights)
      .set({
        aircraftTailNumber: flightData.aircraftTailNumber,
        departureAirport: flightData.departureAirport,
        arrivalAirport: flightData.arrivalAirport,
        departureTime: flightData.departureTime
          ? new Date(flightData.departureTime)
          : undefined,
        arrivalTime: flightData.arrivalTime
          ? new Date(flightData.arrivalTime)
          : undefined,
        notes: flightData.notes,
      })
      .where(eq(flights.id, flightId))
      .returning();

    if (!updatedFlight) return null;

    await db
      .delete(flightAssignments)
      .where(eq(flightAssignments.flightId, flightId));

    if (crewIds.length > 0) {
      const assignments = crewIds.map((crewId) => ({
        flightId,
        crewId,
      }));

      await db.insert(flightAssignments).values(assignments);
    }

    return updatedFlight;
  } catch (error) {
    console.error("Update flight error:", error);
    return null;
  }
}

export async function deleteFlight(flightId: string) {
  try {
    await db
      .delete(flightAssignments)
      .where(eq(flightAssignments.flightId, flightId));

    await db.delete(flights).where(eq(flights.id, flightId));

    return true;
  } catch (error) {
    console.error("Delete flight error:", error);
    return false;
  }
}

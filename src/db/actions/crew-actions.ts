import { eq, asc, gte, and } from "drizzle-orm";
import { crew } from "../schema";
import { db } from "..";
import { flights, flightAssignments } from "@/db/schema";

export async function getAllCrew() {
  try {
    const allCrew = await db.select().from(crew).orderBy(asc(crew.name));
    return allCrew;
  } catch (error) {
    console.error("Get crew error:", error);
    return [];
  }
}

export async function getCrewDashboard(crewId: string) {
  const now = new Date();
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const oneWeekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const upcomingFlights = await db
    .select()
    .from(flights)
    .innerJoin(flightAssignments, eq(flightAssignments.flightId, flights.id))
    .where(and(eq(flightAssignments.crewId, crewId), gte(flights.departureTime, now)));

  const allAssignedFlights = await db
    .select()
    .from(flights)
    .innerJoin(flightAssignments, eq(flightAssignments.flightId, flights.id))
    .where(eq(flightAssignments.crewId, crewId));

  const dutyHours = {
    pastWeek: 0,
    pastMonth: 0,
    nextWeek: 0,
  };

  for (const { flights: f } of allAssignedFlights) {
    const dep = new Date(f.departureTime);
    const arr = new Date(f.arrivalTime);
    const durationInHours = (arr.getTime() - dep.getTime()) / (1000 * 60 * 60);

    if (dep >= oneWeekAgo && dep <= now) dutyHours.pastWeek += durationInHours;
    if (dep >= oneMonthAgo && dep <= now) dutyHours.pastMonth += durationInHours;
    if (dep >= now && dep <= oneWeekFromNow) dutyHours.nextWeek += durationInHours;
  }

  return {
    upcomingFlights: upcomingFlights.map((f) => f.flights),
    dutyHours,
  };
}

export async function getCrewByUserId(userId: string) {
  try {
    const crewMember = await db
      .select()
      .from(crew)
      .where(eq(crew.userId, userId))
      .limit(1)
      .then((rows) => rows[0] ?? null);

    return crewMember;
  } catch (error) {
    console.error("Get crew by user ID error:", error);
    return null;
  }
}

export async function getCrewById(crewId: string) {
  try {
    const crewMember = await db
      .select()
      .from(crew)
      .where(eq(crew.id, crewId))
      .limit(1)
      .then((rows) => rows[0] ?? null);

    return crewMember;
  } catch (error) {
    console.error("Get crew by ID error:", error);
    return null;
  }
}

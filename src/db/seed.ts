import { db } from "@/db/index";
import { users, crew, flights, flightAssignments } from "@/db/schema";
import { sql } from "drizzle-orm";
import { randomUUID } from "crypto";

const userIds = {
  admin1: "admin-uuid-1",
  admin2: "admin-uuid-2",
  user3: "ff8f1df6-adfa-4c8f-86cd-bbf04cea0a71", 
  user4: "user4-static-id",
  user5: "user5-static-id",
  user6: "user6-static-id",
};

const crewIds = {
  crew1: randomUUID(),
  crew2: randomUUID(),
  crew3: randomUUID(),
  crew4: randomUUID(),
  crew5: randomUUID(),
  crew6: randomUUID(),
};

const flightIds = {
  flight1: randomUUID(),
  flight2: randomUUID(),
  flight3: randomUUID(),
  flight4: randomUUID(),
  flight5: randomUUID(),
  flight6: randomUUID(),
};

const mockUsers: {
  id: string;
  email: string;
  password: string;
  name: string;
  role: "admin" | "crew";
  crewId: string | null;
}[] = [
  {
    id: userIds.admin1,
    email: "admin@charterops.com",
    password: "admin123",
    name: "Charter Operations Manager",
    role: "admin",
    crewId: null,
  },
  {
    id: userIds.admin2,
    email: "dispatch@charterops.com",
    password: "dispatch123",
    name: "Flight Dispatcher",
    role: "admin",
    crewId: null,
  },
  {
    id: userIds.user3,
    email: "john.smith@charterops.com",
    password: "pilot123",
    name: "John Smith",
    role: "crew",
    crewId: crewIds.crew1,
  },
  {
    id: userIds.user4,
    email: "sarah.johnson@charterops.com",
    password: "pilot123",
    name: "Sarah Johnson",
    role: "crew",
    crewId: crewIds.crew2,
  },
  {
    id: userIds.user5,
    email: "michael.brown@charterops.com",
    password: "crew123",
    name: "Michael Brown",
    role: "crew",
    crewId: crewIds.crew3,
  },
  {
    id: userIds.user6,
    email: "emily.davis@charterops.com",
    password: "pilot123",
    name: "Emily Davis",
    role: "crew",
    crewId: crewIds.crew4,
  },
];

const mockCrew = [
  {
    id: crewIds.crew1,
    name: "John Smith",
    role: "Captain",
    userId: userIds.user3,
  },
  {
    id: crewIds.crew2,
    name: "Sarah Johnson",
    role: "First Officer",
    userId: userIds.user4,
  },
  {
    id: crewIds.crew3,
    name: "Michael Brown",
    role: "Flight Attendant",
    userId: userIds.user5,
  },
  {
    id: crewIds.crew4,
    name: "Emily Davis",
    role: "Captain",
    userId: userIds.user6,
  },
  {
    id: crewIds.crew5,
    name: "Robert Wilson",
    role: "First Officer",
    userId: null,
  },
  {
    id: crewIds.crew6,
    name: "Jessica Martinez",
    role: "Flight Attendant",
    userId: null,
  },
];

const now = new Date();

const addDays = (date: Date, n: number) =>
  new Date(date.getTime() + n * 86400000);
const subDays = (date: Date, n: number) =>
  new Date(date.getTime() - n * 86400000);

const at = (d: Date, h: number, m = 0) => {
  const copy = new Date(d);
  copy.setHours(h, m, 0, 0);
  return copy;
};

const flightsData = [
  {
    id: flightIds.flight1,
    aircraftTailNumber: "N12345",
    departureAirport: "KJFK",
    arrivalAirport: "KLAX",
    departureTime: at(now, 9),
    arrivalTime: at(now, 15),
    notes: "VIP client, 4 passengers, catering required",
  },
  {
    id: flightIds.flight2,
    aircraftTailNumber: "N54321",
    departureAirport: "KLAX",
    arrivalAirport: "KLAS",
    departureTime: at(addDays(now, 1), 14),
    arrivalTime: at(addDays(now, 1), 15),
    notes: "2 passengers, no special requirements",
  },
  {
    id: flightIds.flight3,
    aircraftTailNumber: "N78901",
    departureAirport: "KLAS",
    arrivalAirport: "KDEN",
    departureTime: at(addDays(now, 2), 10),
    arrivalTime: at(addDays(now, 2), 12),
    notes: "Full aircraft, 8 passengers, special meal requests",
  },
  {
    id: flightIds.flight4,
    aircraftTailNumber: "N12345",
    departureAirport: "KDEN",
    arrivalAirport: "KJFK",
    departureTime: at(addDays(now, 7), 7),
    arrivalTime: at(addDays(now, 7), 13),
    notes: "Repositioning flight, no passengers",
  },
  {
    id: flightIds.flight5,
    aircraftTailNumber: "N54321",
    departureAirport: "KMIA",
    arrivalAirport: "KTEB",
    departureTime: at(subDays(now, 1), 11),
    arrivalTime: at(subDays(now, 1), 14),
    notes: "Business trip, 6 passengers, ground transport arranged",
  },
  {
    id: flightIds.flight6,
    aircraftTailNumber: "N78901",
    departureAirport: "KBOS",
    arrivalAirport: "KSFO",
    departureTime: at(addDays(now, 3), 16),
    arrivalTime: at(addDays(now, 3), 22),
    notes: "Tech conference attendees, 5 passengers",
  },
];

const flightAssignmentsData: [string, string[]][] = [
  [flightIds.flight1, [crewIds.crew1, crewIds.crew2, crewIds.crew3]],
  [flightIds.flight2, [crewIds.crew4, crewIds.crew5]],
  [flightIds.flight3, [crewIds.crew1, crewIds.crew5, crewIds.crew6]],
  [flightIds.flight4, [crewIds.crew4, crewIds.crew2]],
  [flightIds.flight5, [crewIds.crew2, crewIds.crew3]],
  [flightIds.flight6, [crewIds.crew1, crewIds.crew2]],
];

async function seed() {
  console.log(":seedling: Seeding database...");

  await db.execute(sql`DELETE FROM flight_assignments`);
  await db.execute(sql`DELETE FROM flights`);
  await db.execute(sql`DELETE FROM crew`);
  await db.execute(sql`DELETE FROM users`);

  await db.insert(users).values(mockUsers);
  await db.insert(crew).values(mockCrew);
  await db.insert(flights).values(flightsData);

  const assignments = flightAssignmentsData.flatMap(([flightId, crewIds]) =>
    crewIds.map((crewId) => ({
      flightId,
      crewId,
    }))
  );
  await db.insert(flightAssignments).values(assignments);

  console.log(":white_check_mark: Seed complete.");
}

seed().catch((err) => {
  console.error(":x: Seed failed:", err);
  process.exit(1);
});

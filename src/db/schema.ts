import {
  pgTable as table,
  uuid,
  text,
  timestamp,
  varchar,
  primaryKey,
} from "drizzle-orm/pg-core";

export const users = table("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(), // e.g. Flight Dispatcher, Manager, Supervisor
  role: text("role", { enum: ["admin", "crew"] }).notNull(),
  crewId: text("crew_id"),
});

export const crew = table("crew", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(), // e.g. Captain, Pilot, Flight Attendant, Loadmaster
  userId: text("user_id")
});

export const flights = table("flights", {
  id: uuid("id").defaultRandom().primaryKey(),
  aircraftTailNumber: varchar("aircraft_tail_number", { length: 10 }).notNull(),
  departureAirport: varchar("departure_airport", { length: 10 }).notNull(),
  arrivalAirport: varchar("arrival_airport", { length: 10 }).notNull(),
  departureTime: timestamp("departure_time", { withTimezone: true }).notNull(),
  arrivalTime: timestamp("arrival_time", { withTimezone: true }).notNull(),
  notes: text("notes"),
});

export const flightAssignments = table(
  "flight_assignments",
  {
    flightId: uuid("flight_id")
      .notNull()
      .references(() => flights.id, {
        onDelete: "cascade",
      }),
    crewId: text("crew_id")
      .notNull()
      .references(() => crew.id, {
        onDelete: "cascade",
      }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.flightId, table.crewId] }),
  })
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type CrewMember = typeof crew.$inferSelect;
export type NewCrewMember = typeof crew.$inferInsert;

export type Flight = typeof flights.$inferSelect;
export type NewFlight = typeof flights.$inferInsert;

export type FlightAssignment = typeof flightAssignments.$inferSelect;
export type NewFlightAssignment = typeof flightAssignments.$inferInsert;

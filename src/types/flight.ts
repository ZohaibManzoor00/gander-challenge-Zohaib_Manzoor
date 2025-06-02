import { CrewMember } from "@/db/schema";

export interface FlightData {
  id: string;
  aircraftTailNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  notes: string;
  assignedCrew: CrewMember[];
}

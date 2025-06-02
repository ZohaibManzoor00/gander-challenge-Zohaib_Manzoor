export type DashboardFlight = {
  id: string;
  aircraftTailNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: Date;
  arrivalTime: Date;
  notes: string | null;
};

export type DutyHoursSummary = {
  pastWeek: number;
  pastMonth: number;
  nextWeek: number;
};

export type CrewDashboard = {
  upcomingFlights: DashboardFlight[];
  dutyHours: DutyHoursSummary;
};

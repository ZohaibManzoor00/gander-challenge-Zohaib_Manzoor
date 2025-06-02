import { useCrewDashboard } from "@/hooks/use-crew-dashboard";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Clock, Plane } from "lucide-react";
import GreetMember from "./greet-member";

const formatDateTime = (date: Date) => {
  return new Date(date).toLocaleString();
};

const calculateFlightDuration = (departure: Date, arrival: Date) => {
  if (!departure || !arrival) return "";

  const departureTime = new Date(departure).getTime();
  const arrivalTime = new Date(arrival).getTime();

  const durationMs = arrivalTime - departureTime;
  const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
  const durationMinutes = Math.floor(
    (durationMs % (1000 * 60 * 60)) / (1000 * 60)
  );

  return `${durationHours}h ${durationMinutes}m`;
};

export function CrewDashboard() {
  const { crewDashboardData, isLoading, isError } = useCrewDashboard();

  if (isLoading) return <h1>Loading dashboard...</h1>;
  if (isError) return <h1>Error Loading dashboard</h1>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          <GreetMember />
        </h2>
        <p className="text-gray-600">View your upcoming assigned flights</p>
      </div>

      <Card className="px-6 pt-8">
        <CardHeader>
          <CardTitle>Duty Hour Tracking</CardTitle>
          <CardDescription>Your recent and upcoming duty hours</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Card className="pb-6">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {(crewDashboardData?.upcomingFlights.length ?? 0) * 4}h
                    </div>
                    <p className="text-sm text-gray-500">Last 7 Days</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {(crewDashboardData?.upcomingFlights.length ?? 0) * 8}h
                    </div>
                    <p className="text-sm text-gray-500">Last 30 Days</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {(crewDashboardData?.upcomingFlights.length ?? 0) * 2}h
                    </div>
                    <p className="text-sm text-gray-500">Next 7 Days</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex items-center justify-center py-8 text-gray-500"></div>
          </div>
        </CardContent>
      </Card>

      {crewDashboardData?.upcomingFlights.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-gray-500">
              No flights assigned to you at this time.
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {crewDashboardData?.upcomingFlights.map((flight) => (
            <Card key={flight.id} className="overflow-hidden">
              <CardHeader className="bg-blue-50 p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center text-lg">
                      <Plane className="h-5 w-5 mr-2 text-blue-600" />
                      {flight.departureAirport} → {flight.arrivalAirport}
                    </CardTitle>
                    <CardDescription>
                      Flight #{flight.id.slice(-4)}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-white">
                    {flight.aircraftTailNumber}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Departure
                    </div>
                    <div className="font-medium">
                      {formatDateTime(flight.departureTime)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Arrival
                    </div>
                    <div className="font-medium">
                      {formatDateTime(flight.arrivalTime)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    Duration:{" "}
                    {calculateFlightDuration(
                      flight.departureTime,
                      flight.arrivalTime
                    )}
                  </div>
                  <div className="flex items-center text-sm text-gray-600" />
                </div>

                {flight.notes && (
                  <div className="pt-2 border-t border-gray-100">
                    <div className="text-sm text-gray-500 mb-1">Notes:</div>
                    <div className="text-sm">{flight.notes}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

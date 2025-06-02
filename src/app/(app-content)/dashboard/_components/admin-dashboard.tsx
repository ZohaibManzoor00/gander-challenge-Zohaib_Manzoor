"use client";

import { useState } from "react";
import {
  Plane,
  Calendar,
  Users,
  Clock,
  PlusIcon,
  Bot,
} from "lucide-react";

import { useFlights } from "@/hooks/use-flights";
import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CreateFlightForm } from "./create-flight-form";
import { AIChatModal } from "./ai-chat";
import { cn } from "@/lib/utils";

export function AdminDashboard() {
  const { user, loading } = useUser();
  const [showForm, setShowForm] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading) return <h1>Auth Loading...</h1>;

  return (
    <>
      <div className="flex justify-between">
        <div>
          <h1 className="text-xl font-semibold">Flight Schedule</h1>
          <h4 className="text-sm pt-1 font-semibold text-gray-600">
            {user?.name}
          </h4>
        </div>

        <div>
          {showForm ? (
            <>
              <Button size="sm" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </>
          ) : (
            <div className="flex gap-x-2">
              <Button size="sm" onClick={() => setShowForm(true)}>
                <PlusIcon className="size-4 text-white" />
                Add Flight
              </Button>

              {/* <div className="flex items-center justify-center p-4"> */}
              <Button
                size="sm"
                onClick={() => setIsModalOpen(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Bot />
                Chat with AI
              </Button>

              <AIChatModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
              />
              {/* </div> */}
            </div>
          )}
        </div>
      </div>
      {showForm && (
        <div className="pt-4">
          <CreateFlightForm />
        </div>
      )}
      <div className="h-4" />

      <FlightTable />
    </>
  );
}

function FlightTable() {
  const { flights, isLoading, isError } = useFlights();

  if (isLoading) return <h2>Loading Flights...</h2>;
  if (isError || !flights) return <h2>Error Loading Flights</h2>;
  if (flights.length === 0) return <h1>Add your first flight</h1>;

  return (
    <div>
      <div className="grid gap-4">
        {flights.map((flight) => {
          const isCompleted = new Date(flight.arrivalTime) < new Date();
          return (
            <Card
              key={flight.id}
              className={cn(
                "overflow-hidden border-l-4 border-l-blue-500 hover:shadow-md transition-shadow",
                isCompleted && "border-l-green-500"
              )}
            >
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div
                    className={cn(
                      "p-4 md:w-1/3 flex flex-col justify-center space-y-3 bg-blue-50",
                      isCompleted && "bg-green-50"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-center">
                        <div className="font-bold text-xl">
                          {flight.departureAirport}
                        </div>
                        <div className="text-xs text-gray-600">
                          {new Date(flight.departureTime).toLocaleDateString()}
                        </div>
                        <div
                          className={cn(
                            "text-sm font-medium text-blue-700",
                            isCompleted && "text-green-700"
                          )}
                        >
                          {new Date(flight.departureTime).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </div>
                      </div>
                      <Plane
                        className={cn(
                          "size-8 text-blue-600 mx-2",
                          isCompleted && "text-green-600"
                        )}
                      />
                      <div className="text-center">
                        <div className="font-bold text-xl">
                          {flight.arrivalAirport}
                        </div>
                        <div className="text-xs text-gray-600">
                          {new Date(flight.arrivalTime).toLocaleDateString()}
                        </div>
                        <div
                          className={cn(
                            "text-sm font-medium text-blue-700",
                            isCompleted && "text-green-600"
                          )}
                        >
                          {new Date(flight.arrivalTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <span className="text-sm font-medium bg-white px-3 py-1 rounded-full shadow-sm">
                        {flight.aircraftTailNumber}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 md:w-2/3 space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Calendar
                          className={cn(
                            "h-4 w-4 text-blue-600 mr-1",
                            isCompleted && "text-green-600"
                          )}
                        />
                        <span className="font-medium">
                          {isCompleted && "Completed: "}
                          {new Date(flight.departureTime).toLocaleDateString()}
                        </span>
                      </div>
                      <div
                        className={cn(
                          "flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs",
                          isCompleted && "text-green-800 bg-green-100"
                        )}
                      >
                        <Clock className="h-3 w-3" />
                        {(() => {
                          const departureTime = new Date(
                            flight.departureTime
                          ).getTime();
                          const arrivalTime = new Date(
                            flight.arrivalTime
                          ).getTime();
                          const durationMs = arrivalTime - departureTime;
                          const hours = Math.floor(
                            durationMs / (1000 * 60 * 60)
                          );
                          const minutes = Math.floor(
                            (durationMs % (1000 * 60 * 60)) / (1000 * 60)
                          );
                          return `${hours}h ${minutes}m`;
                        })()}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-700">
                          Crew:
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {flight.assignedCrew.length > 0 ? (
                            flight.assignedCrew.map((crew, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 gap-x-1"
                              >
                                <h4 className="underline font-semibold">
                                  {crew.role}
                                </h4>
                                <h4>{crew.name}</h4>
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-red-500 font-medium">
                              Unassigned
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "flex items-center gap-1 bg-amber-100 text-amber-800 px-2 py-1 rounded-full",
                            isCompleted && "bg-green-100 text-green-800"
                          )}
                        >
                          <Users className="h-4 w-4" />
                          <span className="font-medium">
                            {flight.assignedCrew.length}
                          </span>
                        </div>
                      </div>
                    </div>

                    {flight.notes && (
                      <div className="border-t pt-2 mt-2">
                        <p className="text-sm text-gray-600 italic">
                          {flight.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import useSWR from "swr";
import { CrewMember } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function CreateFlightForm() {
  const { data: crew } = useSWR<CrewMember[]>("/api/crew", fetcher);

  const [form, setForm] = useState({
    aircraftTailNumber: "",
    departureAirport: "",
    arrivalAirport: "",
    departureTime: "",
    arrivalTime: "",
    notes: "",
    assignedCrew: [] as string[],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCrewToggle = (id: string) => {
    setForm((prev) => ({
      ...prev,
      assignedCrew: prev.assignedCrew.includes(id)
        ? prev.assignedCrew.filter((c) => c !== id)
        : [...prev.assignedCrew, id],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      flightData: {
        aircraftTailNumber: form.aircraftTailNumber,
        departureAirport: form.departureAirport,
        arrivalAirport: form.arrivalAirport,
        departureTime: form.departureTime,
        arrivalTime: form.arrivalTime,
        notes: form.notes,
      },
      crewIds: form.assignedCrew,
    };

    const res = await fetch("/api/flights", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      alert(`New Flight Created for aircraft ${form.aircraftTailNumber}`);
      setForm({
        aircraftTailNumber: "",
        departureAirport: "",
        arrivalAirport: "",
        departureTime: "",
        arrivalTime: "",
        notes: "",
        assignedCrew: [],
      });
    } else {
      alert("Error creating flight");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-xl mx-auto p-4 border rounded"
    >
      <h2 className="text-xl font-bold">Add New Flight</h2>

      <Input
        name="aircraftTailNumber"
        value={form.aircraftTailNumber}
        onChange={handleChange}
        placeholder="Tail Number"
        required
        className="w-full p-2 border rounded"
      />
      <Input
        name="departureAirport"
        value={form.departureAirport}
        onChange={handleChange}
        placeholder="Departure Airport"
        required
        className="w-full p-2 border rounded"
      />
      <Input
        name="arrivalAirport"
        value={form.arrivalAirport}
        onChange={handleChange}
        placeholder="Arrival Airport"
        required
        className="w-full p-2 border rounded"
      />
      <Input
        name="departureTime"
        type="datetime-local"
        value={form.departureTime}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />
      <Input
        name="arrivalTime"
        type="datetime-local"
        value={form.arrivalTime}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />
      <Textarea
        name="notes"
        value={form.notes}
        onChange={handleChange}
        placeholder="Notes (optional)"
        className="w-full p-2 border rounded"
      />

      <div>
        <p className="font-medium mb-2">Assign Crew Members</p>
        <div className="grid grid-cols-2 gap-2">
          {crew?.map((member) => (
            <label key={member.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.assignedCrew.includes(member.id)}
                onChange={() => handleCrewToggle(member.id)}
              />
              {member.name} ({member.role})
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <Button type="submit" className="px-6 py-2 rounded">
          Submit Flight
        </Button>
      </div>
    </form>
  );
}

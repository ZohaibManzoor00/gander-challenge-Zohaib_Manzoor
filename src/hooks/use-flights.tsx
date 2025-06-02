import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { FlightData } from "@/types/flight";

export function useFlights() {
  const { data, error, mutate } = useSWR<FlightData[]>("/api/flights", fetcher);

  return {
    flights: data,
    isLoading: !data && !error,
    isError: !!error,
    mutate,
  };
}

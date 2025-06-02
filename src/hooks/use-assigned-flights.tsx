import { fetcher } from "@/lib/fetcher";
import useSWR from "swr";

export function useAssignedFlights() {
  return useSWR("/api/crew/flights", fetcher<[]>);
}

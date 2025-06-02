import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { CrewDashboard } from "@/types/crew";

export function useCrewDashboard() {
  const { data, error, mutate } = useSWR<CrewDashboard>(
    "/api/crew-dashboard",
    fetcher
  );

  return {
    crewDashboardData: data,
    isLoading: !data && !error,
    isError: !!error,
    mutate,
  };
}

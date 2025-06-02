import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { CrewMember } from "@/db/schema";

export function useCrew() {
  const { data, error, mutate } = useSWR<CrewMember[]>(
    "/api/crew",
    fetcher<CrewMember[]>
  );

  return {
    crew: data,
    isLoading: !data && !error,
    isError: !!error,
    mutate,
  };
}

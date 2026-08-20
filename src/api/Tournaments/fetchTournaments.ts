import { supabase } from "#/integrations/supabase/supabase.ts";
import type { Tournament } from "#/models/supabaseTables.ts";
import { useCurrentUserId } from "#/api/auth/currentUserId.ts";
import { useQuery } from "@tanstack/react-query";
import { hour } from "#/utils/time.ts";

async function fetchTournamentsFn() {
  const { data, error } = await supabase.from("Tournaments").select("*");
  if (error) {
    console.error("Error fetching tournaments. ", error);
    return [];
  }
  return data as Tournament[];
}

export function useTournaments() {
  const userToken = useCurrentUserId();
  return useQuery({
    queryKey: ["tournaments", userToken],
    queryFn: fetchTournamentsFn,
    staleTime: hour,
  });
}

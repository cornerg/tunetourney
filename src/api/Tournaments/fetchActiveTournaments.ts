import { supabase } from "#/integrations/supabase/supabase.ts";
import type { Tournament } from "#/models/supabaseTables.ts";
import { useCurrentUserId } from "#/api/auth/currentUserId.ts";
import { useQuery } from "@tanstack/react-query";
import { hour } from "#/utils/time.ts";

async function fetchActiveTournamentsFn() {
  const { data, error } = await supabase.rpc("get_active_tournaments");
  if (error) {
    console.error("Error fetching active tournaments. ", error);
    return [];
  }
  return data as Tournament[];
}

export function useActiveTournaments() {
  const userToken = useCurrentUserId();
  return useQuery({
    queryKey: ["activeTournaments", userToken],
    queryFn: fetchActiveTournamentsFn,
    staleTime: hour,
  });
}

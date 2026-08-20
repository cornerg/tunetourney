import { supabase } from "#/integrations/supabase/supabase.ts";
import type { User } from "#/models/supabaseTables.ts";
import { useCurrentUserId } from "#/api/auth/currentUserId.ts";
import { useQuery } from "@tanstack/react-query";
import { hour } from "#/utils/time.ts";

async function fetchTournamentOwnersFn(tournamentid: string | null | undefined) {
  if (!tournamentid) {
    console.error("No tournament ID to get owners");
    return [];
  }
  const { data, error } = await supabase.rpc("get_tournament_owners", {
    tournamentid,
  });
  if (error) {
    console.error("Error fetching tournament owners: ", error);
    return [];
  }
  if (
    typeof data === "object" &&
    data !== null &&
    Object.hasOwn(data as object, "id")
  ) {
    return [data] as User[];
  }
  if (Array.isArray(data)) {
    return data as User[];
  }
  return [];
}

export function useTournamentOwners(tournamentId: string | null | undefined) {
  const currentUserId = useCurrentUserId();
  return useQuery({
    queryKey: ["tournamentOwners", currentUserId, tournamentId],
    queryFn: () => fetchTournamentOwnersFn(tournamentId),
    staleTime: hour,
  });
}

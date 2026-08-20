import { supabase } from "#/integrations/supabase/supabase.ts";
import type { TournamentScore } from "#/models/supabaseUtils.ts";
import { useCurrentUserId } from "#/api/auth/currentUserId.ts";
import { useQuery } from "@tanstack/react-query";
import { hour } from "#/utils/time.ts";

async function fetchTournamentScoresFn(tournamentid: string) {
  if (!tournamentid) return [];
  const { data, error } = await supabase.rpc("get_tournament_scores", {
    tournamentid,
  });
  if (error) {
    console.error("Error fetching tournament scores. ", error);
    return [];
  }
  return data as TournamentScore[];
}

export function useTournamentScores(tournamentId: string) {
  const userToken = useCurrentUserId();
  return useQuery({
    queryKey: ["tournamentScores", tournamentId, userToken],
    queryFn: () => fetchTournamentScoresFn(tournamentId),
    staleTime: hour,
  });
}

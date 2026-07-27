import {supabase} from "#/integrations/supabase/supabase.ts";
import {useQuery} from "@tanstack/react-query";
import type {Tournament} from "#/models/supabaseTables.ts";
import {useCurrentUserId} from "#/api/sessions.ts";
import React from "react";
import type {TournamentScore} from "#/models/supabaseUtils.ts";

const oneHour = 1000 * 60 * 60;

async function fetchTournaments() {
  const { data, error } = await supabase.from('Tournaments').select('*');
  if (error) {
    console.error("Error fetching tournaments. ", error);
    return [];
  }
  return data as Tournament[];
}
export function useTournaments() {
  const userToken = useCurrentUserId();
  return useQuery({ queryKey: ["tournaments", userToken], queryFn: fetchTournaments, staleTime: oneHour });
}

// Get One Tournament
export function useTournament(tournamentId: string | null | undefined) {
  const [tournament, setTournament] = React.useState<Tournament | null>(null);
  const { data: tournaments, ...otherData } = useTournaments();

  React.useEffect(() => {
    setTournament(tournaments?.find((t) => t.id === tournamentId) ?? null);
  }, [tournamentId, tournaments]);

  return { data: tournament, ...otherData };
}

// Get Active Tournaments
async function fetchActiveTournaments() {
  const { data, error } = await supabase.rpc('get_active_tournaments');
  if (error) {
    console.error("Error fetching active tournaments. ", error);
    return [];
  }
  return data as Tournament[];
}
export function useActiveTournaments() {
  const userToken = useCurrentUserId();
  return useQuery({ queryKey: ["activeTournaments", userToken], queryFn: fetchActiveTournaments, staleTime: oneHour });
}

// Get total score across all completed rounds for selected tournaments
async function fetchTournamentScores(tournamentid: string) {
  console.log("Fetch: ", tournamentid);
  if (!tournamentid) return []
  const { data, error } = await supabase.rpc('get_tournament_scores', { tournamentid });
  if (error) {
    console.error("Error fetching tournament scores. ", error);
    return [];
  }
  return data as TournamentScore[];
}
export function useTournamentScores(tournamentId: string) {
  const userToken = useCurrentUserId();
  return useQuery({ queryKey: ["tournamentScores", tournamentId, userToken], queryFn: () => fetchTournamentScores(tournamentId), staleTime: oneHour });
}


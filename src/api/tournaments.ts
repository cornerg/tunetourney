import { useMutation, useQuery } from "@tanstack/react-query";
import { useCurrentUserId } from "#/api/sessions.ts";
import { supabase } from "#/integrations/supabase/supabase.ts";
import type { Tournament } from "#/models/supabaseTables.ts";
import type { TournamentScore } from "#/models/supabaseUtils.ts";

const oneHour = 1000 * 60 * 60;

async function fetchTournaments() {
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
    queryFn: fetchTournaments,
    staleTime: oneHour,
  });
}

// Get Active Tournaments
async function fetchActiveTournaments() {
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
    queryFn: fetchActiveTournaments,
    staleTime: oneHour,
  });
}

// Get total score across all completed rounds for selected tournaments
async function fetchTournamentScores(tournamentid: string) {
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
    queryFn: () => fetchTournamentScores(tournamentId),
    staleTime: oneHour,
  });
}

// Create a Tournament
async function insertTournamentFn(newEntry: Partial<Tournament>) {
  const sortedData = { title: newEntry.title ?? "", club_id: newEntry.club_id ?? "", platform: newEntry.platform ?? "all", round_count: newEntry.round_count ?? 3 };
  const { data, error } = await supabase.rpc("create_tournament", { ...sortedData });
  if (error) {
    console.error("Error adding Tournament", error);
    return null;
  }
  return data as Tournament | undefined;
}
export function useInsertTournament() {
  const currentUserId = useCurrentUserId();
  return useMutation({
    mutationFn: (data: Partial<Tournament>) => insertTournamentFn(data),
    onSuccess: (newEntry, _variables, _onMutateResult, context) => {
      const queryKey = ["tournaments", currentUserId];
      void context.client.setQueryData(queryKey, (old: Tournament[]) => {
        if (newEntry?.id) {
          if (Array.isArray(old)) return [...old, newEntry];
          return [newEntry];
        }
      });
      void context.client.invalidateQueries({ queryKey });
      void context.client.invalidateQueries({
        queryKey: ["activeTournaments", currentUserId]
      });
    },
  });
}

// Update a tournament
async function updateTournamentFn(id: string, tournament: Partial<Tournament>) {
  const { data, error } = await supabase
    .from("Tournaments")
    .update({ ...tournament })
    .eq("id", id)
    .select();
  if (error) {
    console.error("Error updating Tournament", error);
    return null;
  }
  return data?.[0] as Tournament | undefined;
}

type InsertParams = {
  id: string;
} & Partial<Omit<Tournament, "id">>
export function useUpdateTournament() {
  const currentUserId = useCurrentUserId();
  return useMutation({
    mutationFn: ({ id, ...tournament }: InsertParams) => updateTournamentFn(id, tournament),
    onSuccess: (newEntry, _variables, _onMutateResult, context) => {
      const queryKey = ["tournaments", currentUserId];
      context.client.setQueryData(queryKey, (cachedList: Tournament[]) => {
        if (newEntry?.id) {
          const otherEntries = cachedList.filter(row => row.id !== newEntry.id);
          return [...otherEntries, newEntry];
        }
      });
      void context.client.invalidateQueries({ queryKey });
      void context.client.invalidateQueries({
        queryKey: ["activeTournaments", currentUserId],
      });
    },
  });
}

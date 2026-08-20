import type { Tournament } from "#/models/supabaseTables.ts";
import { supabase } from "#/integrations/supabase/supabase.ts";
import { useCurrentUserId } from "#/api/auth/currentUserId.ts";
import { useMutation } from "@tanstack/react-query";

async function insertTournamentFn(newEntry: Partial<Tournament>) {
  const sortedData = {
    title: newEntry.title ?? "",
    club_id: newEntry.club_id ?? "",
    platform: newEntry.platform ?? "all",
    round_count: newEntry.round_count ?? 3,
  };
  const { data, error } = await supabase.rpc("create_tournament", {
    ...sortedData,
  });
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
        queryKey: ["activeTournaments", currentUserId],
      });
    },
  });
}

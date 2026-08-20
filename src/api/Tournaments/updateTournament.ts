import type { Tournament } from "#/models/supabaseTables.ts";
import { supabase } from "#/integrations/supabase/supabase.ts";
import { useCurrentUserId } from "#/api/auth/currentUserId.ts";
import { useMutation } from "@tanstack/react-query";

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
} & Partial<Omit<Tournament, "id">>;
export function useUpdateTournament() {
  const currentUserId = useCurrentUserId();
  return useMutation({
    mutationFn: ({ id, ...tournament }: InsertParams) =>
      updateTournamentFn(id, tournament),
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

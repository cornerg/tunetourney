import type { TournamentUser } from "#/models/supabaseTables.ts";
import { supabase } from "#/integrations/supabase/supabase.ts";
import { useCurrentUserId } from "#/api/auth/currentUserId.ts";
import { useMutation } from "@tanstack/react-query";

export async function insertTournamentUsersFn(
  newEntries: Partial<TournamentUser>[],
) {
  const { data, error } = await supabase
    .from("TournamentUsers")
    .insert(newEntries)
    .select();
  if (error) {
    console.error("Error adding Tournament User", error);
    return null;
  }
  return (data ?? null) as TournamentUser[] | null;
}

export function useInsertTournamentUsers() {
  const currentUserId = useCurrentUserId();
  return useMutation({
    mutationFn: (data: Partial<TournamentUser>[]) =>
      insertTournamentUsersFn(data),
    onSuccess: (newEntries, _variables, _onMutateResult, context) => {
      if (newEntries?.length) {
        const tournamentsQueryKey = ["tournaments", currentUserId];
        const usersQueryKey = ["tournamentUsers", currentUserId, newEntries[0].tournament_id];
        void context.client.invalidateQueries({ queryKey: tournamentsQueryKey });
        void context.client.setQueryData(usersQueryKey, (prev: TournamentUser[] | null) => {
          return Array.isArray(prev) ? [...prev, ...newEntries] : [...newEntries];
        });
      }
    },
  });
}

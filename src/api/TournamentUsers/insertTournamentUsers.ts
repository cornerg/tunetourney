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
  return data?.[0] as TournamentUser | undefined;
}

export function useInsertTournamentUsers() {
  const currentUserId = useCurrentUserId();
  return useMutation({
    mutationFn: (data: Partial<TournamentUser>[]) =>
      insertTournamentUsersFn(data),
    onSuccess: (_newEntry, _variables, _onMutateResult, context) => {
      void context.client.invalidateQueries({
        queryKey: ["tournaments", currentUserId],
      });
    },
  });
}

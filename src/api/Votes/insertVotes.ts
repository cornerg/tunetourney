import type { Vote } from "#/models/supabaseTables.ts";
import { supabase } from "#/integrations/supabase/supabase.ts";
import { useCurrentUserId } from "#/api/auth/currentUserId.ts";
import { useMutation } from "@tanstack/react-query";

async function insertVotesFn(newEntries: Partial<Vote>[]) {
  const { data, error } = await supabase
    .from("Votes")
    .insert([...newEntries])
    .select();
  if (error) {
    console.error("Error adding votes", error);
    return [];
  }
  return data as Vote[];
}

export function useInsertVotes() {
  const userId = useCurrentUserId();
  return useMutation({
    mutationFn: (votes: Partial<Vote>[]) => insertVotesFn(votes),
    onSuccess: (newEntries, _variables, _onMutateResult, context) => {
      const roundId = newEntries[0]?.round_id ?? "";
      const queryKey = ["votes", userId, roundId];
      context.client.setQueryData(queryKey, (old: Vote[]) => {
        if (Array.isArray(newEntries) && newEntries.length > 0) {
          if (Array.isArray(old)) return [...old, ...newEntries];
          return [newEntries];
        }
      });
      void context.client.invalidateQueries({ queryKey });
    },
  });
}

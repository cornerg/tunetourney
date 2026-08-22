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
  const currentUserId = useCurrentUserId();
  return useMutation({
    mutationFn: (votes: Partial<Vote>[]) => insertVotesFn(votes),
    onSuccess: (newEntries, _variables, _onMutateResult, context) => {
      const roundId = newEntries[0]?.round_id ?? "";
      const votesQueryKey = ["votes", currentUserId, roundId];
      const usersQueryKey = ["votedUserIds", currentUserId, roundId];
      void context.client.setQueryData(votesQueryKey, (prev: Vote[]) => {
        if (Array.isArray(newEntries) && newEntries.length > 0) {
          if (Array.isArray(prev)) return [...prev, ...newEntries];
          return [...newEntries];
        }
      });
      void context.client.setQueryData(usersQueryKey, (prev: string[] | null) => {
        const userId = newEntries[0].user_id ?? "";
        return Array.isArray(prev) ? [...prev, userId] : [userId];
      })
      void context.client.invalidateQueries({ queryKey: votesQueryKey });
      void context.client.invalidateQueries({ queryKey: usersQueryKey });
    },
  });
}

import { useMutation, useQuery } from "@tanstack/react-query";
import { useCurrentUserId } from "#/api/sessions.ts";
import { supabase } from "#/integrations/supabase/supabase.ts";
import type { Vote } from "#/models/supabaseTables.ts";

const oneHour = 1000 * 60 * 60;

// Fetch votes
async function fetchVotes(roundid: string | null | undefined) {
  if (!roundid) return [];
  const { data, error } = await supabase.rpc("get_round_votes", { roundid });
  if (error) {
    console.error("Error fetching submissions: ", error);
    return [];
  }
  if (Array.isArray(data)) {
    return data as Vote[];
  }
  return [];
}

export function useVotes(roundId: string | null | undefined) {
  const userId = useCurrentUserId();
  return useQuery({
    queryKey: ["votes", userId, roundId],
    queryFn: () => fetchVotes(roundId),
    staleTime: oneHour,
  });
}

// Create votes

async function insertVotesFn(newEntries: Array<Partial<Vote>>) {
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
    mutationFn: (votes: Array<Partial<Vote>>) => insertVotesFn(votes),
    onSuccess: (newEntries, _variables, _onMutateResult, context) => {
      const roundId = newEntries[0]?.round_id ?? "";
      const queryKey = ["votes", userId, roundId];
      context.client.setQueryData(queryKey, (old: Vote[]) => {
        if (Array.isArray(newEntries) && newEntries.length > 0) {
          if (Array.isArray(old)) return [...old, ...newEntries];
          return [newEntries];
        }
      });
      context.client.invalidateQueries({ queryKey });
    },
  });
}

// Update a vote
async function updateVoteFn(id: string, vote: Partial<Vote>) {
  const { data, error } = await supabase
    .from("Votes")
    .update({ ...vote })
    .eq("id", id)
    .select();
  if (error) {
    console.error("Error updating vote", error);
    return null;
  }
  return data?.[0] as Vote | undefined;
}

interface InsertParams extends Partial<Omit<Vote, "id">> {
  id: string;
}
export function useUpdateVote() {
  const userId = useCurrentUserId();
  return useMutation({
    mutationFn: ({ id, ...vote }: InsertParams) => updateVoteFn(id, vote),
    onSuccess: (newEntry, variables, _onMutateResult, context) => {
      const roundId = newEntry?.round_id ?? "";
      const queryKey = ["votes", userId, roundId];
      context.client.setQueryData(queryKey, (old: Vote[]) => {
        const oldEntry = old?.find(row => row.id === variables.id);
        if (oldEntry?.id && newEntry?.id) {
          const otherEntries = old.filter(row => row.id !== variables.id);
          return [...otherEntries, newEntry];
        }
      });
      context.client.invalidateQueries({ queryKey });
    },
  });
}

import { useMutation, useQuery } from "@tanstack/react-query";
import { useCurrentUserId } from "#/api/sessions.ts";
import { supabase } from "#/integrations/supabase/supabase.ts";
import type { Round } from "#/models/supabaseTables.ts";

const oneHour = 1000 * 60 * 60;

async function fetchRounds() {
  const { data, error } = await supabase.from("Rounds").select("*");
  console.log("Rounds data: ", data);
  if (error) {
    console.error("Error fetching rounds. ", error);
    return [];
  }
  return data as Round[];
}

export function useRounds() {
  const userId = useCurrentUserId();
  return useQuery({
    queryKey: ["rounds", userId],
    queryFn: fetchRounds,
    staleTime: oneHour,
  });
}

// Update a round
async function updateRoundFn(id: string, round: Partial<Round>) {
  const { data, error } = await supabase
    .from("Rounds")
    .update({ ...round })
    .eq("id", id)
    .select();
  if (error) {
    console.error("Error updating round", error);
    return null;
  }
  return data?.[0] as Round | undefined;
}

type UpdateParams = {
  id: string;
} & Partial<Omit<Round, "id">>
export function useUpdateRound() {
  const userId = useCurrentUserId();
  return useMutation({
    mutationFn: ({ id, ...round }: UpdateParams) => updateRoundFn(id, round),
    onSuccess: (updated, variables, _onMutateResult, context) => {
      const roundId = updated?.id ?? "";
      const queryKey = ["rounds", userId];
      context.client.setQueryData(queryKey, (old: Round[]) => {
        const oldEntry = old?.find(row => row.id === variables.id);
        if (oldEntry?.id && roundId) {
          const otherEntries = old.filter(row => row.id !== variables.id);
          return [...otherEntries, updated];
        }
      });
      void context.client.invalidateQueries({ queryKey });
    },
  });
}

// Insert a round
async function insertRoundFn(round: Partial<Round>) {
  console.log("Insert round: ", round);
  const { data, error } = await supabase.from("Rounds").insert(round).select();
  if (error) {
    console.error("Error inserting round", error);
    return null;
  }
  return data?.[0] as Round;
}
export function useInsertRound() {
  const currentUserId = useCurrentUserId();
  return useMutation({
    mutationFn: (roundData: Partial<Round>) => insertRoundFn(roundData),
    onSuccess: (result, _v, _i, context) => {
      const queryKey = ["rounds", currentUserId];
      void context.client.setQueryData(queryKey, (old: Round[]) => {
        if (result?.id) {
          return Array.isArray(old) ? [...old, result] : [result];
        }
      });
      void context.client.invalidateQueries({ queryKey });
    },
  });
}

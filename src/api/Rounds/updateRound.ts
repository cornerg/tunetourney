import type { Round } from "#/models/supabaseTables.ts";
import { supabase } from "#/integrations/supabase/supabase.ts";
import { useCurrentUserId } from "#/api/auth/currentUserId.ts";
import { useMutation } from "@tanstack/react-query";

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
} & Partial<Omit<Round, "id">>;
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

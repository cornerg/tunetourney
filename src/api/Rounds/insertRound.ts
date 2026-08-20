import type { Round } from "#/models/supabaseTables.ts";
import { supabase } from "#/integrations/supabase/supabase.ts";
import { useCurrentUserId } from "#/api/auth/currentUserId.ts";
import { useMutation } from "@tanstack/react-query";

async function insertRoundFn(round: Partial<Round>) {
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

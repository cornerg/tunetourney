import type { Club } from "#/models/supabaseTables.ts";
import { supabase } from "#/integrations/supabase/supabase.ts";
import { useCurrentUserId } from "#/api/auth/currentUserId.ts";
import { useMutation } from "@tanstack/react-query";

async function insertClubFn(newEntry: Partial<Club>) {
  const { data, error } = await supabase.rpc("create_club", { ...newEntry });
  if (error) {
    console.error("Error adding Club", error);
    return null;
  }
  return data as Club | undefined;
}
export function useInsertClub() {
  const currentUserId = useCurrentUserId();
  return useMutation({
    mutationFn: (data: Partial<Club>) => insertClubFn(data),
    onSuccess: (newEntry, _variables, _onMutateResult, context) => {
      const queryKey = ["clubs", currentUserId];
      void context.client.setQueryData(queryKey, (old: Club[]) => {
        if (newEntry?.id) {
          if (Array.isArray(old)) return [...old, newEntry];
          return [newEntry];
        }
      });
      void context.client.invalidateQueries({ queryKey });
    },
  });
}

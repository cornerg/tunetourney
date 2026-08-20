import type { Club } from "#/models/supabaseTables.ts";
import { supabase } from "#/integrations/supabase/supabase.ts";
import { useCurrentUserId } from "#/api/auth/currentUserId.ts";
import { useMutation } from "@tanstack/react-query";

async function updateClubFn(id: string, club: Partial<Club>) {
  const { data, error } = await supabase
    .from("Clubs")
    .update({ ...club })
    .eq("id", id)
    .select();
  if (error) {
    console.error("Error updating Club", error);
    return null;
  }
  return data?.[0] as Club | undefined;
}

type InsertParams = {
  id: string;
} & Partial<Omit<Club, "id">>;
export function useUpdateClub() {
  const currentUserId = useCurrentUserId();
  return useMutation({
    mutationFn: ({ id, ...club }: InsertParams) => updateClubFn(id, club),
    onSuccess: (newEntry, _variables, _onMutateResult, context) => {
      const queryKey = ["clubs", currentUserId];
      context.client.setQueryData(queryKey, (cachedList: Club[]) => {
        if (newEntry?.id) {
          const otherEntries = cachedList.filter(row => row.id !== newEntry.id);
          return [...otherEntries, newEntry];
        }
      });
      void context.client.invalidateQueries({ queryKey });
    },
  });
}

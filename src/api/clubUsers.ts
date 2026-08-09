import { useMutation } from "@tanstack/react-query";
import { useCurrentUserId } from "#/api/sessions.ts";
import { supabase } from "#/integrations/supabase/supabase.ts";
import type { ClubUser } from "#/models/supabaseTables.ts";

export async function insertClubUserFn(newEntry: Partial<ClubUser>) {
  const { data, error } = await supabase
    .from("ClubUsers")
    .insert([{ ...newEntry }])
    .select();
  if (error) {
    console.error("Error adding Club User", error);
    return null;
  }
  return data?.[0] as ClubUser | undefined;
}
export function useInsertClubUser() {
  const currentUserId = useCurrentUserId();
  return useMutation({
    mutationFn: (data: Partial<ClubUser>) => insertClubUserFn(data),
    onSuccess: (_newEntry, _variables, _onMutateResult, context) => {
      void context.client.invalidateQueries({ queryKey: ["clubs", currentUserId] });
    },
  });
}
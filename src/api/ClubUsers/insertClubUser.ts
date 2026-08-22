import type { ClubUser } from "#/models/supabaseTables.ts";
import { supabase } from "#/integrations/supabase/supabase.ts";
import { useCurrentUserId } from "#/api/auth/currentUserId.ts";
import { useMutation } from "@tanstack/react-query";

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
    onSuccess: (newEntry, _variables, _onMutateResult, context) => {
      if (newEntry?.id) {
        const queryKey = ["clubUsers", currentUserId, newEntry.club_id];
        void context.client.setQueryData(queryKey, (prev: ClubUser[] | null) => {
          return Array.isArray(prev) ? [...prev, newEntry] : [newEntry];
        });
        void context.client.invalidateQueries({ queryKey });
      }
    },
  });
}

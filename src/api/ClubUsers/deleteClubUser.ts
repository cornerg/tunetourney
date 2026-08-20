import type { Club, ClubUser } from "#/models/supabaseTables.ts";
import { supabase } from "#/integrations/supabase/supabase.ts";
import { useCurrentUserId } from "#/api/auth/currentUserId.ts";
import { useMutation } from "@tanstack/react-query";

type DeleteInput = {
  userId: string;
  clubId: string;
}

export async function deleteClubUserFn({ userId, clubId }: DeleteInput) {
  const { error } = await supabase
    .from("ClubUsers")
    .delete()
    .eq("user_id", userId)
    .eq("club_id", clubId);
  if (error) {
    console.error("Error deleting Club User", error);
    return false;
  }
  return true;
}

export function useDeleteClubUser() {
  const currentUserId = useCurrentUserId();
  return useMutation({
    mutationFn: (input: DeleteInput) => deleteClubUserFn(input),
    onSuccess: (result, input, _onMutateResult, context) => {
      if (result) {
        if (input.userId === currentUserId) {
          const clubsQueryKey = ["clubs", currentUserId];
          const ownedClubsQueryKey = ["ownedClubs", currentUserId];
          void context.client.setQueryData(clubsQueryKey, (prev: Club[] | null) => {
            if (prev) {
              return prev.filter(club => club.id !== input.clubId);
            }
          })
          void context.client.setQueryData(ownedClubsQueryKey, (prev: Club[] | null) => {
            if (prev) {
              return prev.filter(club => club.id !== input.clubId);
            }
          });
          void context.client.invalidateQueries({ queryKey: clubsQueryKey });
          void context.client.invalidateQueries({ queryKey: ownedClubsQueryKey });
        } else {
          const queryKey = ["clubUsers", currentUserId, input.clubId];
          void context.client.setQueryData(queryKey, (prev: ClubUser[] | null) => {
            if (prev) {
              return prev.filter(clubUser => clubUser.id !== input.userId);
            }
          })
          void context.client.invalidateQueries({ queryKey });
        }
      }
    },
  });
}

import type { Club } from "#/models/supabaseTables.ts";
import { supabase } from "#/integrations/supabase/supabase.ts";
import { useCurrentUserId } from "#/api/auth/currentUserId.ts";
import { useMutation } from "@tanstack/react-query";

export async function deleteClubFn(clubId: string) {
  const { error } = await supabase
    .from("Clubs")
    .delete()
    .eq("id", clubId);
  if (error) {
    console.error("Error deleting Club", error);
    return false;
  }
  return true;
}

export function useDeleteClub() {
  const currentUserId = useCurrentUserId();
  return useMutation({
    mutationFn: (id: string) => deleteClubFn(id),
    onSuccess: (result, deleteId, _onMutateResult, context) => {
      if (result) {
        const clubsQueryKey = ["clubs", currentUserId];
        const ownedClubsQueryKey = ["ownedClubs", currentUserId];
        void context.client.setQueryData(
          clubsQueryKey,
          (prev: Club[] | null) => {
            if (prev) {
              return prev.filter(club => club.id !== deleteId);
            }
          },
        );
        void context.client.setQueryData(
          ownedClubsQueryKey,
          (prev: Club[] | null) => {
            if (prev) {
              return prev.filter(club => club.id !== deleteId);
            }
          },
        );
        void context.client.invalidateQueries({ queryKey: clubsQueryKey });
        void context.client.invalidateQueries({
          queryKey: ownedClubsQueryKey,
        });
      }
    },
  });
}

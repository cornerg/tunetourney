import type { Tournament } from "#/models/supabaseTables.ts";
import { supabase } from "#/integrations/supabase/supabase.ts";
import { useCurrentUserId } from "#/api/auth/currentUserId.ts";
import { useMutation } from "@tanstack/react-query";

export async function deleteTournamentFn(tournamentId: string) {
  const { error } = await supabase.from("Tournament").delete().eq("id", tournamentId);
  if (error) {
    console.error("Error deleting Tournament", error);
    return false;
  }
  return true;
}

export function useDeleteTournament() {
  const currentUserId = useCurrentUserId();
  return useMutation({
    mutationFn: (id: string) => deleteTournamentFn(id),
    onSuccess: (result, deleteId, _onMutateResult, context) => {
      if (result) {
        const tournamentsQueryKey = ["tournaments", currentUserId];
        const ownedTournamentsQueryKey = ["ownedTournaments", currentUserId];
        void context.client.setQueryData(
          tournamentsQueryKey,
          (prev: Tournament[] | null) => {
            if (prev) {
              return prev.filter(tournament => tournament.id !== deleteId);
            }
          },
        );
        void context.client.setQueryData(
          ownedTournamentsQueryKey,
          (prev: Tournament[] | null) => {
            if (prev) {
              return prev.filter(tournament => tournament.id !== deleteId);
            }
          },
        );
        void context.client.invalidateQueries({ queryKey: tournamentsQueryKey });
        void context.client.invalidateQueries({
          queryKey: ownedTournamentsQueryKey,
        });
      }
    },
  });
}

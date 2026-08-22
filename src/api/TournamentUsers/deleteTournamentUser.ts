import type {
  Tournament,
  TournamentUser,
} from "#/models/supabaseTables.ts";
import { supabase } from "#/integrations/supabase/supabase.ts";
import { useCurrentUserId } from "#/api/auth/currentUserId.ts";
import { useMutation } from "@tanstack/react-query";

type DeleteInput = {
  userId: string;
  tournamentId: string;
};

export async function deleteTournamentUserFn({ userId, tournamentId }: DeleteInput) {
  const { error } = await supabase
    .from("TournamentUsers")
    .delete()
    .eq("user_id", userId)
    .eq("tournament_id", tournamentId);
  if (error) {
    console.error("Error deleting Tournament User", error);
    return false;
  }
  return true;
}

export function useDeleteTournamentUser() {
  const currentUserId = useCurrentUserId();
  return useMutation({
    mutationFn: (input: DeleteInput) => deleteTournamentUserFn(input),
    onSuccess: (result, input, _onMutateResult, context) => {
      if (result) {
        if (input.userId === currentUserId) {
          const tournamentsQueryKey = ["tournaments", currentUserId];
          const ownedTournamentsQueryKey = ["ownedTournaments", currentUserId];
          void context.client.setQueryData(
            tournamentsQueryKey,
            (prev: Tournament[] | null) => {
              if (prev) {
                return prev.filter(
                  tournament => tournament.id !== input.tournamentId,
                );
              }
            },
          );
          void context.client.setQueryData(
            ownedTournamentsQueryKey,
            (prev: Tournament[] | null) => {
              if (prev) {
                return prev.filter(
                  tournament => tournament.id !== input.tournamentId,
                );
              }
            },
          );
          void context.client.invalidateQueries({
            queryKey: tournamentsQueryKey,
          });
          void context.client.invalidateQueries({
            queryKey: ownedTournamentsQueryKey,
          });
        } else {
          const queryKey = [
            "tournamentUsers",
            currentUserId,
            input.tournamentId,
          ];
          void context.client.setQueryData(
            queryKey,
            (prev: TournamentUser[] | null) => {
              if (prev) {
                return prev.filter(
                  tournamentUser => tournamentUser.user_id !== input.userId,
                );
              }
            },
          );
          void context.client.invalidateQueries({ queryKey });
        }
      }
    },
  });
}

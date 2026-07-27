import React from "react";
import { useRounds } from "#/api/rounds.ts";

export function useTournamentRounds(tournamentId: string | null | undefined) {
  const { data: allRounds, isLoading } = useRounds();

  const rounds = React.useMemo(() => {
    return (
      allRounds?.filter(round => round.tournament_id === tournamentId) ?? []
    );
  }, [tournamentId, allRounds]);

  return { rounds, tournamentId, isLoading };
}

export function useRound(roundId: string) {
  const { data: rounds, isLoading } = useRounds();

  const round = React.useMemo(() => {
    return rounds?.find(rnd => rnd.id === roundId);
  }, [rounds, roundId]);

  return { round, roundId, isLoading };
}

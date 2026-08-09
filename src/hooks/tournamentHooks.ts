import React from "react";
import { useTournaments } from "#/api/tournaments.ts";

export function useTournament(tournamentId: string | null | undefined) {
  const { data: tournaments, isLoading } = useTournaments();

  const tournament = React.useMemo(() => {
    return tournaments?.find(tourney => tourney.id === tournamentId);
  }, [tournaments, tournamentId]);

  return { tournament, tournamentId, isLoading };
}
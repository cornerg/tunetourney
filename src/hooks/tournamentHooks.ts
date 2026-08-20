import React from "react";
import { useTournaments } from "#/api/Tournaments/fetchTournaments.ts";

export function useTournament(tournamentId: string | null | undefined) {
  const { data: tournaments, isLoading } = useTournaments();

  const tournament = React.useMemo(() => {
    return tournaments?.find(tourney => tourney.id === tournamentId);
  }, [tournaments, tournamentId]);

  return { tournament, tournamentId, isLoading };
}
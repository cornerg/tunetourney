import { useTournaments } from "#/api/Tournaments/fetchTournaments.ts";
import React from "react";
import TournamentCard from "#/components/sections/tournament/TournamentCard.tsx";
import TTButton from "#/components/primitives/TTButton.tsx";
import { Link } from "@tanstack/react-router";

type Props = {
  clubId: string,
}
export default function ClubTournaments({ clubId }: Props) {
  const { data: allTournaments } = useTournaments();
  const tournaments = React.useMemo(() => {
    return (allTournaments ?? []).filter(
      tournament => tournament.club_id === clubId,
    ).sort((a, b) => {
      const createdA = new Date(a.created_at).getTime();
      const createdB = new Date(b.created_at).getTime();
      return createdB - createdA;
    });
  }, [allTournaments, clubId]);

  if (!tournaments.length) {
    return null;
  }

  return (
    <div className="column w-full gap-4">
      <div className="row w-full justify-between items-center gap-4">
        <h3 className="heading text-lg font-bold text-dark">Tournaments</h3>

        <Link to="/tournament/$tournamentId" params={{ tournamentId: "new" }}>
          <TTButton className="px-2 min-h-8" buttonStyle="outline">
            New Tournament
          </TTButton>
        </Link>
      </div>

      <div className="w-full row flex-wrap gap-4">
        {tournaments?.map(tourney => (
          <TournamentCard key={tourney.id} tournament={tourney} />
        ))}
      </div>
    </div>
  );
}
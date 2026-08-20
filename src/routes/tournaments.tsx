import React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useTournaments } from "#/api/Tournaments/fetchTournaments.ts";
import TTButton from "#/components/primitives/TTButton.tsx";
import TournamentCard from "#/components/sections/tournament/TournamentCard.tsx";

function TournamentsPage() {
  const { data: tournaments } = useTournaments();

  const sortedTournaments = React.useMemo(() => {
    if (!tournaments || (tournaments?.length ?? 0) <= 0) return [];
    return [...tournaments].sort((a, b) => {
      const createdA = new Date(a.created_at).getTime();
      const createdB = new Date(b.created_at).getTime();
      return createdA - createdB;
    });
  }, [tournaments]);

  const hasTournaments = React.useMemo(
    () => (sortedTournaments?.length ?? 0) > 0,
    [sortedTournaments],
  );

  return (
    <div className="column w-full gap-4">
      <div className="column w-full gap-0">
        <div className="row w-full justify-between items-center gap-4">
          <h1 className="title text-primary">Tournaments</h1>

          <Link to="/tournament/$tournamentId" params={{ tournamentId: "new" }}>
            <TTButton className="px-2 min-h-10" buttonStyle="primary">
              New Tournament
            </TTButton>
          </Link>
        </div>

        <p className="text-black text-base">
          Challenge your friends, colleagues, or worst enemies from your clubs
          to see who has the best taste in music!
          <br />
          Tournaments are broken up into rounds, in which everyone submits their
          music and votes to find a winner.
        </p>
      </div>

      <hr className="text-gray-300" />

      <div className="w-full row flex-wrap gap-4">
        {hasTournaments &&
          sortedTournaments?.map(tourney => {
            return <TournamentCard key={tourney.id} tournament={tourney} />;
          })}
      </div>
    </div>
  );
}

export const Route = createFileRoute("/tournaments")({
  component: TournamentsPage,
});

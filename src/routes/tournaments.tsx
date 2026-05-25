import { createFileRoute } from '@tanstack/react-router'
import {useTournaments} from "#/api/tournaments.ts";
import React from "react";
import TournamentCard from "#/components/TournamentCard.tsx";

function TournamentsPage() {
  const { data: tournaments } = useTournaments();

  const sortedTournaments = React.useMemo(() => {
    if (!tournaments || (tournaments?.length ?? 0) <= 0) return [];
    return [...tournaments].sort((a, b) => {
      const createdA = new Date(a.created_at).getTime();
      const createdB = new Date(b.created_at).getTime();
      return createdA - createdB;
    })
  }, [tournaments]);

  const hasTournaments = React.useMemo(() => (sortedTournaments?.length ?? 0) > 0, [sortedTournaments]);

  return (
    <div className="column w-full gap-4">
      <div className="column w-full gap-0">
        <h1 className="title text-primary">Tournaments</h1>
        <p className="text-black text-base">
          Current or past contests you've been involved in. Narrow it down by certain clubs, view the latest contests, or review your performance in past tournaments.
          <br/>
          You can customize your club as much or as little as you like to welcome members with a unique vibe all your own.
        </p>
      </div>

      <hr className="text-gray-300" />

      <div className="w-full row flex-wrap gap-4">
        {hasTournaments && sortedTournaments?.map((tourney) => {
          return <TournamentCard key={tourney.id} tournament={tourney} />;
        })}
      </div>
    </div>
  )
}

export const Route = createFileRoute('/tournaments')({
  component: TournamentsPage,
})

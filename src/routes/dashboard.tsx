import { createFileRoute } from "@tanstack/react-router";
import { useCurrentUser } from "#/api/Users/fetchCurrentUser.ts";
import MyStats from "#/components/sections/MyStats.tsx";
import { useRounds } from "#/api/Rounds/fetchRounds.ts";
import React from "react";
import { ROUND_STATUS } from "#/models/RoundStatus.ts";
import RoundCard from "#/components/sections/round/RoundCard.tsx";
import { useTournaments } from "#/api/Tournaments/fetchTournaments.ts";
import type { Round, Tournament } from "#/models/supabaseTables.ts";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: currentUser } = useCurrentUser();
  const { data: rounds } = useRounds();
  const { data: tournaments } = useTournaments();

  const activeRounds = React.useMemo(() => {
    return (rounds?.map((round) => {
      const tourney = tournaments?.find(
        tourney => tourney.id === round.tournament_id,
      );
      return { ...round, tournament: tourney };
    })?.filter((round) => {
      return !!round.tournament && round.status > ROUND_STATUS.pending && round.status < ROUND_STATUS.closed
    }) ?? []) as (Round & { tournament: Tournament })[];
  }, [rounds, tournaments]);

  return (
    <div className="column gap-4 pt-8">
      <h2 className="title">
        Welcome back
        <span className="text-primary">
          {currentUser?.name ? ` ${currentUser.name}` : ""}
        </span>
      </h2>

      <hr className="w-full text-gray-300 my-4" />

      <MyStats />

      {activeRounds?.length > 0 && (
        <>
          <hr className="w-full text-gray-300 my-4" />

          <div className="column w-full flex-1 gap-2">
            <h4 className="text-md text-dark font-bold leading-none">
              Active Rounds
            </h4>

            <div className="row w-full gap-4 flex-wrap">
              {activeRounds.map(round => (
                <RoundCard key={round.id} round={round} tournament={round.tournament} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

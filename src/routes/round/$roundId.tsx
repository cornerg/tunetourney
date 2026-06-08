import { createFileRoute } from '@tanstack/react-router'
import {useRound} from "#/hooks/roundHooks.ts";
import React from "react";
import BadgeRoundStatus from "#/components/BadgeRoundStatus.tsx";
import {useTournaments} from "#/api/tournaments.ts";
import RoundSubmitting from "#/components/sections/RoundSubmitting.tsx";
import {ROUND_STATUS} from "#/models/RoundStatus.ts";

function PageRound() {
  const { roundId } = Route.useParams();
  const { round } = useRound(roundId);
  const { data: tournaments } = useTournaments();

  const tournament = React.useMemo(() => {
    return tournaments?.find((t) => t.id === round?.tournament_id);
  }, [tournaments, round?.tournament_id]);

  console.log("Round: ", round);

  return <div className="column w-full gap-4">
    <div className="column w-full gap-4">
      <h2 className="subtitle">{round?.title}</h2>
      <div className="row w-full justify-between items-center gap-2">
        <BadgeRoundStatus statusKey={round?.status} />
        <p className="text-sm">{tournament?.title}</p>
      </div>
      <p className="text-dark">{round?.description}</p>

      {round?.status === ROUND_STATUS.voting && <RoundSubmitting round={round} />}
    </div>
  </div>
}


export const Route = createFileRoute('/round/$roundId')({
  component: PageRound,
})

import { createFileRoute } from '@tanstack/react-router'
import {useRound} from "#/hooks/roundHooks.ts";
import React from "react";
import BadgeRoundStatus from "#/components/BadgeRoundStatus.tsx";
import {useTournaments} from "#/api/tournaments.ts";
import RoundSubmitting from "#/components/sections/RoundSubmitting.tsx";
import {ROUND_STATUS} from "#/models/RoundStatus.ts";
import {useTournamentOwners} from "#/api/users.ts";
import {useCurrentUserId} from "#/api/sessions.ts";
import ManageRound from "#/components/sections/ManageRound.tsx";
import RoundVoting from "#/components/sections/RoundVoting.tsx";

function PageRound() {
  const { roundId } = Route.useParams();
  const { round } = useRound(roundId);
  const { data: tournaments } = useTournaments();

  const tournament = React.useMemo(() => {
    return tournaments?.find((t) => t.id === round?.tournament_id);
  }, [tournaments, round?.tournament_id]);

  const { data: owners } = useTournamentOwners(tournament?.id ?? round?.tournament_id);
  const currentUserId = useCurrentUserId();

  const isOwner = React.useMemo(() => {
    return !!owners?.map((owner) => owner.id)?.includes(currentUserId);
  }, [owners, currentUserId]);

  return <div className="column w-full gap-4">
    <div className="column w-full gap-3">
      <div className="column w-full gap-2">
        <div className="row w-full items-center gap-4">
          <div className="row w-full items-center gap-4 flex-1">
            <h2 className="subtitle">{round?.title}</h2>
            <BadgeRoundStatus statusKey={round?.status} />
          </div>

          {!!round && isOwner && <ManageRound round={round} />}
        </div>
        <p className="text-sm font-bold">{tournament?.title}</p>
        <p className="text-dark">{round?.description}</p>
      </div>

      <hr className="w-full text-gray-300" />

      {round?.status === ROUND_STATUS.submitting && <RoundSubmitting round={round} />}
      {round?.status === ROUND_STATUS.voting && <RoundVoting round={round} />}
    </div>
  </div>
}


export const Route = createFileRoute('/round/$roundId')({
  component: PageRound,
})

import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useCurrentUserId } from "#/api/sessions.ts";
import { useTournaments } from "#/api/tournaments.ts";
import { useTournamentOwners, useVotedUsers } from "#/api/users.ts";
import BadgeRoundStatus from "#/components/BadgeRoundStatus.tsx";
import ManageRound from "#/components/sections/ManageRound.tsx";
import RoundResults from "#/components/sections/RoundResults.tsx";
import RoundRoster from "#/components/sections/RoundRoster.tsx";
import RoundSubmitting from "#/components/sections/RoundSubmitting.tsx";
import RoundVoteReview from "#/components/sections/RoundVoteReview.tsx";
import RoundVoting from "#/components/sections/RoundVoting.tsx";
import { useRound } from "#/hooks/roundHooks.ts";
import { ROUND_STATUS } from "#/models/RoundStatus.ts";

function PageRound() {
  const { roundId } = Route.useParams();
  const { round } = useRound(roundId);
  const { data: tournaments } = useTournaments();
  const { data: votedUsers } = useVotedUsers(roundId);

  const tournament = React.useMemo(() => {
    return tournaments?.find(t => t.id === round?.tournament_id);
  }, [tournaments, round?.tournament_id]);

  const { data: owners } = useTournamentOwners(
    tournament?.id ?? round?.tournament_id,
  );
  const currentUserId = useCurrentUserId();

  const isOwner = React.useMemo(() => {
    return !!owners?.map(owner => owner.id)?.includes(currentUserId);
  }, [owners, currentUserId]);

  const hasVoted = React.useMemo(() => {
    return (
      !!currentUserId && !!votedUsers?.find(voter => voter === currentUserId)
    );
  }, [votedUsers, currentUserId]);

  const showSection = React.useMemo(() => {
    if (!(typeof round?.status !== "number")) return;
    if (round?.status === ROUND_STATUS.pending) {
      return "pending";
    }
    if (round?.status === ROUND_STATUS.submitting) {
      return "submitting";
    }
    if (round?.status === ROUND_STATUS.voting) {
      if (hasVoted) {
        return "voted";
      }
      return "voting";
    }
    if (round?.status === ROUND_STATUS.closed) {
      return "closed";
    }
  }, [round, hasVoted]);

  const showManageButton = React.useMemo(() => {
    return !!round && round.status !== ROUND_STATUS.closed && isOwner;
  }, [round, isOwner]);

  return (
    <div className="column w-full gap-4">
      <div className="column w-full gap-4">
        <div className="column w-full gap-2">
          <div className="row w-full items-center gap-4">
            <div className="row w-full items-center gap-4 flex-1">
              <h2 className="subtitle">{round?.title}</h2>
              <BadgeRoundStatus statusKey={round?.status} />
            </div>

            {!!round && showManageButton && <ManageRound round={round} />}
          </div>
          <p className="text-sm font-bold">{tournament?.title}</p>
          <p className="text-dark">{round?.description}</p>

          {!!round && <RoundRoster round={round} />}
        </div>

        <hr className="w-full text-gray-300" />

        {!!round && (
          <>
            {showSection === "submitting" && <RoundSubmitting round={round} />}
            {showSection === "voting" && <RoundVoting round={round} />}
            {showSection === "voted" && <RoundVoteReview round={round} />}
            {showSection === "closed" && <RoundResults round={round} />}
          </>
        )}
      </div>
    </div>
  );
}

export const Route = createFileRoute("/round/$roundId")({
  component: PageRound,
});

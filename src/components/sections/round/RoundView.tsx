import type { Round, Tournament } from "#/models/supabaseTables.ts";
import BadgeRoundStatus from "#/components/BadgeRoundStatus.tsx";
import React from "react";
import { useTournamentOwners, useVotedUsers } from "#/api/users.ts";
import { useCurrentUserId } from "#/api/sessions.ts";
import { ROUND_STATUS } from "#/models/RoundStatus.ts";
import ManageRound from "#/components/sections/ManageRound.tsx";
import RoundRoster from "#/components/sections/RoundRoster.tsx";
import RoundSubmitting from "#/components/sections/RoundSubmitting.tsx";
import RoundVoting from "#/components/sections/RoundVoting.tsx";
import RoundVoteReview from "#/components/sections/RoundVoteReview.tsx";
import RoundResults from "#/components/sections/RoundResults.tsx";
import TTButton from "#/components/primitives/TTButton.tsx";
import { GoPencil } from "react-icons/go";

type Props = {
  round: Round;
  tournament: Tournament | null | undefined;
  setEdit: (newState: boolean) => void;
}
export default function RoundView({ round, tournament, setEdit }: Props) {
  const { data: votedUsers } = useVotedUsers(round.id);
  const { data: owners } = useTournamentOwners(tournament?.id ?? round?.tournament_id);
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
    switch (round?.status) {
      case ROUND_STATUS.pending:
        return "pending";
      case ROUND_STATUS.submitting:
        return "submitting";
      case ROUND_STATUS.voting:
        return hasVoted ? "voted" : "voting";
      default:
        return "closed";
    }
  }, [round, hasVoted]);

  const showManageButton = React.useMemo(() => {
    return !!round && round.status !== ROUND_STATUS.closed && isOwner;
  }, [round, isOwner]);
  
  return (
    <div className="column w-full gap-4">
      <div className="column w-full gap-2">
        <div className="row w-full items-center gap-4">
          <div className="row w-full items-center gap-4 flex-1">
            <h2 className="subtitle">{round?.title}</h2>
            <BadgeRoundStatus statusKey={round?.status} />
          </div>

          <div className="row w-max gap-2">
            {showManageButton && <ManageRound round={round} />}
            {isOwner && (
              <TTButton
                buttonStyle="outline"
                className="min-h-9 px-2"
                onClick={() => setEdit(true)}>
                <GoPencil size={22} />
              </TTButton>
            )}
          </div>
        </div>
        <p className="text-sm font-bold">{tournament?.title}</p>
        <p className="text-dark">{round?.description}</p>

        {!!round && <RoundRoster round={round} />}
      </div>

      {showSection !== "pending" && <hr className="w-full text-gray-300" />}

      {!!round && (
        <>
          {showSection === "submitting" && <RoundSubmitting round={round} />}
          {showSection === "voting" && <RoundVoting round={round} />}
          {showSection === "voted" && <RoundVoteReview round={round} />}
          {showSection === "closed" && <RoundResults round={round} />}
        </>
      )}
    </div>
  );
}
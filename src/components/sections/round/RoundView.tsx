import type { Round, Tournament } from "#/models/supabaseTables.ts";
import BadgeRoundStatus from "#/components/BadgeRoundStatus.tsx";
import React from "react";
import { useVotedUserIds } from "#/api/Users/fetchVotedUserIds.ts";
import { useTournamentOwners } from "#/api/TournamentUsers/fetchTournamentOwners.ts";
import { useCurrentUserId } from "#/api/auth/currentUserId.ts";
import { ROUND_STATUS } from "#/models/RoundStatus.ts";
import ManageRound from "#/components/sections/ManageRound.tsx";
import RoundRoster from "#/components/sections/RoundRoster.tsx";
import RoundSubmitting from "#/components/sections/round/RoundSubmitting.tsx";
import RoundVoting from "#/components/sections/round/RoundVoting.tsx";
import RoundVoteReview from "#/components/sections/round/RoundVoteReview.tsx";
import RoundResults from "#/components/sections/round/RoundResults.tsx";
import TTButton from "#/components/primitives/TTButton.tsx";
import { GoPencil } from "react-icons/go";

type Props = {
  round: Round;
  tournament: Tournament | null | undefined;
  setEdit: (newState: boolean) => void;
}
export default function RoundView({ round, tournament, setEdit }: Props) {
  const { data: votedUsers } = useVotedUserIds(round.id);
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
      <div className="column w-full gap-0">
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

        <p className="text-sm">
          — <strong className="font-bold">{tournament?.title}</strong>
        </p>
      </div>

      <p className="text-dark">{round?.description}</p>

      {!!round && <RoundRoster round={round} />}

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
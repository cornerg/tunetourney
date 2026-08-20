import React from "react";
import { useSubmissions } from "#/api/Submissions/fetchSubmissions.ts";
import { useCurrentUser } from "#/api/Users/fetchCurrentUser.ts";
import { useTournamentUsers } from "#/api/TournamentUsers/fetchTournamentUsers.ts";
import { useTournamentOwners } from "#/api/TournamentUsers/fetchTournamentOwners.ts";
import { useVotedUserIds } from "#/api/Users/fetchVotedUserIds.ts";
import { ROUND_STATUS } from "#/models/RoundStatus.ts";
import type { Round } from "#/models/supabaseTables.ts";
import RosterAvatar from "#/components/users/RosterAvatar.tsx";

type Props = {
  round: Round;
}
export default function RoundRoster({ round }: Props) {
  const { data: allUsers } = useTournamentUsers(round.tournament_id);
  const { data: currentUser } = useCurrentUser();
  const { data: organizers } = useTournamentOwners(round.tournament_id);
  const { data: submissions } = useSubmissions(round.id);
  const { data: votedIds } = useVotedUserIds(round.id);

  const members = React.useMemo(() => {
    return allUsers?.filter(user => !organizers?.map(org => org.id)?.includes(user.id)) ?? [];
  }, [allUsers, organizers]);

  const isUserDone = React.useCallback((userId: string) => {
    if (round.status === ROUND_STATUS.voting) {
      return !!votedIds?.includes(userId);
    } else {
      return !!submissions?.map(sub => sub.user_id)?.includes(userId);
    }
  }, [round, votedIds, submissions]);

  const sortedUsers = React.useMemo(() => {
    const votedOwners = organizers?.filter(user => isUserDone(user.id)) ?? [];
    const pendingOwners = organizers?.filter(user => !isUserDone(user.id)) ?? [];
    const votedMembers = members.filter(user => isUserDone(user.id));
    const pendingMembers = members.filter(user => !isUserDone(user.id));

    return [...votedOwners, ...pendingOwners, ...votedMembers, ...pendingMembers]
      .filter((user) => user.id !== currentUser?.id)
      .sort((a, b) => a.name > b.name ? 1 : -1);
  }, [organizers, members, isUserDone, currentUser]);

  const isCurrentUserOwner = React.useMemo(() => {
    return !!organizers?.find(org => org.id === currentUser?.id);
  }, [organizers, currentUser]);

  const isCurrentUserDone = React.useMemo(() => {
    if (!currentUser?.id) return false;
    return isUserDone(currentUser?.id);
  }, [currentUser, isUserDone]);

  return (
    <div className="row w-full flex-1 gap-2 items-center">
      {!!currentUser?.id && (
        <>
          <RosterAvatar user={currentUser} isOrganizer={isCurrentUserOwner} isComplete={isCurrentUserDone} />
          <div className="w-px h-full min-h-10 bg-gray-300" />
        </>
      )}

      {sortedUsers.map((user) => {
        const isOrganizer = !!organizers?.map(org => org.id)?.includes(user.id);
        const isComplete = (round.status === ROUND_STATUS.submitting || round.status === ROUND_STATUS.voting) && isUserDone(user.id);
        return (
          <RosterAvatar key={user.id} user={user} isOrganizer={isOrganizer} isComplete={isComplete} />
        );
      })}
    </div>
  );
}

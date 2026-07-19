import {useCurrentUser, useTournamentOwners, useTournamentUsers, useVotedUsers} from "#/api/users.ts";
import {useSubmissions} from "#/api/submissions.ts";
import React from "react";
import type {Round} from "#/models/supabaseTables.ts";
import {ROUND_STATUS} from "#/models/RoundStatus.ts";
import ProfilePhoto from "#/components/ProfilePhoto.tsx";
import TTTooltip from "#/components/primitives/TTTooltip.tsx";

interface Props {
  round: Round;
}
export default function RoundRoster({ round }: Props) {
  const { data: allUsers } = useTournamentUsers(round.tournament_id);
  const { data: currentUser } = useCurrentUser();
  const { data: organizers } = useTournamentOwners(round.tournament_id);
  const { data: submissions } = useSubmissions(round.id);
  const { data: votedUsers } = useVotedUsers(round.id);

  const otherUsers = React.useMemo(() => allUsers?.filter((user) => user.id !== currentUser?.id), [allUsers, currentUser?.id]);

  const completedUsers = React.useMemo(() => {
    return otherUsers?.filter((user) => {
      if (round.status === ROUND_STATUS.submitting) {
        return !!submissions?.map((sub) => sub.user_id)?.includes(user.id);
      }
      if (round.status === ROUND_STATUS.voting) {
        return !!votedUsers?.includes(user.id);
      }
      return true;
    }) ?? [];
  }, [otherUsers, round?.status, submissions, votedUsers]);

  const uncompletedUsers = React.useMemo(() => {
    return otherUsers?.filter((user) => !completedUsers?.map((u) => u.id)?.includes(user.id)) ?? [];
  }, [otherUsers, completedUsers]);

  const isCurrentUserDone = React.useMemo(() => {
    if (round.status === ROUND_STATUS.submitting) {
      return !!submissions?.map((sub) => sub.user_id)?.includes(currentUser?.id);
    }
    if (round.status === ROUND_STATUS.voting) {
      return !!votedUsers?.includes(currentUser?.id ?? "");
    }
    return true
  }, [round, currentUser?.id, submissions, votedUsers]);

  const getStatusTerm = React.useCallback((isCompleted: boolean) => {
    if (round.status === ROUND_STATUS.submitting) {
      return isCompleted ? " (Submitted)" : " (Not submitted)";
    }
    if (round.status === ROUND_STATUS.voting) {
      return isCompleted ? " (Voted)" : " (Not voted)";
    }
    return "";
  }, [round.status]);

  return (
    <div className="row w-full justify-between gap-4">
      <div className="column w-full flex-1 gap-2">
        <h4 className="subheading">Participants</h4>

        <div className="row gap-2 items-center">
          {!!currentUser?.id && (
            <TTTooltip label={`${currentUser?.name ?? "Unnamed User"}${getStatusTerm(isCurrentUserDone)}`} delay={30}>
              <ProfilePhoto
                user={currentUser}
                size={40}
                fontSize={16}
                className="rounded-full bg-surface border-1"
              />
            </TTTooltip>
          )}

          <div className="w-[1px] h-full min-h-10 bg-gray-300" />

          {completedUsers?.map((user) => {
            return (
              <div key={user.id} className="row items-center gap-2">
                <TTTooltip label={`${user?.name ?? "Unnamed User"}${getStatusTerm(true)}`} delay={30}>
                  <ProfilePhoto user={user} size={40} fontSize={16} className="rounded-full bg-surface border-1" />
                </TTTooltip>
              </div>
            )
          })}

          {(completedUsers.length > 0 && uncompletedUsers.length > 0) && <div className="w-[1px] h-full min-h-10 bg-gray-300" />}

          {uncompletedUsers?.map((user) => {
            return (
              <div key={user.id} className="row items-center gap-2" style={{ opacity: 0.4 }}>
                <TTTooltip label={`${user?.name ?? "Unnamed User"} (${getStatusTerm(false)})`} delay={30}>
                  <ProfilePhoto user={user} size={40} fontSize={16} className="rounded-full bg-surface border-1" />
                </TTTooltip>
              </div>
            )
          })}
        </div>
      </div>

      <div className="column w-full items-end flex-1 gap-2">
        <h4 className="subheading text-end">Organizers</h4>

        {organizers?.map((user) => {
          return (
            <div key={user.id} className="row items-center gap-2">
              <TTTooltip label={`${user?.name ?? "Unnamed User"} (Organizer)`} delay={30}>
                <ProfilePhoto user={user} size={40} fontSize={16} className="rounded-full bg-surface" />
              </TTTooltip>
            </div>
          )
        })}
      </div>
    </div>
  )
}
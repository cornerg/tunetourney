import type {Round} from "#/models/supabaseTables.ts";
import TTTooltip from "#/components/primitives/TTTooltip.tsx";
import ProfilePhoto from "#/components/ProfilePhoto.tsx";
import React from "react";
import {useCurrentUser, useTournamentOwners, useTournamentUsers} from "#/api/users.ts";
import {useSubmissions} from "#/api/submissions.ts";
import TTBox from "#/components/primitives/TTBox.tsx";
import SubmissionEdit from "#/components/sections/SubmissionEdit.tsx";

interface Props {
  round: Round | null | undefined;
}
export default function RoundSubmitting({ round }: Props) {
  const { data: currentUser, isLoading: isCurrentUserLoading } = useCurrentUser();
  const { data: submissions } = useSubmissions(round?.id);
  const { data: users } = useTournamentUsers(round?.tournament_id);
  const { data: owners } = useTournamentOwners(round?.tournament_id);

  const otherUsers = React.useMemo(() => {
    return [...(users ?? [])].filter((user) => user.id !== currentUser?.id);
  }, [users, currentUser?.id]);

  const submittedIds = React.useMemo(() => [...(submissions ?? [])].map((submission) => submission.user_id), [submissions]);

  const submitted = React.useMemo(() => {
    return [...otherUsers].filter((user) => submittedIds.includes(user.id));
  }, [otherUsers, submittedIds]);

  const unsubmitted = React.useMemo(() => {
    return [...otherUsers].filter((user) => !submittedIds.includes(user.id));
  }, [otherUsers, submittedIds]);

  const hasCurrentUserSubmitted = React.useMemo(() => {
    return !isCurrentUserLoading && !!submittedIds.find((userId) => userId === currentUser?.id);
  }, [submittedIds]);

  return (
    <TTBox className="column w-full gap-4">
      <div className="row w-full gap-4 flex-wrap">
        <div className="column w-full min-w-72 flex-1 gap-2">
          <h3 className="heading">Participants</h3>

          <div className="row items-center w-full gap-2">
            <div key="current-user-submission" className="row items-center gap-2">
              <TTTooltip label={`${currentUser?.name ?? "Unnamed User"} (${hasCurrentUserSubmitted ? "Submitted" : "Hasn't submitted"})`} delay={30}>
                <ProfilePhoto user={currentUser} size={40} fontSize={16} className="rounded-full bg-surface" />
              </TTTooltip>
            </div>

            {(submitted.length > 0 || unsubmitted.length > 0) && <div className="w-[1px] h-full min-h-10 bg-gray-300" />}

            {submitted?.map((user) => {
              return (
                <div key={user.id} className="row items-center gap-2">
                  <TTTooltip label={`${user?.name ?? "Unnamed User"} (Submitted)`} delay={30}>
                    <ProfilePhoto user={user} size={40} fontSize={16} className="rounded-full bg-surface" />
                  </TTTooltip>
                </div>
              )
            })}

            {submitted.length > 0 && unsubmitted.length > 0 && <div className="w-[1px] h-full min-h-10 bg-gray-300" />}

            {unsubmitted?.map((user) => {
              return (
                <div key={user.id} className="row items-center gap-2" style={{ opacity: 0.4 }}>
                  <TTTooltip label={`${user?.name ?? "Unnamed User"} (Hasn't submitted)`} delay={30}>
                    <ProfilePhoto user={user} size={40} fontSize={16} className="rounded-full bg-surface" />
                  </TTTooltip>
                </div>
              )
            })}
          </div>
        </div>

        <div className="column w-full min-w-72 flex-1 gap-2">
          <h3 className="heading">Organizers</h3>

          <div className="row items-center w-full gap-2">
            {owners?.map((user) => {
              return (
                <div key={user.id} className="row items-center gap-2">
                  <TTTooltip label={user?.name ?? "Unnamed User"} delay={30}>
                    <ProfilePhoto user={user} size={40} fontSize={16} className="rounded-full bg-surface" />
                  </TTTooltip>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <hr className="w-full text-gray-300" />

      {hasCurrentUserSubmitted && (
        <SubmissionEdit round={round} />
      )}
    </TTBox>
  )
}
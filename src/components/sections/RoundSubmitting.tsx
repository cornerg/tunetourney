import type {Round} from "#/models/supabaseTables.ts";
import React from "react";
import {useCurrentUser} from "#/api/users.ts";
import {useSubmissions} from "#/api/submissions.ts";
import SubmissionEdit from "#/components/sections/SubmissionEdit.tsx";

interface Props {
  round: Round | null | undefined;
}
export default function RoundSubmitting({ round }: Props) {
  const { data: currentUser, isLoading: isCurrentUserLoading } = useCurrentUser();
  const { data: submissions } = useSubmissions(round?.id);

  const submittedIds = React.useMemo(() => [...(submissions ?? [])].map((submission) => submission.user_id), [submissions]);

  const mySubmission = React.useMemo(() => {
    return submissions?.find((sub) => sub.user_id === currentUser?.id);
  }, [submissions]);

  const hasCurrentUserSubmitted = React.useMemo(() => {
    return !isCurrentUserLoading && !!submittedIds.find((userId) => userId === currentUser?.id);
  }, [submittedIds]);

  return (
    <div className="column w-full gap-4">
      {hasCurrentUserSubmitted && (
        <SubmissionEdit round={round} savedSubmission={mySubmission} />
      )}
    </div>
  )
}
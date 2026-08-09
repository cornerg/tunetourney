import React from "react";
import { useSubmissions } from "#/api/submissions.ts";
import { useCurrentUser } from "#/api/users.ts";
import SubmissionEdit from "#/components/sections/SubmissionEdit.tsx";
import type { Round } from "#/models/supabaseTables.ts";

type Props = {
  round: Round | null | undefined;
}
export default function RoundSubmitting({ round }: Props) {
  const { data: currentUser, isLoading: isCurrentUserLoading } =
    useCurrentUser();
  const { data: submissions } = useSubmissions(round?.id);

  const submittedIds = React.useMemo(
    () => [...(submissions ?? [])].map(submission => submission.user_id),
    [submissions],
  );

  const mySubmission = React.useMemo(() => {
    return submissions?.find(sub => sub.user_id === currentUser?.id);
  }, [currentUser?.id, submissions]);

  const hasCurrentUserSubmitted = React.useMemo(() => {
    return (
      !isCurrentUserLoading &&
      !!submittedIds.find(userId => userId === currentUser?.id)
    );
  }, [currentUser?.id, isCurrentUserLoading, submittedIds]);

  return (
    <div className="column w-full gap-4">
      {hasCurrentUserSubmitted && (
        <SubmissionEdit round={round} savedSubmission={mySubmission} />
      )}
    </div>
  );
}

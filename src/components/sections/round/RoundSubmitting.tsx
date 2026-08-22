import React from "react";
import { useSubmissions } from "#/api/Submissions/fetchSubmissions.ts";
import SubmissionEdit from "#/components/sections/submission/SubmissionEdit.tsx";
import type { Round } from "#/models/supabaseTables.ts";
import { useCurrentUserId } from "#/api/auth/currentUserId.ts";

type Props = {
  round: Round | null | undefined;
}
export default function RoundSubmitting({ round }: Props) {
  const currentUserId = useCurrentUserId();
  const { data: submissions } = useSubmissions(round?.id);

  const mySubmission = React.useMemo(() => {
    return submissions?.find(sub => sub.user_id === currentUserId);
  }, [currentUserId, submissions]);

  return (
    <div className="column w-full gap-4">
        <SubmissionEdit round={round} savedSubmission={mySubmission} />
    </div>
  );
}

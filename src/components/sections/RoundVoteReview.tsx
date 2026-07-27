import type {Round} from "#/models/supabaseTables.ts";
import {useSubmissions} from "#/api/submissions.ts";
import React from "react";
import VoteReviewSubmission from "#/components/sections/VoteReviewSubmission.tsx";

interface Props {
  round: Round;
}
export default function RoundVoteReview({ round }: Props) {
  const { data: submissions } = useSubmissions(round?.id);

  const sortedSubmissions = React.useMemo(() => {
    if (!submissions) return [];
    return [...submissions].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return dateA - dateB;
    });
  }, [submissions]);

  return (
    <div className="column w-full gap-4">
      <div className="column w-full gap-2">
        <h3 className="heading">Submitted</h3>
        <p className="text-dark">Thank you for voting! Feel free to enjoy the submissions until voting closes.</p>
      </div>

      <div className="row w-full gap-4">
        {sortedSubmissions.map((submission) => {
          return (
            <VoteReviewSubmission key={submission.id} submission={submission} />
          )
        })}
      </div>
    </div>
  )
}
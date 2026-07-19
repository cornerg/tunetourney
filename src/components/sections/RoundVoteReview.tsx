import type {Round} from "#/models/supabaseTables.ts";
import {useSubmissions} from "#/api/submissions.ts";
import {useVotes} from "#/api/votes.ts";
import React from "react";
import VoteReviewSubmission from "#/components/sections/VoteReviewSubmission.tsx";

interface Props {
  round: Round;
}
export default function RoundVoteReview({ round }: Props) {
  const { data: submissions } = useSubmissions(round?.id);
  const { data: votes } = useVotes(round?.id);

  const getScore = React.useCallback((submissionId: string) => {
    if (!Array.isArray(votes) || votes.length <= 0) return 0;
    return votes
      .filter((vote) => vote.submission_id === submissionId)
      .reduce((total, cur) => total + cur.score, 0);
  }, [votes]);

  const sortedSubmissions = React.useMemo(() => {
    if (!submissions) return [];
    return [...submissions].sort((a, b) => {
      const scoreA = getScore(a.id);
      const scoreB = getScore(b.id);
      return scoreA - scoreB;
    });
  }, [submissions, getScore]);

  return (
    <div className="row w-full gap-4">
        {sortedSubmissions.map((submission, i) => {
          return (
            <VoteReviewSubmission key={submission.id} submission={submission} placement={i + 1} />
          )
        })}
    </div>
  )
}
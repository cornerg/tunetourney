import type {Round} from "#/models/supabaseTables.ts";
import {useSubmissions} from "#/api/submissions.ts";
import {useVotes} from "#/api/votes.ts";
import React from "react";
import SubmissionResultCard from "#/components/SubmissionResultCard.tsx";

interface Props {
  round: Round;
}
export default function RoundResults({ round }: Props) {
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
      return scoreB - scoreA;
    });
  }, [submissions, getScore]);

  return (
    <div className="column w-full gap-4">
      {sortedSubmissions.map((submission, i) => {
        const submissionVotes = (votes ?? []).filter((vote) => vote.submission_id === submission.id);

        return (
          <SubmissionResultCard
            key={submission.id}
            submission={submission}
            votes={submissionVotes}
            placement={i + 1}
            tournamentId={round.tournament_id ?? ""}
          />
        )
      })}
    </div>
  )
}
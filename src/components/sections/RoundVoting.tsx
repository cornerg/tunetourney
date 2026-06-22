import type {Round} from "#/models/supabaseTables.ts";
import React from "react";
import {useSubmissions} from "#/api/submissions.ts";
import SubmissionVote from "#/components/sections/SubmissionVote.tsx";

interface StoredVote {
  score: number;
  submissionId: string;
}

interface Props {
  round: Round | null | undefined;
}
export default function RoundVoting({ round }: Props) {
  const [votes, setVotes] = React.useState<StoredVote[]>([]);
  const { data: submissions } = useSubmissions(round?.id ?? "");

  const handleScore = React.useCallback((submissionId: string, score: number) => {
    const newList: StoredVote[] = [...votes];

    const existingVote = newList.find((vote) => vote.submissionId === submissionId);

    if (existingVote) {
      existingVote.score = score;
    } else {
      newList.push({ submissionId, score });
    }
    setVotes(newList);
  }, [votes]);

  return (
    <div className="column w-full gap-4">
      <div className="column w-full flex-1 gap-2">
        <h4 className="subheading">Submissions</h4>
      </div>

      <div className="column w-full gap-4">
        {submissions?.map((submission) => {
          const score = votes.find((vote) => vote.submissionId === submission.id)?.score;
          return <SubmissionVote key={submission.id} submission={submission} score={score} handleScore={handleScore} />
        })}
      </div>
    </div>
  )
}
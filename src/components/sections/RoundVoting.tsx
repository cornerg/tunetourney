import React from "react";
import { useCurrentUserId } from "#/api/sessions.ts";
import { useSubmissions } from "#/api/submissions.ts";
import { useInsertVotes } from "#/api/votes.ts";
import TTAlertDialogue from "#/components/primitives/TTAlertDialogue.tsx";
import TTButton from "#/components/primitives/TTButton.tsx";
import { useTTToast } from "#/components/primitives/TTToast.tsx";
import SubmissionVote from "#/components/sections/SubmissionVote.tsx";
import TotalScoreBar from "#/components/TotalScoreBar.tsx";
import type { Round, Vote } from "#/models/supabaseTables.ts";

const dialogueDescription =
  "Are you sure you want to save your votes as shown? You cannot edit your votes after they've been submitted.";

interface StoredVote {
  score: number;
  comment: string;
  submissionId: string;
}

interface Props {
  round: Round | null | undefined;
}
export default function RoundVoting({ round }: Props) {
  const [votes, setVotes] = React.useState<StoredVote[]>([]);
  const [isInserting, setIsInserting] = React.useState<boolean>(false);

  const { data: submissions } = useSubmissions(round?.id ?? "");
  const currentUserId = useCurrentUserId();
  const { mutate: insert, isPending, isError, isSuccess } = useInsertVotes();
  const { TTToast, toast } = useTTToast();

  const updateVote = React.useCallback(
    ({
      submissionId,
      score,
      comment,
    }: {
      submissionId: string;
      score?: number;
      comment?: string;
    }) => {
      const newList: StoredVote[] = [...votes];

      const existingVote = newList.find(
        vote => vote.submissionId === submissionId,
      );

      if (existingVote) {
        if (score) {
          existingVote.score = score;
        }
        if (comment) {
          existingVote.comment = comment;
        }
      } else {
        const newEntry: Partial<StoredVote> = { submissionId };
        if (score) {
          newEntry.score = score;
        }
        if (comment) {
          newEntry.comment = comment;
        }
        newList.push(newEntry as StoredVote);
      }
      setVotes(newList);
    },
    [votes],
  );

  // Save votes; they cannot be updated
  const handleSubmit = React.useCallback(
    (votes: StoredVote[], roundId: string, userId: string) => {
      if (!currentUserId) {
        console.error("No user ID to save to");
        return;
      }
      if (!round?.id) {
        console.error("No round to save to");
        return;
      }
      if (!submissions?.length) {
        console.error("No submissions to vote on");
        return;
      }

      try {
        setIsInserting(true);
        const newEntries: Partial<Vote>[] = submissions.map(sub => {
          const vote = votes.find(vote => vote.submissionId === sub.id);
          return {
            user_id: userId,
            submission_id: sub.id,
            round_id: sub.round_id ?? roundId,
            score: vote?.score ?? 0,
            comment: vote?.comment ?? "",
          };
        });
        insert([...newEntries]);
      } catch (error) {
        console.error("An error occurred: ", error);
      }
    },
    [insert],
  );

  React.useEffect(() => {
    if (isInserting && !isPending) {
      if (isError) {
        toast({
          title: "An Error Occurred",
          message: "An error occurred while saving your votes.",
          type: "error",
        });
      }
      if (isSuccess) {
        toast({
          title: "Votes Saved",
          message: "Your votes have been saved.",
          type: "success",
        });
      }
      setIsInserting(false);
    }
  }, [isInserting, isPending, isError, isSuccess]);

  const totalScoreRange = React.useMemo(() => {
    const min = (submissions?.length ?? 0) * 5;
    const max = (submissions?.length ?? 0) * 7;
    const barLimit = (submissions?.length ?? 0) * 10;
    return { min, max, barLimit };
  }, [submissions?.length]);

  const currentTotalScore = React.useMemo(() => {
    return votes?.reduce((total, cur) => total + cur.score, 0) ?? 0;
  }, [votes]);

  const canSubmit = React.useMemo(() => {
    const voteCount = votes?.length ?? 0;
    const submissionCount = submissions?.length ?? 0;
    const totalScore = votes?.reduce((total, cur) => total + cur.score, 0) ?? 0;
    return (
      voteCount === submissionCount &&
      totalScore >= totalScoreRange.min &&
      totalScore <= totalScoreRange.max
    );
  }, [votes, submissions?.length, totalScoreRange]);

  return (
    <div className="column w-full gap-4">
      <div className="row w-full flex-1 justify-between gap-2">
        <h3 className="heading">Submissions</h3>
        <TTAlertDialogue
          title="Save Votes?"
          description={dialogueDescription}
          buttonText="Continue"
          onConfirm={() =>
            handleSubmit(votes, round?.id ?? "", currentUserId ?? "")
          }>
          <TTButton
            buttonStyle="primary"
            className="px-2"
            disabled={!canSubmit}>
            Place Votes
          </TTButton>
        </TTAlertDialogue>
      </div>

      <TotalScoreBar
        min={totalScoreRange.min}
        max={totalScoreRange.max}
        limit={totalScoreRange.barLimit}
        value={currentTotalScore}
      />

      <div className="column w-full gap-4">
        {submissions?.map(submission => {
          const vote = votes.find(vote => vote.submissionId === submission.id);
          const submissionId = submission.id;
          return (
            <SubmissionVote
              key={submission.id}
              submission={submission}
              score={vote?.score}
              handleScore={(score: number) =>
                updateVote({ submissionId, score })
              }
              comment={vote?.comment ?? ""}
              handleComment={(comment: string) =>
                updateVote({ submissionId, comment })
              }
            />
          );
        })}
      </div>

      <TTToast />
    </div>
  );
}

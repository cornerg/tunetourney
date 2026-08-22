import React from "react";
import { useCurrentUserId } from "#/api/auth/currentUserId.ts";
import { useSubmissions } from "#/api/Submissions/fetchSubmissions.ts";
import { useInsertVotes } from "#/api/Votes/insertVotes.ts";
import TTAlertDialogue from "#/components/primitives/TTAlertDialogue.tsx";
import TTButton from "#/components/primitives/TTButton.tsx";
import SubmissionVote from "#/components/sections/submission/SubmissionVote.tsx";
import TotalScoreBar from "#/components/TotalScoreBar.tsx";
import type { Round, Vote } from "#/models/supabaseTables.ts";
import { useToast } from "#/state/toastStore.ts";

const dialogueDescription =
  "Are you sure you want to save your votes as shown? You cannot edit your votes after they've been submitted.";

type StoredVote = {
  score: number;
  comment: string;
  submissionId: string;
}

type Props = {
  round: Round | null | undefined;
}
export default function RoundVoting({ round }: Props) {
  const [votes, setVotes] = React.useState<StoredVote[]>([]);
  const [isInserting, setIsInserting] = React.useState<boolean>(false);

  const { data: submissions } = useSubmissions(round?.id ?? "");
  const currentUserId = useCurrentUserId();
  const { mutateAsync: insert } = useInsertVotes();
  const { showToast } = useToast();

  const updateVote = React.useCallback(
    (updatedVote: Partial<StoredVote>) => {
      const existingVote = votes.find(
        vote => vote.submissionId === updatedVote.submissionId,
      );
      setVotes([
        ...votes.filter((vote) => vote.submissionId !== updatedVote?.submissionId),
        { comment: "", score: 0, ...existingVote, ...updatedVote } as StoredVote
      ]);
    },
    [votes],
  );

  // Save votes; they cannot be updated
  const handleSubmit = React.useCallback(
    async (votes: StoredVote[], roundId: string, userId: string) => {
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
        const response = await insert([...newEntries]);
        if (!response || !Array.isArray(response) || !response.length) {
          throw new Error("Invalid response from vote creation.");
        }
        showToast({
          title: "Votes Saved!",
          message: "Your votes have been submitted! Stay tuned for the results.",
          type: "success",
        });
      } catch (error) {
        console.error("An error occurred: ", error);
        showToast({
          title: "An Error Occurred",
          message: "An error occurred while saving your votes.",
          type: "error",
        });
      } finally {
        setIsInserting(false);
      }
    },
    [currentUserId, insert, round?.id, showToast, submissions],
  );

  const totalScoreRange = React.useMemo(() => {
    const otherSubmissions = (submissions ?? []).filter((sub) => sub.user_id !== currentUserId);
    const min = otherSubmissions.length * 5;
    const max = otherSubmissions.length * 7;
    const barLimit = otherSubmissions.length * 10;
    return { min, max, barLimit };
  }, [currentUserId, submissions]);

  const currentTotalScore = React.useMemo(() => {
    return votes?.reduce((total, cur) => total + cur.score, 0) ?? 0;
  }, [votes]);

  const canSubmit = React.useMemo(() => {
    if (isInserting) return false;
    const voteCount = votes?.length ?? 0;
    const submissionCount = (submissions ?? []).filter((sub) => sub.user_id !== currentUserId).length ?? 0;
    const totalScore = votes?.reduce((total, cur) => total + cur.score, 0) ?? 0;
    return (
      voteCount === submissionCount &&
      totalScore >= totalScoreRange.min &&
      totalScore <= totalScoreRange.max
    );
  }, [isInserting, votes, submissions, totalScoreRange.min, totalScoreRange.max, currentUserId]);

  return (
    <div className="column w-full gap-4">
      <div className="row w-full flex-1 justify-between gap-2 mb-1">
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
              isOwner={submission.user_id === currentUserId}
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
    </div>
  );
}

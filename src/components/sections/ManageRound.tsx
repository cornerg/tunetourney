import React from "react";
import { useUpdateRound } from "#/api/rounds.ts";
import { useSubmissions } from "#/api/submissions.ts";
import { useTournamentUsers, useVotedUsers } from "#/api/users.ts";
import TTAlertDialogue from "#/components/primitives/TTAlertDialogue.tsx";
import TTButton from "#/components/primitives/TTButton.tsx";
import { ROUND_STATUS } from "#/models/RoundStatus.ts";
import type { Round } from "#/models/supabaseTables.ts";
import { useLoadScreen } from "#/state/loadscreenState.ts";
import { useToast } from "#/state/toastStore.ts";

type Props = {
  round: Round;
}
export default function ManageRound({ round }: Props) {

  const { data: participants } = useTournamentUsers(round?.tournament_id ?? "");
  const { data: submissions } = useSubmissions(round?.id ?? "");
  const { data: votedUsers } = useVotedUsers(round?.id ?? "");
  const { mutateAsync: updateRound } = useUpdateRound();
  const { show, hide } = useLoadScreen();
  const { showToast } = useToast();

  const areAllSubmitted = React.useMemo(() => {
    if (round.status === ROUND_STATUS.submitting) {
      return !participants?.filter(
        user => !submissions?.map(sub => sub.user_id)?.includes(user.id),
      );
    }
    if (round.status === ROUND_STATUS.voting) {
      return !participants?.filter(user => !votedUsers?.includes(user.id));
    }
    return true;
  }, [submissions, votedUsers, participants, round.status]);

  const advanceLabel = React.useMemo(() => {
    switch (round.status) {
      case ROUND_STATUS.pending:
        return "Start Round";
      case ROUND_STATUS.submitting:
        return "Close Submission";
      case ROUND_STATUS.voting:
        return "Close Voting";
      default:
        return "Round Ended";
    }
  }, [round.status]);

  const dialogueDescription = React.useMemo(() => {
    if (round?.status === ROUND_STATUS.submitting && !areAllSubmitted) {
      return "Some participants have not yet submitted. Are you sure you want to close submissions?";
    }
    if (round?.status === ROUND_STATUS.voting && !areAllSubmitted) {
      return "Some participants have not yet voted. Are you sure you want to end the round?";
    }

    switch (round.status) {
      case ROUND_STATUS.pending:
        return "Are you sure you want to begin submission this round?";
      case ROUND_STATUS.submitting:
        return "Are you sure you want to close submissions?";
      case ROUND_STATUS.voting:
        return "Are you sure you want to end voting and complete the round?";
      default:
        return "This round has already been completed.";
    }
  }, [round.status, areAllSubmitted]);

  const buttonStyle = React.useMemo(() => {
    if (
      (round?.status === ROUND_STATUS.submitting && !areAllSubmitted) ||
      round?.status === ROUND_STATUS.voting
    ) {
      return "outline";
    }
    return "primary";
  }, [round.status, areAllSubmitted]);

  const handleAdvance = React.useCallback(
    async (advanceRound: Round | undefined) => {
      if (!advanceRound?.id) {
        console.error("No round to advance");
        return;
      }
      if (advanceRound.status >= ROUND_STATUS.closed) {
        console.error("Round is closed");
        return;
      }

      const nextStatus = advanceRound.status + 1;
      try {
        show("Updating round");
        await updateRound({ id: advanceRound.id, status: nextStatus });
        hide();
        showToast({
          title: "Submission Saved",
          message: "Your submission has been saved.",
          type: "success",
        });
      } catch (e) {
        console.error("Something went wrong updating the round. ", e);
        showToast({
          title: "An Error Occurred",
          message: "An error occurred while saving your submission.",
          type: "error",
        });
      }
    },
    [show, updateRound, hide, showToast],
  );

  return (
    <div className="row justify-end w-max gap-2">
      <TTAlertDialogue
        title="Advance Round?"
        description={dialogueDescription}
        buttonText="Continue"
        onConfirm={() => handleAdvance(round)}>
        <TTButton buttonStyle={buttonStyle} className="min-h-9 px-2">
          {advanceLabel}
        </TTButton>
      </TTAlertDialogue>
    </div>
  );
}

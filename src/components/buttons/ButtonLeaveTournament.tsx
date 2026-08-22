import type { Tournament } from "#/models/supabaseTables.ts";
import TTAlertDialogue from "#/components/primitives/TTAlertDialogue.tsx";
import { RiLogoutBoxRLine } from "react-icons/ri";
import TTButton from "#/components/primitives/TTButton.tsx";
import React from "react";
import { useCurrentUserId } from "#/api/auth/currentUserId.ts";
import { useLoadScreen } from "#/state/loadscreenState.ts";
import { useToast } from "#/state/toastStore.ts";
import { useNavigate } from "@tanstack/react-router";
import { useDeleteTournamentUser } from "#/api/TournamentUsers/deleteTournamentUser.ts";
import { useTournamentOwners } from "#/api/TournamentUsers/fetchTournamentOwners.ts";

const description =
  "Are you sure you want to leave this tournament? You will lose all score accumulated in so far.";

type Props = {
  tournament: Tournament;
};
export default function ButtonLeaveTournament({ tournament }: Props) {
  const userId = useCurrentUserId();
  const { data: owners } = useTournamentOwners(tournament.id);
  const currentUserId = useCurrentUserId();
  const { mutateAsync: deleteTournamentUser } = useDeleteTournamentUser();
  const { show, hide } = useLoadScreen();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const isOwner = React.useMemo(() => {
    return !!currentUserId && !!owners?.find((owner) => owner.id === currentUserId);
  }, [currentUserId, owners]);

  const canLeave = React.useMemo(() => {
    if (!isOwner) return true;
    return (
      !!currentUserId && !!owners?.find(owner => owner.id !== currentUserId)
    );
  }, [currentUserId, isOwner, owners]);

  const handleDelete = React.useCallback(async () => {
    show("Leaving tournament");
    try {
      const response = await deleteTournamentUser({ userId, tournamentId: tournament.id });
      if (!response) {
        throw new Error("Invalid response from delete TournamentUser");
      }
      hide();
      showToast({
        title: "Left tournament",
        message: "You are no longer participating in the tournament.",
        type: "success",
      });
      await navigate({ to: "/tournaments" });
    } catch (error) {
      console.error(error);
      showToast({
        title: "An error occurred",
        message:
          "Something went wrong, you have not been removed from the tournament.",
        type: "error",
      });
    }
  }, [deleteTournamentUser, hide, navigate, show, showToast, tournament.id, userId]);

  return (
    <TTAlertDialogue
      title="Leave Tournament"
      description={description}
      buttonText="I'm sure"
      onConfirm={handleDelete}>
      <TTButton
        buttonStyle="outline"
        className="w-8 h-8"
        tooltip={
          canLeave ? "Leave tournament" : "Can't leave tournament, you are the last owner"
        }
        disabled={!canLeave}>
        <RiLogoutBoxRLine size={22} />
      </TTButton>
    </TTAlertDialogue>
  );
}

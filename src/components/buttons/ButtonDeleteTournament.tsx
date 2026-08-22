import type { Tournament } from "#/models/supabaseTables.ts";
import TTAlertDialogue from "#/components/primitives/TTAlertDialogue.tsx";
import TTButton from "#/components/primitives/TTButton.tsx";
import React from "react";
import { useLoadScreen } from "#/state/loadscreenState.ts";
import { useToast } from "#/state/toastStore.ts";
import { useNavigate } from "@tanstack/react-router";
import { FiTrash2 } from "react-icons/fi";
import { useDeleteTournament } from "#/api/Tournaments/deleteTournament.ts";

const description =
  "Are you sure you want to delete this tournament? All scores accumulated will be lost.";

type Props = {
  tournament: Tournament;
};
export default function ButtonDeleteTournament({ tournament }: Props) {
  const { mutateAsync: deleteTournament } = useDeleteTournament();
  const { show, hide } = useLoadScreen();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleDelete = React.useCallback(async () => {
    show("Deleting tournament");
    try {
      const response = await deleteTournament(tournament.id);
      if (!response) {
        throw new Error("Invalid response from delete Tournament");
      }
      hide();
      showToast({
        title: "Tournament deleted",
        message: "The tournament has been removed.",
        type: "success",
      });
      await navigate({ to: "/tournaments" });
    } catch (error) {
      console.error(error);
      showToast({
        title: "An error occurred",
        message: "Something went wrong, the tournament was not removed.",
        type: "error",
      });
    }
  }, [deleteTournament, hide, navigate, show, showToast, tournament.id]);

  return (
    <TTAlertDialogue
      title="Delete Tournament"
      description={description}
      buttonText="I'm sure"
      onConfirm={handleDelete}>
      <TTButton buttonStyle="outline" className="w-8 h-8" tooltip="Delete tournament">
        <FiTrash2 size={22} />
      </TTButton>
    </TTAlertDialogue>
  );
}

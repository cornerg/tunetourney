import type { Club } from "#/models/supabaseTables.ts";
import TTAlertDialogue from "#/components/primitives/TTAlertDialogue.tsx";
import TTButton from "#/components/primitives/TTButton.tsx";
import React from "react";
import { useLoadScreen } from "#/state/loadscreenState.ts";
import { useToast } from "#/state/toastStore.ts";
import { useNavigate } from "@tanstack/react-router";
import { useDeleteClub } from "#/api/Clubs/deleteClub.ts";
import { FiTrash2 } from "react-icons/fi";

const description =
  "Are you sure you want to delete this club? This will end all running tournaments.";

type Props = {
  club: Club;
};
export default function ButtonDeleteClub({ club }: Props) {
  const { mutateAsync: deleteClub } = useDeleteClub();
  const { show, hide } = useLoadScreen();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleDelete = React.useCallback(async () => {
    show("Deleting club");
    try {
      const response = await deleteClub(club.id);
      if (!response) {
        throw new Error("Invalid response from delete Club");
      }
      hide();
      showToast({
        title: "Club deleted",
        message: "The club has been removed.",
        type: "success",
      });
      await navigate({ to: "/clubs" });
    } catch (error) {
      console.error(error);
      showToast({
        title: "An error occurred",
        message:
          "Something went wrong, the club was not removed.",
        type: "error",
      });
    }
  }, [club.id, deleteClub, hide, navigate, show, showToast]);

  return (
    <TTAlertDialogue
      title="Leave Club"
      description={description}
      buttonText="I'm sure"
      onConfirm={handleDelete}>
      <TTButton buttonStyle="outline" className="w-8 h-8" tooltip="Delete club">
        <FiTrash2 size={22} />
      </TTButton>
    </TTAlertDialogue>
  );
}

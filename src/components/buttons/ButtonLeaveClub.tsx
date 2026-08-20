import type { Club } from "#/models/supabaseTables.ts";
import TTAlertDialogue from "#/components/primitives/TTAlertDialogue.tsx";
import { RiLogoutBoxRLine } from "react-icons/ri";
import TTButton from "#/components/primitives/TTButton.tsx";
import React from "react";
import { useCurrentUserId } from "#/api/auth/currentUserId.ts";
import { useClubUsers } from "#/api/ClubUsers/fetchClubUsers.ts";
import { useDeleteClubUser } from "#/api/ClubUsers/deleteClubUser.ts";
import { useLoadScreen } from "#/state/loadscreenState.ts";
import { useToast } from "#/state/toastStore.ts";
import { useNavigate } from "@tanstack/react-router";

const description = "Are you sure you want to leave this club? You won't be able to rejoin without an invite."

type Props = {
  club: Club;
}
export default function ButtonLeaveClub({ club }: Props) {
  const userId = useCurrentUserId();
  const { data: members } = useClubUsers(club.id);
  const { mutateAsync: deleteClubUser } = useDeleteClubUser();
  const { show, hide } = useLoadScreen();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const canLeave = React.useMemo(() => {
    const currentUserMember = members?.find(mem => mem.user_id === userId);
    if (!!currentUserMember && !currentUserMember.is_owner) return true;
    return !!members?.find(mem => mem.is_owner && mem.user_id !== userId);
  }, [members, userId]);

  const handleDelete = React.useCallback(async () => {
    show("Leaving club");
    try {
      const response = await deleteClubUser({ userId, clubId: club.id });
      if (!response) {
        throw new Error("Invalid response from delete ClubUser");
      }
      hide();
      showToast({
        title: "Left club",
        message: "You are no longer a member of the club.",
        type: "success",
      });
      await navigate({ to: "/clubs" });
    } catch (error) {
      console.error(error);
      showToast({
        title: "An error occurred",
        message: "Something went wrong, you have not been removed from the club.",
        type: "error",
      });
    }
  }, [club.id, deleteClubUser, hide, navigate, show, showToast, userId]);
  
  return (
    <TTAlertDialogue
      title="Leave Club"
      description={description}
      buttonText="I'm sure"
      onConfirm={handleDelete}>
      <TTButton
        buttonStyle="outline"
        className="w-8 h-8"
        tooltip={
          canLeave ? "Leave club" : "Can't leave club, you are the last owner"
        }
        disabled={!canLeave}>
        <RiLogoutBoxRLine size={22} />
      </TTButton>
    </TTAlertDialogue>
  );
}
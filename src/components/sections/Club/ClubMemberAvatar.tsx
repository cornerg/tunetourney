import type { Club, User } from "#/models/supabaseTables.ts";
import TTTooltip from "#/components/primitives/TTTooltip.tsx";
import ProfilePhoto from "#/components/ProfilePhoto.tsx";
import React from "react";
import { DropdownMenu } from "radix-ui";
import TTDropdownMenu from "#/components/primitives/TTDropdownMenu.tsx";
import { useDeleteClubUser } from "#/api/ClubUsers/deleteClubUser.ts";
import { useToast } from "#/state/toastStore.ts";
import { useCurrentUserId } from "#/api/auth/currentUserId.ts";
import { cn } from "#/utils/utils.ts";

type Props = {
  club: Club;
  user: User;
  isOwner: boolean;
}
export default function ClubMemberAvatar({ club, user, isOwner }: Props) {
  const currentUserId = useCurrentUserId();
  const { mutateAsync: deleteClubUser } = useDeleteClubUser();
  const { showToast } = useToast();

  const showOptions = React.useMemo(() => {
    return isOwner && user.id !== currentUserId;
  }, [isOwner, user.id, currentUserId]);

  const handleRemoveUser = React.useCallback(async () => {
    try {
      const response = await deleteClubUser({ userId: user.id, clubId: club.id });
      if (!response) {
        throw new Error("Invalid response from delete ClubUser");
      }
      showToast({
        title: "User removed",
        message: "The member has been removed from the club.",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      showToast({
        title: "An error occurred",
        message: "Something went wrong, the user has not been removed from the club.",
        type: "error",
      });
    }
  }, [club.id, deleteClubUser, showToast, user.id])
  
  return (
    <TTDropdownMenu
      width={128}
      disabled={!showOptions}
      options={[
        <DropdownMenu.Item
          key="removeUser"
          className="dropdownMenuItem"
          onClick={handleRemoveUser}>
          Remove User
        </DropdownMenu.Item>,
      ]}>
      <div className={cn("row items-center gap-2", { "cursor-pointer": showOptions })}>
        <TTTooltip label={user?.name ?? "Unnamed User"} delay={30}>
          <ProfilePhoto
            user={user}
            size={48}
            fontSize={18}
            className="rounded-full bg-surface border"
          />
        </TTTooltip>
      </div>
    </TTDropdownMenu>
  );
}
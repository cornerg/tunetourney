import type { Tournament, User } from "#/models/supabaseTables.ts";
import TTTooltip from "#/components/primitives/TTTooltip.tsx";
import ProfilePhoto from "#/components/ProfilePhoto.tsx";
import React from "react";
import { DropdownMenu } from "radix-ui";
import TTDropdownMenu from "#/components/primitives/TTDropdownMenu.tsx";
import { useToast } from "#/state/toastStore.ts";
import { useCurrentUserId } from "#/api/auth/currentUserId.ts";
import { cn } from "#/utils/utils.ts";
import { FaShieldHalved } from "react-icons/fa6";
import { useDeleteTournamentUser } from "#/api/TournamentUsers/deleteTournamentUser.ts";
import type { TournamentScore } from "#/models/supabaseUtils.ts";

type Props = {
  tournament: Tournament;
  user: User | TournamentScore;
  isOwner?: boolean;
  isCurrentUserOwner?: boolean;
};
export default function TournamentMemberAvatar({ tournament, user, isOwner, isCurrentUserOwner }: Props) {
  const currentUserId = useCurrentUserId();
  const { mutateAsync: deleteTournamentUser } = useDeleteTournamentUser();
  const { showToast } = useToast();

  const showOptions = React.useMemo(() => {
    return isCurrentUserOwner && user.id !== currentUserId;
  }, [isCurrentUserOwner, user.id, currentUserId]);

  const handleRemoveUser = React.useCallback(async () => {
    try {
      const response = await deleteTournamentUser({
        userId: user.id,
        tournamentId: tournament.id,
      });
      if (!response) {
        throw new Error("Invalid response from delete TournamentUser");
      }
      showToast({
        title: "User removed",
        message: "The member has been removed from the tournament.",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      showToast({
        title: "An error occurred",
        message:
          "Something went wrong, the user has not been removed from the tournament.",
        type: "error",
      });
    }
  }, [tournament.id, deleteTournamentUser, showToast, user.id]);

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
      <div
        className={cn("relative row items-center gap-2", {
          "cursor-pointer": showOptions,
        })}>
        <TTTooltip label={user?.name ?? "Unnamed User"} delay={30}>
          <ProfilePhoto
            avatarUrl={user.avatar}
            name={user.name}
            size={48}
            fontSize={18}
            className="rounded-full bg-surface border"
          />
        </TTTooltip>

        {isOwner && (
          <TTTooltip label="Organizer" delay={30}>
            <div className="absolute row w-4 h-4 -top-0.5 -right-0.5 justify-center items-center rounded-full bg-primary z-1">
              <FaShieldHalved size={10} className="w-2.5 h-2.5 text-surface" />
            </div>
          </TTTooltip>
        )}
      </div>
    </TTDropdownMenu>
  );
}

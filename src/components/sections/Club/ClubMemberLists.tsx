import React from "react";
import type { Club } from "#/models/supabaseTables.ts";
import TTDialog from "#/components/primitives/TTDialog.tsx";
import TTTooltip from "#/components/primitives/TTTooltip.tsx";
import { RxPlus } from "react-icons/rx";
import { useClubUsers } from "#/api/ClubUsers/fetchClubUsers.ts";
import { useCurrentUserId } from "#/api/auth/currentUserId.ts";
import CreateClubInvites from "#/components/sections/dialogs/CreateClubInvites.tsx";
import ClubMemberAvatar from "#/components/sections/Club/ClubMemberAvatar.tsx";

type Props = {
  club: Club;
}
export default function ClubMemberLists({ club }: Props) {
  const [inviteDialogOpen, setInviteDialogOpen] = React.useState<boolean>(false);

  const { data: allMembers } = useClubUsers(club.id);
  const currentUserId = useCurrentUserId();

  const isOwner = React.useMemo(() => {
    return !!allMembers?.find(
      mem => mem.user_id === currentUserId && mem.is_owner,
    );
  }, [allMembers, currentUserId]);

  const members = React.useMemo(() => {
    return [...(allMembers ?? [])]
      .filter(u => !u.is_owner && !!u.userData)
      .map(clubUser => clubUser.userData!)
      .sort((a, b) => (a.name === b.name ? 0 : a.name > b.name ? 1 : -1));
  }, [allMembers]);

  const owners = React.useMemo(() => {
    return [...(allMembers ?? [])]
      .filter(u => u.is_owner && !!u.userData)
      .map(clubUser => clubUser.userData!)
      .sort((a, b) => (a.name === b.name ? 0 : a.name > b.name ? 1 : -1));
  }, [allMembers]);
  
  return (
    <div className="row w-full gap-8 flex-wrap">
      <div className="column gap-2 min-w-3xs flex-1">
        <p className="text-dark font-semibold">Owners</p>

        <div className="row w-max gap-2 items-center">
          {owners?.map(user => (
            <ClubMemberAvatar
              key={user.id}
              club={club}
              user={user}
              isOwner={isOwner}
            />
          ))}

          {isOwner && (
            <TTTooltip label="Invite an owner" delay={30}>
              <div
                className="group row w-12 h-12 justify-center items-center rounded-full bg-surface border border-dashed border-gray-300 hover:bg-background hover:border-gray-500 transition-colors cursor-pointer"
                onClick={() => setInviteDialogOpen(true)}>
                <RxPlus
                  size={22}
                  className="text-gray-300 group-hover:text-gray-500 w-5.5 h-5.5 transition-colors"
                />
              </div>
            </TTTooltip>
          )}
        </div>
      </div>

      <div className="column gap-2 min-w-3xs flex-1">
        <p className="text-dark font-semibold">Members</p>

        <div className="row w-max gap-2 items-center">
          {members?.map(user => (
            <ClubMemberAvatar
              key={user.id}
              club={club}
              user={user}
              isOwner={isOwner}
            />
          ))}

          {isOwner && (
            <TTTooltip label="Invite a member" delay={30}>
              <div
                className="group row w-12 h-12 justify-center items-center rounded-full bg-surface border border-dashed border-gray-300 hover:bg-background hover:border-gray-500 transition-colors cursor-pointer"
                onClick={() => setInviteDialogOpen(true)}>
                <RxPlus
                  size={22}
                  className="text-gray-300 group-hover:text-gray-500 w-5.5 h-5.5 transition-colors"
                />
              </div>
            </TTTooltip>
          )}
        </div>
      </div>

      <TTDialog
        isOpen={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
        title={`Invite Users to ${club.title}`}
        className="gap-2"
        width={512}>
        <CreateClubInvites
          club={club}
          closeDialog={() => setInviteDialogOpen(false)}
        />
      </TTDialog>
    </div>
  );
}

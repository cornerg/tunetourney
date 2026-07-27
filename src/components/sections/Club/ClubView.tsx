import React from "react";
import type {Club, User} from "#/models/supabaseTables.ts";
import {cn} from "#/utils/utils.ts";
import TTButton from "#/components/primitives/TTButton.tsx";
import {GoPencil} from "react-icons/go";
import {FiTrash2} from "react-icons/fi";
import {RiLogoutBoxRLine} from "react-icons/ri";
import {useClubUsers} from "#/api/clubs.ts";
import ClubLogo from "#/components/ClubLogo.tsx";
import {getGradient, useBreakpoints} from "#/hooks/utils.ts";
import TTTooltip from "#/components/primitives/TTTooltip.tsx";
import ProfilePhoto from "#/components/ProfilePhoto.tsx";
import {useCurrentUserId} from "#/api/sessions.ts";
import {RxPlus} from "react-icons/rx";
import TTDialog from "#/components/primitives/TTDialog.tsx";
import CreateClubInvites from "#/components/sections/CreateClubInvites.tsx";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  club: Club;
  setEdit: (newState: boolean) => void;
}
export default function ClubView({ club, setEdit, className }: Props) {
  const [inviteDialogOpen, setInviteDialogOpen] = React.useState<boolean>(false);

  const { isMobile } = useBreakpoints();
  const { data: allMembers } = useClubUsers(club.id);
  const currentUserId = useCurrentUserId();

  const gradient = React.useMemo(() => {
    const seed = parseInt(new Date(club?.created_at ?? Date.now()).getTime().toString().slice(-1));
    return getGradient(seed);
  }, [club]);

  const isOwner = React.useMemo(() => {
    return !!allMembers?.find((mem) => mem.user_id === currentUserId && mem.is_owner);
  }, [allMembers, currentUserId]);

  const members = React.useMemo(() => {
    return [...(allMembers ?? [])]
      .filter((u) => !u.is_owner && !!u.userData)
      .map((clubUser) => clubUser.userData as User)
      .sort((a, b) => a.name === b.name ? 0 : a.name > b.name ? 1 : -1);
  }, [allMembers]);

  const owners = React.useMemo(() => {
    return [...(allMembers ?? [])]
      .filter((u) => u.is_owner && !!u.userData)
      .map((clubUser) => clubUser.userData as User)
      .sort((a, b) => a.name === b.name ? 0 : a.name > b.name ? 1 : -1);
  }, [allMembers]);

  return (
    <div className={cn("column w-full h-max pb-2", className)}>
      <div
        className="row w-full h-64 justify-end gap-1 bg-cover bg-center p-2"
        style={club?.banner ? { backgroundImage: `url(${club?.banner})` } : { background: `linear-gradient(45deg, ${gradient.start}, ${gradient.end})` }}
      >
        <TTButton buttonStyle="outline" className="w-8 h-8" tooltip="Edit club" onClick={() => setEdit(true)}>
          <GoPencil size={22} />
        </TTButton>

        <TTButton buttonStyle="outline" className="w-8 h-8" tooltip="Delete club">
          <FiTrash2 size={22} />
        </TTButton>

        <TTButton buttonStyle="outline" className="w-8 h-8" tooltip="Leave club">
          <RiLogoutBoxRLine size={22} />
        </TTButton>
      </div>

      <div className={cn("column w-full gap-4 pb-6", { "px-8": !isMobile, "px-4": isMobile })}>
        <div className="row w-full h-[110px] items-end gap-4 mt-[-55px]">
          <ClubLogo club={club} placeholderClassName="text-4xl font-semibold" className="rounded-2xl h-[110px] shadow-[1px_-2px_8px_0px] shadow-black/50" />

          <div className="row h-[110px] w-full flex-1 pt-[55px] items-center">
            <h2 className="subtitle">{club?.title}</h2>
          </div>
        </div>

        <p className="text-lg">{club?.description || "-"}</p>

        <hr className="w-full text-gray-400" />

        <div className="row w-full gap-8 flex-wrap">
          <div className="column gap-2 min-w-3xs flex-1">
            <p className="text-dark font-semibold">Owners</p>

            <div className="row w-max gap-2 items-center">
              {owners?.map((user) => {
                return (
                  <div key={user.id} className="row items-center gap-2">
                    <TTTooltip label={user?.name ?? "Unnamed User"} delay={30}>
                      <ProfilePhoto user={user} size={48} fontSize={18} className="rounded-full bg-surface border-1" />
                    </TTTooltip>
                  </div>
                )
              })}

              {isOwner && (
                <TTTooltip label="Invite an owner" delay={30}>
                  <div
                    className="group row w-12 h-12 justify-center items-center rounded-full bg-surface border border-dashed border-gray-300 hover:bg-background hover:border-gray-500 transition-colors cursor-pointer"
                    onClick={() => setInviteDialogOpen(true)}
                  >
                    <RxPlus size={22} className="text-gray-300 group-hover:text-gray-500 w-5.5 h-5.5 transition-colors" />
                  </div>
                </TTTooltip>
              )}
            </div>
          </div>

          <div className="column gap-2 min-w-3xs flex-1">
            <p className="text-dark font-semibold">Members</p>

            <div className="row w-max gap-2 items-center">
              {members?.map((user) => {
                return (
                  <div key={user.id} className="row items-center gap-2">
                    <TTTooltip label={user?.name ?? "Unnamed User"} delay={30}>
                      <ProfilePhoto user={user} size={48} fontSize={18} className="rounded-full bg-surface border-1" />
                    </TTTooltip>
                  </div>
                )
              })}

              {isOwner && (
                <TTTooltip label="Invite a member" delay={30}>
                  <div
                    className="group row w-12 h-12 justify-center items-center rounded-full bg-surface border border-dashed border-gray-300 hover:bg-background hover:border-gray-500 transition-colors cursor-pointer"
                    onClick={() => setInviteDialogOpen(true)}
                  >
                    <RxPlus size={22} className="text-gray-300 group-hover:text-gray-500 w-5.5 h-5.5 transition-colors" />
                  </div>
                </TTTooltip>
              )}
            </div>
          </div>
        </div>
      </div>

      <TTDialog isOpen={inviteDialogOpen} onOpenChange={setInviteDialogOpen} title={`Invite Users to ${club.title}`} className="gap-2" width={512}>
        <CreateClubInvites club={club} closeDialog={() => setInviteDialogOpen(false)} />
      </TTDialog>
    </div>
  )
}
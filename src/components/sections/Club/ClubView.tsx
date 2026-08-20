import React from "react";
import ClubLogo from "#/components/sections/Club/ClubLogo.tsx";
import TTButton from "#/components/primitives/TTButton.tsx";
import { getGradient, useBreakpoints } from "#/hooks/utils.ts";
import type { Club } from "#/models/supabaseTables.ts";
import { cn } from "#/utils/utils.ts";
import { GoPencil } from "react-icons/go";
import ClubMemberLists from "#/components/sections/Club/ClubMemberLists.tsx";
import ButtonLeaveClub from "#/components/buttons/ButtonLeaveClub.tsx";
import { useClubUsers } from "#/api/ClubUsers/fetchClubUsers.ts";
import { useCurrentUserId } from "#/api/auth/currentUserId.ts";
import ButtonDeleteClub from "#/components/buttons/ButtonDeleteClub.tsx";

const now = Date.now();

type Props = {
  club: Club;
  setEdit: (newState: boolean) => void;
} & React.HTMLAttributes<HTMLDivElement>
export default function ClubView({ club, setEdit, className }: Props) {
  const { isMobile } = useBreakpoints();
  const { data: members } = useClubUsers(club.id);
  const currentUserId = useCurrentUserId();

  const isOwner = React.useMemo(() => {
    const currentUserMember = members?.find(
      mem => mem.user_id === currentUserId,
    );
    return !!currentUserMember?.is_owner;
  }, [members, currentUserId]);

  const gradient = React.useMemo(() => {
    const seed = parseInt(
      new Date(club?.created_at ?? now).getTime().toString().slice(-1),
    );
    return getGradient(seed);
  }, [club]);

  return (
    <div
      className={cn(
        "column w-full h-max pb-2 rounded-3xl rounded-tr-xl overflow-hidden bg-surface border border-gray-400",
        className,
      )}>
      <div
        className="row w-full h-64 justify-end gap-1 bg-cover bg-center p-2"
        style={
          club?.banner
            ? { backgroundImage: `url(${club?.banner})` }
            : {
                background: `linear-gradient(45deg, ${gradient.start}, ${gradient.end})`,
              }
        }>
        {isOwner && (
          <>
            <TTButton
              buttonStyle="outline"
              className="w-8 h-8"
              tooltip="Edit club"
              onClick={() => setEdit(true)}>
              <GoPencil size={22} />
            </TTButton>

            <ButtonDeleteClub club={club} />
          </>
        )}

        <ButtonLeaveClub club={club} />
      </div>

      <div
        className={cn("column w-full gap-4 pb-6", {
          "px-8": !isMobile,
          "px-4": isMobile,
        })}>
        <div className="row w-full h-27.5 items-end gap-4 -mt-13.75">
          <ClubLogo
            club={club}
            placeholderClassName="text-4xl font-semibold"
            className="rounded-2xl h-27.5 shadow-[1px_-2px_8px_0px] shadow-black/50"
          />

          <div className="row h-27.5 w-full flex-1 pt-13.75 items-center">
            <h2 className="subtitle">{club?.title}</h2>
          </div>
        </div>

        <p className="text-lg">{club?.description || "-"}</p>

        <hr className="w-full text-gray-400" />

        <ClubMemberLists club={club} />
      </div>
    </div>
  );
}

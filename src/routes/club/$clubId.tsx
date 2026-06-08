import { createFileRoute } from '@tanstack/react-router'
import {useClubs, useClubUsers} from "#/api/clubs.ts";
import React from "react";
import {GoPencil} from "react-icons/go";
import {FiTrash2} from "react-icons/fi";
import {RiLogoutBoxRLine} from "react-icons/ri";
import TTButton from "#/components/primitives/TTButton.tsx";
import ClubLogo from "#/components/ClubLogo.tsx";
import {IoCloseSharp} from "react-icons/io5";
import {LuSave} from "react-icons/lu";
import ClubInfoView from "#/components/sections/ClubInfoView.tsx";
import {useBreakpoints} from "#/hooks/utils.ts";
import {cn} from "#/utils/utils.ts";

function ClubPage() {
  const [edit, setEdit] = React.useState<boolean>(false);

  const { isMobile } = useBreakpoints();
  const { clubId } = Route.useParams();
  const { data: clubs } = useClubs();
  const { data: members } = useClubUsers(clubId);
  console.log(`Members of club ${clubId}: `, members);

  const club = React.useMemo(() => {
    return clubs?.find((cl) => cl.id === clubId);
  }, [clubId, clubs]);

  return (
    <div className="column w-full h-[100vh] rounded-3xl rounded-tr-xl overflow-hidden bg-surface border border-gray-400">
      <div className="row w-full h-64 justify-end gap-1 bg-cover bg-center p-2" style={{ backgroundImage: `url(${club?.banner})` }}>
        {!edit && (
          <>
            <TTButton className="w-8 h-8" tooltip="Edit club" onClick={() => setEdit(true)}>
              <GoPencil size={22} />
            </TTButton>

            <TTButton className="w-8 h-8" tooltip="Delete club">
              <FiTrash2 size={22} />
            </TTButton>

            <TTButton className="w-8 h-8" tooltip="Delete club">
              <RiLogoutBoxRLine size={22} />
            </TTButton>
          </>
        )}

        {edit && (
          <>
            <TTButton className="w-8 h-8" tooltip="Save">
              <LuSave size={22} onClick={() => setEdit(false)} />
            </TTButton>

            <TTButton className="w-8 h-8" tooltip="Cancel">
              <IoCloseSharp size={22} onClick={() => setEdit(false)} />
            </TTButton>
          </>
        )}
      </div>

      <div className={cn("column w-full gap-4 pb-6", { "px-8": !isMobile, "px-4": isMobile })}>
        <div className="row w-full h-[110px] items-end gap-4 mt-[-55px]">
          <ClubLogo club={club} className="rounded-2xl h-[110px]" />
          <div className="row h-[110px] w-full flex-1 pt-[55px] items-center">
            <h2 className="subtitle">{club?.title}</h2>
          </div>
        </div>

        <div className="w-full h-[50vh]">
          {!edit && !!club && <ClubInfoView club={club} />}
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/club/$clubId')({
  component: ClubPage,
})

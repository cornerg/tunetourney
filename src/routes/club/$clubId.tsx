import { createFileRoute } from '@tanstack/react-router'
import {useClubs, useClubUsers} from "#/api/clubs.ts";
import React from "react";
import "@/styles/cornering.css";
import {GoPencil} from "react-icons/go";
import {FiTrash2} from "react-icons/fi";
import {RiLogoutBoxRLine} from "react-icons/ri";
import TTButton from "#/components/primitives/TTButton.tsx";
import ClubLogo from "#/components/ClubLogo.tsx";
import {IoCloseSharp} from "react-icons/io5";
import {LuSave} from "react-icons/lu";
import ClubInfoView from "#/components/sections/ClubInfoView.tsx";

function ClubPage() {
  const [edit, setEdit] = React.useState<boolean>(false);
  console.log("Club Page");
  const { clubId } = Route.useParams();
  const { data: clubs } = useClubs();
  const { data: members } = useClubUsers(clubId);
  console.log(`Members of club ${clubId}: `, members);
  const club = React.useMemo(() => {
    return clubs?.find((cl) => cl.id === clubId);
  }, [clubId, clubs]);

  return (
    <div className="column w-full h-[100vh]">
      <div className="column w-full h-64 bg-cover bg-center rounded-tl-3xl" style={{ backgroundImage: `url(${club?.banner})`, zIndex: 2 }}>
        <div className="row w-full h-10 justify-end">
          <div className="invert-3 h-10 w-16" />
          <div className="row h-10 w-max pb-2 pl-2 justify-end gap-2 bg-background rounded-bl-xl">
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
        </div>

        <div className="row w-full h-10 justify-end">
          <div className="invert-3 h-10 w-16" />
        </div>

        <div className="row w-full h-full flex-1 items-end gap-4 mb-[-55px] pl-4">
          <ClubLogo club={club} className="rounded-2xl h-[110px]" />
          <div className="row h-[110px] w-full flex-1 pt-[55px] items-center">
            <h2 className="subtitle">{club?.title}</h2>
          </div>
        </div>
      </div>

      <div className="w-full h-[50vh] pt-16 px-4 pb-6 bg-surface rounded-b-3xl border-x border-b border-gray-300">
        {!edit && !!club && <ClubInfoView club={club} />}
      </div>
    </div>
  )
}

export const Route = createFileRoute('/club/$clubId')({
  component: ClubPage,
})

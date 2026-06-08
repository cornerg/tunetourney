import { createFileRoute } from '@tanstack/react-router'
import React from "react";
import {useTournaments} from "#/api/tournaments.ts";
import TTButton from "#/components/primitives/TTButton.tsx";
import {GoPencil} from "react-icons/go";
import {FiTrash2} from "react-icons/fi";
import {RiLogoutBoxRLine} from "react-icons/ri";
import {LuSave} from "react-icons/lu";
import {IoCloseSharp} from "react-icons/io5";
import {cn} from "#/utils/utils.ts";
import {useBreakpoints} from "#/hooks/utils.ts";
import TournamentRounds from "#/components/sections/TournamentRounds.tsx";

function PageTournament() {
  const [edit, setEdit] = React.useState<boolean>(false);

  const { isMobile } = useBreakpoints();
  const { tournamentId } = Route.useParams();
  const { data: tournaments } = useTournaments();

  const tournament = React.useMemo(() => {
    return tournaments?.find((tourney) => tourney.id === tournamentId);
  }, [tournaments, tournamentId]);

  return (
    <div className="column w-full h-max gap-4">
      <div className="column w-full h-max p-2 rounded-3xl rounded-tr-xl overflow-hidden bg-surface border border-gray-400">
        <div className={cn("row w-full h-max justify-between gap-4", { "pl-2": !isMobile })}>
          <div className="row w-full flex-1 items-center">
            <h2 className="subtitle">{tournament?.title}</h2>
          </div>

          <div className="row w-max justify-end gap-2">
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

        <div className="w-full h-[50vh]">
          {!edit && !!tournament && <p>Details</p>}
        </div>
      </div>

      {!!tournament && (
        <TournamentRounds tournamentId={tournamentId} />
      )}
    </div>
  )
}

export const Route = createFileRoute('/tournament/$tournamentId')({
  component: PageTournament,
})

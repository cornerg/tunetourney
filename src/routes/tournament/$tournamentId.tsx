import { createFileRoute } from '@tanstack/react-router'
import React from "react";
import {useTournaments, useTournamentScores} from "#/api/tournaments.ts";
import TTButton from "#/components/primitives/TTButton.tsx";
import {GoPencil} from "react-icons/go";
import {FiTrash2} from "react-icons/fi";
import {RiLogoutBoxRLine} from "react-icons/ri";
import {LuSave} from "react-icons/lu";
import {IoCloseSharp} from "react-icons/io5";
import {cn} from "#/utils/utils.ts";
import {useBreakpoints} from "#/hooks/utils.ts";
import TournamentRounds from "#/components/sections/TournamentRounds.tsx";
import TTTooltip from "#/components/primitives/TTTooltip.tsx";
import ProfilePhoto from "#/components/ProfilePhoto.tsx";

function PageTournament() {
  const [edit, setEdit] = React.useState<boolean>(false);

  const { isMobile } = useBreakpoints();
  const { tournamentId } = Route.useParams();
  const { data: tournaments } = useTournaments();
  const { data: scores } = useTournamentScores(tournamentId);

  const tournament = React.useMemo(() => {
    return tournaments?.find((tourney) => tourney.id === tournamentId);
  }, [tournaments, tournamentId]);

  const sortedScores = React.useMemo(() => {
    if (!scores) return [];
    return [...scores].sort((a, b) => b.score - a.score);
  }, [scores]);

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
                <TTButton buttonStyle="outline" className="w-8 h-8" tooltip="Edit club" onClick={() => setEdit(true)}>
                  <GoPencil size={22} />
                </TTButton>

                <TTButton buttonStyle="outline" className="w-8 h-8" tooltip="Delete club">
                  <FiTrash2 size={22} />
                </TTButton>

                <TTButton buttonStyle="outline" className="w-8 h-8" tooltip="Delete club">
                  <RiLogoutBoxRLine size={22} />
                </TTButton>
              </>
            )}

            {edit && (
              <>
                <TTButton buttonStyle="outline" className="w-8 h-8" tooltip="Save">
                  <LuSave size={22} onClick={() => setEdit(false)} />
                </TTButton>

                <TTButton buttonStyle="outline" className="w-8 h-8" tooltip="Cancel">
                  <IoCloseSharp size={22} onClick={() => setEdit(false)} />
                </TTButton>
              </>
            )}
          </div>
        </div>

        <div className={cn("column w-full gap-4", { "pl-2": !isMobile })}>
          <h3 className="heading">Scores</h3>
          <div className="row w-full gap-2 flex-wrap">
            {sortedScores.map((user) => {
              return (
                <div key={user.id} className="column items-center gap-0">
                  <TTTooltip label={user?.name ?? "Unnamed User"} delay={30}>
                    <ProfilePhoto avatarUrl={user.avatar} name={user.name} size={48} fontSize={18} className="rounded-full bg-surface border-1" />
                  </TTTooltip>
                  <p className="text-dark text-lg font-bold text-center w-full flex-1">{user.score}</p>
                </div>
              )
            })}
          </div>
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

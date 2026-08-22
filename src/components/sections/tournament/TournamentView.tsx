import React from "react";
import TTButton from "#/components/primitives/TTButton";
import TournamentMemberList from "#/components/sections/tournament/TournamentMemberList.tsx";
import TournamentRounds from "#/components/sections/TournamentRounds.tsx";
import { useTournamentRounds } from "#/hooks/roundHooks.ts";
import { useBreakpoints } from "#/hooks/utils.ts";
import type { Tournament } from "#/models/supabaseTables.ts";
import { cn, getFormattedDate } from "#/utils/utils.ts";
import { GoPencil } from "react-icons/go";
import { useTournamentOwners } from "#/api/TournamentUsers/fetchTournamentOwners.ts";
import { useCurrentUserId } from "#/api/auth/currentUserId.ts";
import ButtonLeaveTournament from "#/components/buttons/ButtonLeaveTournament.tsx";
import ButtonDeleteTournament from "#/components/buttons/ButtonDeleteTournament.tsx";

type Props = {
  tournament: Tournament;
  setEdit: (newState: boolean) => void;
} & React.HTMLAttributes<HTMLDivElement>;
export default function TournamentView({ tournament, setEdit, className, ...props }: Props) {
  const { isMobile } = useBreakpoints();
  const { rounds } = useTournamentRounds(tournament.id);
  const { data: owners } = useTournamentOwners(tournament.id);
  const currentUserId = useCurrentUserId();

  const isOwner = React.useMemo(() => {
    return !!currentUserId && owners?.find(owner => owner.id === currentUserId);
  }, [currentUserId, owners])

  return (
    <div className={cn("column w-full h-max gap-4 pb-2", className)} {...props}>
      <div className="column w-full h-max p-2 pb-4 gap-4 rounded-3xl rounded-tr-xl overflow-hidden bg-surface border border-gray-400">
        <div
          className={cn("row w-full h-max justify-between gap-4", {
            "pl-2": !isMobile,
          })}>
          <div className="column w-full flex-1 gap-0">
            <h2 className="subtitle">{tournament?.title}</h2>
            <p className="text-sm text-body">
              Started {getFormattedDate(tournament.created_at)}
            </p>
          </div>

          <div className="row w-max justify-end gap-2">
            <TTButton
              buttonStyle="outline"
              className="w-8 h-8"
              tooltip="Edit club"
              onClick={() => setEdit(true)}>
              <GoPencil size={22} />
            </TTButton>

            {isOwner && (
              <ButtonDeleteTournament tournament={tournament} />
            )}

            <ButtonLeaveTournament tournament={tournament} />
          </div>
        </div>

        <TournamentMemberList tournament={tournament} />
      </div>

      {!!tournament && <TournamentRounds tournament={tournament} rounds={rounds} />}
    </div>
  );
}
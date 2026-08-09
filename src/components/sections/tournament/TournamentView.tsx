import React from "react";
import TTButton from "#/components/primitives/TTButton";
import TournamentScores from "#/components/sections/tournament/TournamentScores.tsx";
import TournamentRounds from "#/components/sections/TournamentRounds.tsx";
import { useTournamentRounds } from "#/hooks/roundHooks.ts";
import { useBreakpoints } from "#/hooks/utils.ts";
import type { Tournament } from "#/models/supabaseTables.ts";
import { cn } from "#/utils/utils.ts";
import { FiTrash2 } from "react-icons/fi";
import { GoPencil } from "react-icons/go";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { ROUND_STATUS } from "#/models/RoundStatus.ts";

type Props = {
  tournament: Tournament;
  setEdit: (newState: boolean) => void;
} & React.HTMLAttributes<HTMLDivElement>;
export default function TournamentView({ tournament, setEdit, className, ...props }: Props) {
  const { isMobile } = useBreakpoints();
  const { rounds } = useTournamentRounds(tournament.id);

  const hasFinishedRounds = React.useMemo(() => {
    return !!rounds.find((round) => round.status >= ROUND_STATUS.closed);
  }, [rounds]);

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
              {new Date(tournament.created_at).toLocaleDateString("en-US")}
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

            <TTButton
              buttonStyle="outline"
              className="w-8 h-8"
              tooltip="Delete club">
              <FiTrash2 size={22} />
            </TTButton>

            <TTButton
              buttonStyle="outline"
              className="w-8 h-8"
              tooltip="Delete club">
              <RiLogoutBoxRLine size={22} />
            </TTButton>
          </div>
        </div>

        {hasFinishedRounds && <TournamentScores tournamentId={tournament.id} />}
      </div>

      {!!tournament && <TournamentRounds tournament={tournament} rounds={rounds} />}
    </div>
  );
}
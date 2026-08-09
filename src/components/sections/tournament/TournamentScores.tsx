import React from "react";
import { useTournamentScores } from "#/api/tournaments.ts";
import TTTooltip from "#/components/primitives/TTTooltip.tsx";
import ProfilePhoto from "#/components/ProfilePhoto.tsx";
import { useBreakpoints } from "#/hooks/utils.ts";
import { cn } from "#/utils/utils.ts";

type Props = {
  tournamentId: string;
}
export default function TournamentScores({ tournamentId }: Props) {
  const { isMobile } = useBreakpoints();
  const { data: scores } = useTournamentScores(tournamentId);

  const sortedScores = React.useMemo(() => {
    if (!scores) return [];
    return [...scores].sort((a, b) => b.score - a.score);
  }, [scores]);
  
  return (
    <div className={cn("column w-full gap-4", { "pl-2": !isMobile })}>
      <h3 className="heading">Scores</h3>
      <div className="row w-full gap-2 flex-wrap">
        {sortedScores.map(user => {
          return (
            <div key={user.id} className="column items-center gap-0">
              <TTTooltip label={user?.name ?? "Unnamed User"} delay={30}>
                <ProfilePhoto
                  avatarUrl={user.avatar}
                  name={user.name}
                  size={48}
                  fontSize={18}
                  className="rounded-full bg-surface border"
                />
              </TTTooltip>
              <p className="text-dark text-lg font-bold text-center w-full flex-1">
                {user.score}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
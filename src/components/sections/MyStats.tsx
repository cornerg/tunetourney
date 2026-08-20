import React from "react";
import { useMyPoints } from "#/api/stats.ts";
import { cn } from "#/utils/utils.ts";
import { useTournaments } from "#/api/Tournaments/fetchTournaments.ts";
import { useRounds } from "#/api/Rounds/fetchRounds.ts";

export default function MyStats({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const { data: totalScore } = useMyPoints();
  const { data: tournaments } = useTournaments();
  const { data: rounds } = useRounds();

  return (
    <div className={cn("row w-full gap-4", className)}>
      <div className="column w-max min-w-40 gap-0">
        <h4 className="text-md text-dark font-bold leading-none">
          Total Score:
        </h4>
        <p className="text-4xl text-primary leading-none font-mono">
          {totalScore}
        </p>
      </div>

      <div className="column w-max min-w-40 gap-0">
        <h4 className="text-md text-dark font-bold leading-none">
          Rounds Entered:
        </h4>
        <p className="text-4xl text-primary leading-none font-mono">
          {tournaments?.length ?? 0}
        </p>
      </div>

      <div className="column w-max min-w-40 gap-0">
        <h4 className="text-md text-dark font-bold leading-none">
          Tourneys Entered:
        </h4>
        <p className="text-4xl text-primary leading-none font-mono">
          {rounds?.length ?? 0}
        </p>
      </div>
    </div>
  );
}

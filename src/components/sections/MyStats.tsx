import React from "react";
import { useMyPoints } from "#/api/stats.ts";
import { cn } from "#/utils/utils.ts";

export default function MyStats({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const { data: totalScore } = useMyPoints();

  return (
    <div className={cn("row w-full gap-4", className)}>
      <div className="column w-max min-w-40 gap-0">
        <h4 className="text-md text-dark font-bold leading-none">
          Total Score:
        </h4>
        <p className="text-4xl text-primary leading-none">{totalScore}</p>
      </div>

      <div className="column w-max min-w-40 gap-0">
        <h4 className="text-md text-dark font-bold leading-none">
          Rounds Entered:
        </h4>
        <p className="text-4xl text-primary leading-none">3</p>
      </div>

      <div className="column w-max min-w-40 gap-0">
        <h4 className="text-md text-dark font-bold leading-none">
          Tourneys Completed:
        </h4>
        <p className="text-4xl text-primary leading-none">1</p>
      </div>
    </div>
  );
}

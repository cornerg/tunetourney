import React from "react";
import { getRoundStatus } from "#/models/RoundStatus.ts";
import { cn } from "#/utils/utils.ts";

type Props = {
  statusKey: number | null | undefined;
} & React.HTMLProps<HTMLDivElement>
export default function BadgeRoundStatus({ statusKey, className }: Props) {
  const status = React.useMemo(() => {
    return getRoundStatus(statusKey);
  }, [statusKey]);

  return (
    <div
      className={cn("w-max h-max py-0.5 px-2 rounded-full text-sm", className)}
      style={{ backgroundColor: `${status.color}40` }}>
      <p className="font-bold" style={{ color: `${status.color}` }}>
        {status.label}
      </p>
    </div>
  );
}

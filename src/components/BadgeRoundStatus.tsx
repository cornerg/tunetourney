import React from "react";
import { getRoundStatus } from "#/models/RoundStatus.ts";

type Props = {
  statusKey: number | null | undefined;
} & React.HTMLProps<HTMLDivElement>
export default function BadgeRoundStatus({ statusKey }: Props) {
  const status = React.useMemo(() => {
    return getRoundStatus(statusKey);
  }, [statusKey]);

  return (
    <div
      className="w-max h-max py-0.5 px-2 rounded-full"
      style={{ backgroundColor: `${status.color}40` }}>
      <p className="font-bold text-sm" style={{ color: `${status.color}` }}>
        {status.label}
      </p>
    </div>
  );
}

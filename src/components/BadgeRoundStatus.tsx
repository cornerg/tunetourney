import React from "react";
import { getRoundStatus } from "#/models/RoundStatus.ts";

interface Props extends React.HTMLProps<HTMLDivElement> {
  statusKey: number | null | undefined;
}
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

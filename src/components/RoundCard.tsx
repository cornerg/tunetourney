import React from "react";
import { Link, type LinkProps } from "@tanstack/react-router";
import BadgeRoundStatus from "#/components/BadgeRoundStatus.tsx";
import { useBreakpoints } from "#/hooks/utils.ts";
import type { Round } from "#/models/supabaseTables.ts";
import { cn } from "#/utils/utils.ts";

type ElementProps = LinkProps & React.HTMLAttributes<HTMLAnchorElement>;

interface Props extends ElementProps {
  round: Round;
}
export default function RoundCard({
  round,
  className,
  style,
  ...props
}: Props) {
  const { isMobile } = useBreakpoints();

  return (
    <Link
      to="/round/$roundId"
      params={{ roundId: round.id }}
      className={cn(
        "column w-full max-w-[704px] min-h-24 p-2 gap-1 bg-surface rounded-3xl shadow border border-gray-200 hover:border-primary hover:shadow-lg cursor-pointer",
        className,
        {
          "pl-4 pr-3": !isMobile,
        },
      )}
      style={{
        transition: "border 150ms ease, box-shadow 150ms ease",
        ...style,
      }}
      {...props}>
      <div className="row w-full justify-between">
        <h3 className="heading">{round.title}</h3>
        <BadgeRoundStatus statusKey={round.status} />
      </div>

      <hr className="w-full text-gray-300" />

      <p className="text-sm">{round.description}</p>
    </Link>
  );
}

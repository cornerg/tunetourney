import {cn} from "#/utils/utils.ts";
import {Link, type LinkProps} from "@tanstack/react-router";
import React from "react";
import type {Tournament} from "#/models/supabaseTables.ts";

type ElementProps = LinkProps & React.HTMLAttributes<HTMLAnchorElement>;

interface Props extends ElementProps {
  tournament: Tournament;
}
export default function TournamentCard({ tournament, className, style, ...props }: Props) {
  return (
    <Link
      to="/tournament/$tournamentId"
      params={{ tournamentId: tournament.id }}
      className={cn("row w-full max-w-[704px] min-h-32 p-2 gap-4 bg-surface rounded-3xl shadow border border-transparent hover:border-primary hover:shadow-lg cursor-pointer", className)}
      style={{ transition: "border 150ms ease, box-shadow 150ms ease", ...style }}
      {...props}
    >
      <div className="column h-full w-full flex-1 gap-1">
        <div className="row w-full justify-between gap-4">
          <div className="column w-full flex-1 gap-0 px-2">
            <h3 className="heading">{tournament.title}</h3>
            <p className="text-xs">8 members</p>
          </div>
        </div>

        <hr className="text-gray-300 mb-1" />

        <div className="column w-full flex-1 gap-0 px-2">
          <p className="text-sm text-gray-800 pr-2">{tournament.created_at}</p>
        </div>
      </div>
    </Link>
  )
}
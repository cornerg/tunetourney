import {cn} from "#/utils/utils.ts";
import {Link, type LinkProps} from "@tanstack/react-router";
import React from "react";
import type {Tournament} from "#/models/supabaseTables.ts";
import {useTournamentUsers} from "#/api/users.ts";

type ElementProps = LinkProps & React.HTMLAttributes<HTMLAnchorElement>;

interface Props extends ElementProps {
  tournament: Tournament;
}
export default function TournamentCard({ tournament, className, style, ...props }: Props) {
  const { data: members } = useTournamentUsers(tournament.id);

  const createdAt = React.useMemo(() => {
    return new Date(tournament.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }, [tournament.created_at]);

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
            <div className="row w-full gap-4 justify-between items-end">
              <p className="text-xs text-dark">{members?.length ?? 0} members</p>
              <p className="text-xs text-dark text-end">{createdAt}</p>
            </div>
          </div>
        </div>

        <hr className="text-gray-300 mb-1" />

        <div className="column w-full flex-1 gap-0 px-2">

        </div>
      </div>
    </Link>
  )
}
import React from "react";
import { Link, type LinkProps } from "@tanstack/react-router";
import { useClubUsers } from "#/api/clubs.ts";
import ClubLogo from "#/components/ClubLogo.tsx";
import type { Club } from "#/models/supabaseTables.ts";
import { cn } from "#/utils/utils.ts";

type ElementProps = LinkProps & React.HTMLAttributes<HTMLAnchorElement>;

interface Props extends ElementProps {
  club: Club;
}
export default function ClubCard({ club, className, style, ...props }: Props) {
  const { data: members } = useClubUsers(club.id);

  return (
    <Link
      to="/club/$clubId"
      params={{ clubId: club.id }}
      className={cn(
        "row w-full max-w-[704px] min-h-32 p-2 gap-4 bg-surface rounded-3xl shadow border border-transparent hover:border-primary hover:shadow-lg cursor-pointer",
        className,
      )}
      style={{
        transition: "border 150ms ease, box-shadow 150ms ease",
        ...style,
      }}
      {...props}>
      <ClubLogo
        club={club}
        className="rounded-2xl h-[110px]"
        placeholderClassName="title"
      />

      <div className="column h-full w-full flex-1 gap-1">
        <div className="row w-full justify-between gap-4">
          <div className="column w-full flex-1 gap-0">
            <h3 className="heading">{club.title}</h3>
            <p className="text-xs">
              {members?.length ?? 0} member{members?.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        <hr className="text-gray-300 mb-1" />

        <p className="text-sm text-gray-800 pr-2">{club.description}</p>
      </div>
    </Link>
  );
}

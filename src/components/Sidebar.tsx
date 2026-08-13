import React from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useClubs } from "#/api/clubs.ts";
import { useActiveTournaments } from "#/api/tournaments.ts";
import { HEADER_HEIGHT } from "#/components/sections/header/Header.tsx";
import { rootPages } from "#/models/routing.ts";
import { cn } from "#/utils/utils.ts";

export default function Sidebar() {
  const location = useRouterState({ select: s => s.location });
  const pages = React.useMemo(
    () => rootPages.filter(page => page.inSidebar),
    [],
  );

  const { data: clubs } = useClubs();
  const sortedClubs = React.useMemo(() => {
    if (!clubs || (clubs?.length ?? 0) <= 0) return [];
    return [...clubs].sort((a, b) => {
      if (a.title === b.title) return 0;
      if (a.title > b.title) return 1;
      return -1;
    });
  }, [clubs]);
  const hasClubs = React.useMemo(
    () => (sortedClubs?.length ?? 0) > 0,
    [sortedClubs],
  );

  const { data: tournaments } = useActiveTournaments();
  const sortedTournaments = React.useMemo(() => {
    if (!tournaments || (tournaments?.length ?? 0) <= 0) return [];
    return [...tournaments].sort((a, b) => {
      const createdA = new Date(a.created_at).getTime();
      const createdB = new Date(b.created_at).getTime();
      return createdA - createdB;
    });
  }, [tournaments]);
  const hasTournaments = React.useMemo(
    () => (sortedTournaments?.length ?? 0) > 0,
    [sortedTournaments],
  );

  return (
    <div
      className="fixed top-[3.25rem] left-0 column w-48 bg-surface p-2 shadow z-[9] border-t border-t-gray-200"
      style={{ height: `calc(100vh - ${HEADER_HEIGHT}px)` }}>
      <div className="column gap-2">
        {pages.map(page => {
          const Icon = page.icon;
          const pathExp = new RegExp(/(?<=^)\/[^/]*?(?=\/|$)/, "g");
          const isActive = page.relativePaths.includes(
            location.pathname.match(pathExp)?.[0] ?? "-",
          );

          return (
            <div
              key={page.path}
              className={cn("column w-full h-max gap-0 rounded-lg", {
                shadow: isActive,
              })}>
              <Link
                key={page.path}
                to={page.path}
                style={{ transition: "color 150ms ease" }}
                className={cn(
                  "row w-full h-9 px-2 py-1 justify-between items-center rounded-lg hover:text-primary",
                  {
                    "text-primary font-bold": isActive,
                  },
                )}>
                <h4 className="text-sm">{page.title}</h4>
                <Icon size={20} />
              </Link>

              {page.path === "/clubs" && hasClubs && (
                <div className="column w-full h-max pl-2 pb-1.5 gap-0">
                  {sortedClubs.map(club => {
                    const isSubActive =
                      isActive &&
                      page.relativePaths.some(
                        path => location.pathname === `${path}/${club.id}`,
                      );

                    return (
                      <Link
                        key={club.id}
                        to="/club/$clubId"
                        params={{ clubId: club.id }}
                        className={cn(
                          "row w-full h-6 px-2 py-0.5 justify-between items-center rounded-lg hover:text-primary",
                          {
                            "text-primary font-bold": isSubActive,
                          },
                        )}>
                        <p className="text-xs">{club.title}</p>
                      </Link>
                    );
                  })}
                </div>
              )}

              {page.path === "/tournaments" && hasTournaments && (
                <div className="column w-full h-max pl-2 pb-1.5 gap-0">
                  {sortedTournaments.map(tourney => {
                    const isSubActive =
                      isActive &&
                      page.relativePaths.some(
                        path => location.pathname === `${path}/${tourney.id}`,
                      );

                    return (
                      <Link
                        key={tourney.id}
                        to="/tournament/$tournamentId"
                        params={{ tournamentId: tourney.id }}
                        className={cn(
                          "row w-full h-6 px-2 py-0.5 justify-between items-center rounded-lg hover:text-primary",
                          {
                            "text-primary font-bold": isSubActive,
                          },
                        )}>
                        <p className="text-xs">{tourney.title}</p>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

import {Link, useRouterState} from "@tanstack/react-router";
import {cn} from "#/utils/utils.ts";
import {HEADER_HEIGHT} from "#/components/Header.tsx";
import {rootPages} from "#/models/routing.ts";
import React from "react";

export default function Sidebar() {
  const location = useRouterState({ select: (s) => s.location });

  const pages = React.useMemo(() => rootPages.filter((page) => page.inSidebar), []);

  return (
    <div className={`fixed top-[3.25rem] left-0 column w-48 bg-surface p-2 shadow z-[9] border-t border-t-gray-200`} style={{ height: `calc(100vh - ${HEADER_HEIGHT}px)` }}>
      <div className="column gap-2">
        {pages.map((page) => {
          const Icon = page.icon;
          const pathExp = new RegExp(/(?<=^)\/[^\/]*?(?=\/|$)/, "g");
          const isActive = page.relativePaths.includes(location.pathname.match(pathExp)?.[0] ?? "-");
          return (
            <Link
              key={page.path}
              to={page.path}
              style={{ transition: "color 150ms ease" }}
              className={cn("row w-full h-9 px-2 py-1 justify-between items-center rounded-lg hover:text-primary",
                {
                  "shadow text-primary font-bold": isActive,
                },
              )}
            >
              <h3>{page.title}</h3>
              <Icon size={20} />
            </Link>
          )
        })}
      </div>
    </div>
  )
}
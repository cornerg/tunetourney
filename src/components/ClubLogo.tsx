import React from "react";
import {cn, getInitials} from "#/utils/utils.ts";
import type {Club} from "#/models/supabaseTables.ts";
import {getGradient} from "#/hooks/utils.ts";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  club: Club | null | undefined;
  placeholderClassName?: string;
}
export default function ClubLogo({ club, className, placeholderClassName, style, ...props }: Props) {
  const gradient = React.useMemo(() => {
    const seed = parseInt(new Date(club?.created_at ?? Date.now()).getTime().toString().slice(-1));
    return getGradient(seed);
  }, [club]);

  return (
    <div
      className={cn("column w-auto justify-center items-center aspect-square border border-gray-400 overflow-hidden bg-contain bg-center", className)}
      style={club?.logo ? { backgroundImage: `url(${club.logo})` } : { background: `linear-gradient(20deg, ${gradient.start}, ${gradient.end})` }}
      {...props}
    >
      {!club?.logo && <p className={cn("text-white text-center", placeholderClassName)}>{getInitials(club?.title)}</p>}
    </div>
  )
}
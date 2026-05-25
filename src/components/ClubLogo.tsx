import React from "react";
import {cn, getInitials} from "#/utils/utils.ts";
import type {Club} from "#/models/supabaseTables.ts";

interface Gradient {
  start: string;
  end: string;
}
const gradients: Gradient[] = [
  { start: "#1C75BC", end: "#33C8B4" },
  { start: "#ffa070", end: "#fffa70" },
  { start: "#ffaaf2", end: "#a78eff" },
  { start: "#e5ea5b", end: "#6ad87c" },
];

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  club: Club | null | undefined;
}
export default function ClubLogo({ club, className, style, ...props }: Props) {
  const gradient = React.useMemo(() => {
    const seed = parseInt(new Date(club?.created_at ?? Date.now()).getTime().toString().slice(-1));
    return gradients[seed % gradients.length];
  }, [club]);

  return (
    <div
      className={cn("column w-auto justify-center items-center aspect-square border border-gray-300 overflow-hidden", className)}
      style={{ background: `linear-gradient(20deg, ${gradient.start}, ${gradient.end})` }}
      {...props}
    >
      {club?.logo && <img src={club?.logo} alt="Club logo" className="w-full h-full" />}
      {!club?.logo && <p className="title text-white text-center">{getInitials(club?.title)}</p>}
    </div>
  )
}
import React from "react";
import type {Club} from "#/models/supabaseTables.ts";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  club?: Club | null | undefined;
}
export default function ClubInfoView({ club }: Props) {
  return (
    <div className="column w-full">
      {(club?.description?.trim()?.length ?? 0) > 0 && (
        <p className="text-dark">{club?.description ?? ""}</p>
      )}
    </div>
  )
}
import React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useClubs } from "#/api/clubs.ts";
import ClubCard from "#/components/ClubCard.tsx";
import TTButton from "#/components/primitives/TTButton.tsx";

function Clubs() {
  const { data: clubs } = useClubs();
  const navigate = useNavigate();

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

  return (
    <div className="column w-full gap-4">
      <div className="column w-full gap-0">
        <div className="row w-full justify-between items-center gap-4">
          <h1 className="title text-primary">Clubs</h1>

          <TTButton
            className="px-2 min-h-10"
            buttonStyle="primary"
            tooltip="Start a new club"
            onClick={() =>
              void navigate({ to: "/club/$clubId", params: { clubId: "new" } })
            }>
            New Club
          </TTButton>
        </div>
        <p className="text-black text-base">
          Clubs are your first stop for experiencing Tune Tourney! Create a
          club, invite your friends, colleagues, or peers, and create
          tournaments.
          <br />
          You can customize your club as much or as little as you like to
          welcome members with a unique vibe all your own.
        </p>
      </div>

      <hr className="text-gray-300" />

      <div className="w-full row flex-wrap gap-4">
        {hasClubs &&
          sortedClubs?.map(club => {
            return <ClubCard key={club.id} club={club} />;
          })}
      </div>
    </div>
  );
}

export const Route = createFileRoute("/clubs")({
  component: Clubs,
});

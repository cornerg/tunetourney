import { createFileRoute } from '@tanstack/react-router'
import React from "react";
import ClubCard from "#/components/ClubCard.tsx";
import {useClubs} from "#/api/clubs.ts";

function Clubs() {
  const { data: clubs } = useClubs();

  const sortedClubs = React.useMemo(() => {
    if (!clubs || (clubs?.length ?? 0) <= 0) return [];
    return [...clubs].sort((a, b) => {
      if (a.title === b.title) return 0;
      if (a.title > b.title) return 1;
      return -1;
    })
  }, [clubs]);

  const hasClubs = React.useMemo(() => (sortedClubs?.length ?? 0) > 0, [sortedClubs]);

  return (
    <div className="column w-full gap-4">
      <div className="column w-full gap-0">
        <h1 className="title text-primary">Clubs</h1>
        <p className="text-black text-base">
          Clubs are your first stop for experiencing Tune Tourney! Create a club, invite your friends, colleagues, or peers, and create tournaments through a club.
          <br/>
          You can customize your club as much or as little as you like to welcome members with a unique vibe all your own.
        </p>
      </div>

      <hr className="text-gray-300" />

      <div className="w-full row flex-wrap gap-4">
        {hasClubs && sortedClubs?.map((club) => {
          return <ClubCard key={club.id} club={club} />;
        })}
      </div>
    </div>
  )
}

export const Route = createFileRoute('/clubs')({
  component: Clubs,
})
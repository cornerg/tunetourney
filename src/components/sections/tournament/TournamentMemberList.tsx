import React, { useState } from "react";
import { useTournamentScores } from "#/api/Tournaments/fetchTournamentScores.ts";
import { useBreakpoints } from "#/hooks/utils.ts";
import { cn } from "#/utils/utils.ts";
import TournamentMemberAvatar from "#/components/sections/tournament/TournamentMemberAvatar.tsx";
import type { Tournament } from "#/models/supabaseTables.ts";
import { useTournamentOwners } from "#/api/TournamentUsers/fetchTournamentOwners.ts";
import { useCurrentUserId } from "#/api/auth/currentUserId.ts";
import { useTournamentUsers } from "#/api/TournamentUsers/fetchTournamentUsers.ts";
import TTTooltip from "#/components/primitives/TTTooltip.tsx";
import { RxPlus } from "react-icons/rx";
import TTDialog from "#/components/primitives/TTDialog.tsx";
import AddTournamentParticipants from "#/components/sections/dialogs/AddTournamentParticipants.tsx";

type Props = {
  tournament: Tournament;
}
export default function TournamentMemberList({ tournament }: Props) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);

  const { isMobile } = useBreakpoints();
  const currentUserId = useCurrentUserId();
  const { data: members } = useTournamentUsers(tournament.id);
  const { data: scores } = useTournamentScores(tournament.id);
  const { data: owners } = useTournamentOwners(tournament.id);

  const isCurrentUserOwner = React.useMemo(() => {
    return !!owners?.find(owner => owner.id === currentUserId);
  }, [currentUserId, owners]);

  const getScore = React.useCallback((userId: string) => {
    if (!scores) return 0;
    return scores.find(score => score.id === userId)?.score ?? 0;
  }, [scores]);

  const sortedMembers = React.useMemo(() => {
    if (!members?.length) return [];
    if (scores?.length) {
      return [...members].sort((a, b) => {
        const valA = getScore(a.id) ?? 0;
        const valB = getScore(b.id) ?? 0;
        return valB - valA;
      });
    }
    const organizers = members.filter((user) => !!owners?.find(owner => owner.id === user.id));
    const nonOrganizers = members.filter((user) => !owners?.find(owner => owner.id === user.id));
    return [...organizers, ...nonOrganizers];
  }, [getScore, members, owners, scores?.length])

  const showScores = React.useMemo(() => {
    return !!scores?.find(score => !!score.score);
  }, [scores]);
  
  return (
    <div className={cn("column w-full gap-4", { "pl-2": !isMobile })}>
      <h3 className="heading">Members</h3>
      <div className="row w-full gap-2 flex-wrap">
        {sortedMembers.map(user => {
          const score = getScore(user.id);
          const isOwner = !!owners?.find(owner => owner.id === user.id);
          return (
            <div key={user.id} className="column items-center gap-0">
              <TournamentMemberAvatar
                tournament={tournament}
                user={user}
                isOwner={isOwner}
                isCurrentUserOwner={isCurrentUserOwner}
              />
              {showScores && (
                <p className="text-dark text-lg font-bold text-center w-full flex-1">
                  {score}
                </p>
              )}
            </div>
          );
        })}

        {isCurrentUserOwner && (
          <TTTooltip label="Add a participant" delay={30}>
            <div
              className="group row w-12 h-12 justify-center items-center rounded-full bg-surface border border-dashed border-gray-300 hover:bg-background hover:border-gray-500 transition-colors cursor-pointer"
              onClick={() => setIsAddDialogOpen(true)}>
              <RxPlus
                size={22}
                className="text-gray-300 group-hover:text-gray-500 w-5.5 h-5.5 transition-colors"
              />
            </div>
          </TTTooltip>
        )}
      </div>

      <TTDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        title={`Add Users to ${tournament.title}`}
        className="gap-2"
        width={512}>
        <AddTournamentParticipants
          tournament={tournament}
          closeDialog={() => setIsAddDialogOpen(false)}
        />
      </TTDialog>
    </div>
  );
}
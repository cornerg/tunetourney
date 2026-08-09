import React from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useTournaments } from "#/api/tournaments.ts";
import TournamentEdit from "#/components/sections/tournament/TournamentEdit.tsx";
import TournamentView from "#/components/sections/tournament/TournamentView.tsx";
import { useTournamentRounds } from "#/hooks/roundHooks.ts";

function PageTournament() {
  const [edit, setEdit] = React.useState<boolean>(false);

  const { tournamentId } = Route.useParams();
  const { data: tournaments } = useTournaments();
  const { rounds } = useTournamentRounds(tournamentId);
  const handledRoute = React.useRef<string>("");

  React.useEffect(() => {
    if (handledRoute.current !== tournamentId) {
      handledRoute.current = tournamentId;
      if (tournamentId === "new") {
        setEdit(true);
      } else if (edit) {
        setEdit(false);
      }
    }
  }, [tournamentId, edit, handledRoute]);

  const tournament = React.useMemo(() => {
    return tournaments?.find(tourney => tourney.id === tournamentId);
  }, [tournaments, tournamentId]);

  return (
    <div className="column w-full h-max">
      {!edit && !!tournament && <TournamentView tournament={tournament} setEdit={setEdit} />}

      {edit && <TournamentEdit sourceTournament={tournament} existingRounds={rounds?.length ?? 0} setEdit={setEdit} />}
    </div>
  );
}

export const Route = createFileRoute("/tournament/$tournamentId/")({
  beforeLoad: context => {
    if ((context.params?.tournamentId?.length ?? 0) <= 0) {
      throw redirect({ to: "/tournament/$tournamentId", params: { tournamentId: "new" } });
    }
  },
  component: PageTournament,
});

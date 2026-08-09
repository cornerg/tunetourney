import React from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useRound } from "#/hooks/roundHooks.ts";
import RoundView from "#/components/sections/round/RoundView.tsx";
import RoundEdit from "#/components/sections/round/RoundEdit.tsx";
import { useTournament } from "#/hooks/tournamentHooks.ts";

function PageRound() {
  const [edit, setEdit] = React.useState<boolean>(false);

  const { tournamentId, roundId } = Route.useParams();
  const { round } = useRound(roundId);
  const { tournament } = useTournament(tournamentId)
  const handledRoute = React.useRef<string>("");

  React.useEffect(() => {
    if (handledRoute.current !== (roundId ?? "")) {
      handledRoute.current = roundId ?? "";
      if (roundId === "new") {
        setEdit(true);
      } else if (edit) {
        setEdit(false);
      }
    }
  }, [roundId, edit, handledRoute]);

  return (
    <div className="column w-full gap-4">
      {!!round && !edit && <RoundView round={round} tournament={tournament} setEdit={setEdit} />}
      {!!tournament && edit && <RoundEdit sourceRound={round} tournament={tournament} setEdit={setEdit} />}
    </div>
  );
}

export const Route = createFileRoute("/tournament/$tournamentId/round/$roundId")({
  beforeLoad: context => {
    if ((context.params?.roundId?.length ?? 0) <= 0) {
      throw redirect({
        to: "/tournament/$tournamentId/round/$roundId",
        params: { tournamentId: context.params.tournamentId, roundId: "new" },
      });
    }
  },
  component: PageRound,
});

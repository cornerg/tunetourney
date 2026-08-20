import React from "react";
import { useNavigate } from "@tanstack/react-router";
import TTButton from "#/components/primitives/TTButton.tsx";
import RoundCard from "#/components/sections/round/RoundCard.tsx";
import { ROUND_STATUS } from "#/models/RoundStatus.ts";
import type { Round, Tournament } from "#/models/supabaseTables.ts";
import { RxChevronRight } from "react-icons/rx";

type Props = {
  tournament: Tournament;
  rounds: Round[];
}
export default function TournamentRounds({ tournament, rounds }: Props) {
  const [expandUpcoming, setExpandUpcoming] = React.useState<boolean>(false);
  const [expandCompleted, setExpandCompleted] = React.useState<boolean>(false);

  const navigate = useNavigate();
  const pendingRounds = React.useMemo(() => {
    return rounds.filter(round => round.status === ROUND_STATUS.pending);
  }, [rounds]);
  const activeRound = React.useMemo(() => {
    return rounds.find(
      round =>
        round.status > ROUND_STATUS.pending &&
        round.status < ROUND_STATUS.closed,
    );
  }, [rounds]);
  const closedRounds = React.useMemo(() => {
    return rounds.filter(round => round.status === ROUND_STATUS.closed);
  }, [rounds]);

  const hasAllRounds = React.useMemo(() => {
    return rounds.length >= tournament.round_count
  }, [rounds, tournament]);

  return (
    <div className="column w-full h-max gap-2 rounded-3xl">
      <div className="row w-full h-max justify-between gap-4">
        <h3 className="heading">Rounds</h3>

        {!activeRound && !hasAllRounds && (
          <TTButton
            className="px-2 min-h-10"
            buttonStyle="primary"
            tooltip="Add a round"
            onClick={() =>
              void navigate({
                to: "/tournament/$tournamentId/round/$roundId",
                params: { tournamentId: tournament.id, roundId: "new" },
              })
            }>
            Start Next Round
          </TTButton>
        )}
      </div>

      {!!activeRound && (
        <div className="row w-full flex-wrap gap-4 pb-2">
          <RoundCard round={activeRound} tournament={tournament} />
        </div>
      )}

      {pendingRounds.length > 0 && (
        <div className="column w-full h-max gap-2 pb-2">
          <div
            className="row w-full items-center gap-1 cursor-pointer"
            onClick={() => setExpandUpcoming(!expandUpcoming)}>
            <h4 className="subheading">Upcoming Rounds</h4>
            <RxChevronRight
              size={22}
              className="text-dark"
              style={{
                transition: "transform 150ms ease",
                transform: expandUpcoming ? "rotate(90deg)" : "rotate(0)",
              }}
            />
            <hr className="w-full flex-1 text-gray-400" />
          </div>
          <div
            className="row w-full flex-wrap gap-4 overflow-hidden"
            style={{
              height: expandUpcoming ? "max-content" : 0,
              overflow: expandUpcoming ? "visible" : "hidden",
            }}>
            {pendingRounds.map(round => {
              return <RoundCard key={round.id} round={round} tournament={tournament} />;
            })}
          </div>
        </div>
      )}

      {closedRounds.length > 0 && (
        <div className="column w-full h-max gap-2 pb-2">
          <div
            className="row w-full items-center gap-1 cursor-pointer"
            onClick={() => setExpandCompleted(!expandCompleted)}>
            <h4 className="subheading">Completed Rounds</h4>
            <RxChevronRight
              size={22}
              className="text-dark"
              style={{
                transition: "transform 150ms ease",
                transform: expandCompleted ? "rotate(90deg)" : "rotate(0)",
              }}
            />
            <hr className="w-full flex-1 text-gray-400" />
          </div>
          <div
            className="row w-full flex-wrap gap-4 overflow-hidden"
            style={{
              height: expandCompleted ? "max-content" : 0,
              overflow: expandCompleted ? "visible" : "hidden",
            }}>
            {closedRounds.map(round => {
              return <RoundCard key={round.id} round={round} tournament={tournament} />;
            })}
          </div>
        </div>
      )}
    </div>
  );
}

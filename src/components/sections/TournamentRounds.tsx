import React from "react";
import RoundCard from "#/components/RoundCard.tsx";
import { useTournamentRounds } from "#/hooks/roundHooks.ts";
import { ROUND_STATUS } from "#/models/RoundStatus.ts";
import { RxChevronRight } from "react-icons/rx";

interface Props {
  tournamentId: string | null | undefined;
}
export default function TournamentRounds({ tournamentId }: Props) {
  const [expandUpcoming, setExpandUpcoming] = React.useState<boolean>(false);
  const [expandCompleted, setExpandCompleted] = React.useState<boolean>(false);

  const { rounds } = useTournamentRounds(tournamentId);

  const pendingRounds = React.useMemo(() => {
    return rounds.filter(round => round.status === ROUND_STATUS.pending);
  }, [rounds]);
  const nextRound = React.useMemo(() => {
    return rounds.find(
      round =>
        round.status > ROUND_STATUS.pending &&
        round.status < ROUND_STATUS.closed,
    );
  }, [rounds]);
  const closedRounds = React.useMemo(() => {
    return rounds.filter(round => round.status === ROUND_STATUS.closed);
  }, [rounds]);

  return (
    <div className="column w-full h-max gap-2 rounded-3xl">
      <div className="row w-full h-max justify-between gap-4">
        <h3 className="heading">Rounds</h3>
      </div>

      {!!nextRound && (
        <div className="row w-full flex-wrap gap-4 pb-2">
          <RoundCard round={nextRound} />
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
              return <RoundCard key={round.id} round={round} />;
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
              return <RoundCard key={round.id} round={round} />;
            })}
          </div>
        </div>
      )}
    </div>
  );
}

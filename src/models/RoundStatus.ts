export type RoundStatusLabel = "pending" | "submitting" | "voting" | "closed";

export enum ROUND_STATUS {
  pending, submitting, voting, closed
}

export interface RoundStatus {
  number: ROUND_STATUS;
  label: RoundStatusLabel;
  color: string;
}

export const roundStatusPending: RoundStatus = {
  number: 0,
  label: "pending",
  color: "#ffb111"
}

export const roundStatusSubmitting: RoundStatus = {
  number: 1,
  label: "submitting",
  color: "#52d746"
}

export const roundStatusVoting: RoundStatus = {
  number: 2,
  label: "voting",
  color: "#00bbff",
}

export const roundStatusClosed: RoundStatus = {
  number: 3,
  label: "closed",
  color: "#bf5858"
}

export const allRoundStatuses: RoundStatus[] = [roundStatusPending, roundStatusSubmitting, roundStatusVoting, roundStatusClosed];

export function getRoundStatus(key: string | number | null | undefined): RoundStatus {
  let result: RoundStatus = roundStatusClosed;
  if (typeof key === "number") {
    const newResult = allRoundStatuses.find((st) => st.number === key);
    if (newResult) result = newResult;
  } else if (typeof key === "string") {
    const newResult = allRoundStatuses.find((st) => st.label === key);
    if (newResult) result = newResult;
  }
  return result;
}
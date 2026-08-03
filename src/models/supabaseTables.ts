import type { SupportedPlatformKey } from "#/models/SupportedPlatforms.ts";
import type { ROUND_STATUS } from "#/models/RoundStatus.ts";

export type Club = {
  id: string;
  created_at: string;
  title: string;
  logo: string | null;
  banner: string | null;
  description: string;
}

export type ClubUser = {
  id: string;
  created_at: string;
  club_id?: string;
  user_id?: string | null;
  is_owner: boolean;
}

export type Round = {
  id: string;
  created_at: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  status: ROUND_STATUS;
  tournament_id?: string | null;
}

export type Submission = {
  id: string;
  created_at: string;
  url_id?: string;
  user_id?: string;
  round_id?: string;
  comment?: string;
  platform?: SupportedPlatformKey;
}

export type Tournament = {
  id: string;
  created_at: string;
  title: string;
  default_round_time: number;
  round_count: number;
  platform: SupportedPlatformKey;
  club_id?: string;
}

export type TournamentUser = {
  id: string;
  created_at: string;
  is_owner: boolean;
  tournament_id?: string;
  user_id?: string;
}

export type User = {
  id: string;
  created_at: string;
  name: string;
  avatar: string;
}

export type Vote = {
  id: string;
  created_at: string;
  score: number;
  comment: string | null;
  user_id?: string;
  submission_id?: string;
  round_id?: string;
}

import type {SUPPORTED_PLATFORMS} from "#/models/supabaseEnums.ts";

export interface Club {
  id: string;
  created_at: string;
  title: string;
  logo: string | null;
  banner: string | null;
  description: string;
}

export interface ClubUser {
  id: string;
  created_at: string;
  club_id?: string;
  user_id?: string | null;
  is_owner: boolean;
}

export interface Round {
  id: string;
  created_at: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  is_active: boolean;
  tournament_id?: string | null;
}

export interface Submission {
  id: string;
  created_at: string;
  url: string;
  user_id?: string;
  round_id?: string;
}

export interface Tournament {
  id: string;
  created_at: string;
  title: string;
  default_round_time: number;
  round_count: number;
  platform: SUPPORTED_PLATFORMS
  club_id?: string;
}

export interface TournamentUser {
  id: string;
  created_at: string;
  is_owner: boolean;
  tournament_id?: string;
  user_id?: string;
}

export interface User {
  id: string;
  created_at: string;
  name: string;
  avatar: string;
}

export interface Vote {
  id: string;
  created_at: string;
  score: number;
  comment: string | null;
  user_id?: string;
  submission_id?: string;
}
import {supabase} from "#/integrations/supabase/supabase.ts";
import {useMutation, useQuery} from "@tanstack/react-query";
import type {User} from "#/models/supabaseTables.ts";
import {useCurrentUserId, useSessionToken} from "#/api/sessions.ts";
import React from "react";

const oneHour = 1000 * 60 * 60;

async function fetchUsers(userIds: string | string[] | null | undefined) {
  if (!userIds?.length) return [];
  const userIdList = Array.isArray(userIds) ? userIds : [userIds];
  const { data, error } = await supabase.from('Users').select('*').in('id', userIdList);
  console.log("Users data: ", data);
  if (error) {
    console.error("Error fetching users. ", error);
    return [];
  }
  return data as User[];
}

export function useUserData(userIds?: string | string[] | null | undefined) {
  const userToken = useSessionToken();
  const currentUserId = useCurrentUserId();
  const getUserIds = React.useMemo(() => !!userIds?.length ? userIds : currentUserId, [userIds, currentUserId]);
  return useQuery({ queryKey: ["users", userToken, getUserIds], queryFn: () => fetchUsers(getUserIds), staleTime: oneHour });
}

// Get Current User
async function fetchCurrentUser(userId: string) {
  if (!userId) {
    console.error("No user ID");
    return null;
  }
  const { data, error } = await supabase.from('Users').select('*').eq('id', userId);
  if (error) {
    console.error("Error fetching current user: ", error);
    return null;
  }
  return data[0] as User;
}

export function useCurrentUser() {
  const userToken = useSessionToken();
  const currentUserId = useCurrentUserId();
  return useQuery({ queryKey: ["users", userToken, currentUserId], queryFn: () => fetchCurrentUser(currentUserId), staleTime: oneHour });
}

// Get Participants for Tournament
async function fetchTournamentUsers(tournamentid: string | null | undefined) {
  if (!tournamentid) {
    console.error("No tournament ID to get users");
    return [];
  }
  const { data, error } = await supabase.rpc('get_tournament_users', { tournamentid });
  if (error) {
    console.error("Error fetching tournament users: ", error);
    return [];
  }
  if (typeof data === "object" && data !== undefined && Object.hasOwn(data, "id")) {
    return [data] as User[];
  }
  if (Array.isArray(data)) {
    return data as User[];
  }
  return [];
}

export function useTournamentUsers(tournamentId: string | null | undefined) {
  const currentUserId = useCurrentUserId();
  return useQuery({ queryKey: ["tournament-users", currentUserId, tournamentId], queryFn: () => fetchTournamentUsers(tournamentId), staleTime: oneHour });
}

// Get Owners for Tournament
async function fetchTournamentOwners(tournamentid: string | null | undefined) {
  if (!tournamentid) {
    console.error("No tournament ID to get owners");
    return [];
  }
  const { data, error } = await supabase.rpc('get_tournament_owners', { tournamentid });
  if (error) {
    console.error("Error fetching tournament owners: ", error);
    return [];
  }
  if (typeof data === "object" && data !== undefined && Object.hasOwn(data, "id")) {
    return [data] as User[];
  }
  if (Array.isArray(data)) {
    return data as User[];
  }
  return [];
}

export function useTournamentOwners(tournamentId: string | null | undefined) {
  const currentUserId = useCurrentUserId();
  return useQuery({ queryKey: ["tournament-owners", currentUserId, tournamentId], queryFn: () => fetchTournamentOwners(tournamentId), staleTime: oneHour });
}

// Get Users who have submitted votes to a round
async function fetchVotedUsers(roundid: string | null | undefined) {
  if (!roundid) {
    console.error("No round ID to get voted users");
    return [];
  }
  const { data, error } = await supabase.rpc('get_voted_users', { roundid });
  if (error) {
    console.error("Error fetching voted users: ", error);
    return [];
  }
  if (typeof data === "object" && data !== undefined && Object.hasOwn(data, "id")) {
    return [data] as string[];
  }
  if (Array.isArray(data)) {
    return data as string[];
  }
  return [];
}

export function useVotedUsers(roundId: string | null | undefined) {
  const currentUserId = useCurrentUserId();
  return useQuery({ queryKey: ["voted-users", currentUserId, roundId], queryFn: () => fetchVotedUsers(roundId), staleTime: oneHour });
}

// Insert User
interface insertProps {
  id: string;
  name: string | null | undefined;
  avatar: string | null | undefined;
}

async function insertUserFn({ id, name, avatar }: insertProps) {
  const { data, error } = await supabase.from('Users').insert([{ id, name, avatar }]).select();
  if (error) {
    console.error("Error creating user: ", error);
    return null;
  }
  return data[0] as User;
}

export function useInsertUser() {
  return useMutation({
    mutationFn: (params: insertProps) => insertUserFn(params)
  });
}
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

async function fetchCurrentUser(userId: string) {
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
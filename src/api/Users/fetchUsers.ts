import { supabase } from "#/integrations/supabase/supabase.ts";
import type { User } from "#/models/supabaseTables.ts";
import { useCurrentUserId } from "#/api/auth/currentUserId.ts";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { hour } from "#/utils/time.ts";

async function fetchUsersFn(userIds: string | string[] | null | undefined) {
  if (!userIds?.length) return [];
  const userIdList = Array.isArray(userIds) ? userIds : [userIds];
  const { data, error } = await supabase
    .from("Users")
    .select("*")
    .in("id", userIdList);
  if (error) {
    console.error("Error fetching users. ", error);
    return [];
  }
  return data as User[];
}

export function useUsers(userIds?: string | string[] | null) {
  const currentUserId = useCurrentUserId();
  const getUserIds = React.useMemo(() => {
    return Array.isArray(userIds) && userIds.length > 1
      ? userIds
      : userIds?.[0] || currentUserId;
  }, [userIds, currentUserId]);

  return useQuery({
    queryKey: ["users", currentUserId, getUserIds],
    queryFn: () => fetchUsersFn(getUserIds),
    staleTime: hour,
  });
}

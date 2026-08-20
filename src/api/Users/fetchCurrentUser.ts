import { supabase } from "#/integrations/supabase/supabase.ts";
import type { User } from "#/models/supabaseTables.ts";
import { useCurrentUserId } from "#/api/auth/currentUserId.ts";
import { useQuery } from "@tanstack/react-query";
import { hour } from "#/utils/time.ts";

async function fetchCurrentUserFn(userId: string) {
  if (!userId) {
    return null;
  }
  const { data, error } = await supabase
    .from("Users")
    .select("*")
    .eq("id", userId);
  if (error) {
    console.error("Error fetching current user: ", error);
    return null;
  }
  return data[0] as User;
}

export function useCurrentUser() {
  const currentUserId = useCurrentUserId();
  return useQuery({
    queryKey: ["users", currentUserId, currentUserId],
    queryFn: () => fetchCurrentUserFn(currentUserId),
    staleTime: hour,
  });
}

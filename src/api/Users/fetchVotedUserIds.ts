import { supabase } from "#/integrations/supabase/supabase.ts";
import { useCurrentUserId } from "#/api/auth/currentUserId.ts";
import { useQuery } from "@tanstack/react-query";
import { hour } from "#/utils/time.ts";

async function fetchVotedUserIdsFn(roundid: string | null | undefined) {
  if (!roundid) {
    console.error("No round ID to get voted users");
    return [];
  }
  const { data, error } = await supabase.rpc("get_voted_users", { roundid });
  if (error) {
    console.error("Error fetching voted users: ", error);
    return [];
  }
  if (
    typeof data === "object" &&
    data !== null &&
    Object.hasOwn(data as object, "id")
  ) {
    return [data] as string[];
  }
  if (Array.isArray(data)) {
    return data as string[];
  }
  return [];
}

export function useVotedUserIds(roundId: string | null | undefined) {
  const currentUserId = useCurrentUserId();
  return useQuery({
    queryKey: ["votedUserIds", currentUserId, roundId],
    queryFn: () => fetchVotedUserIdsFn(roundId),
    staleTime: hour,
  });
}

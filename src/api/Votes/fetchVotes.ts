import { supabase } from "#/integrations/supabase/supabase.ts";
import type { Vote } from "#/models/supabaseTables.ts";
import { useCurrentUserId } from "#/api/auth/currentUserId.ts";
import { useQuery } from "@tanstack/react-query";
import { hour } from "#/utils/time.ts";

async function fetchVotesFn(roundid: string | null | undefined) {
  if (!roundid) return [];
  const { data, error } = await supabase.rpc("get_round_votes", { roundid });
  if (error) {
    console.error("Error fetching votes: ", error);
    return [];
  }
  if (Array.isArray(data)) {
    return data as Vote[];
  }
  return [];
}

export function useVotes(roundId: string | null | undefined) {
  const userId = useCurrentUserId();
  return useQuery({
    queryKey: ["votes", userId, roundId],
    queryFn: () => fetchVotesFn(roundId),
    staleTime: hour,
  });
}

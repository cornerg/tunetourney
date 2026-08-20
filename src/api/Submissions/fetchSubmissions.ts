import { supabase } from "#/integrations/supabase/supabase.ts";
import type { Submission } from "#/models/supabaseTables.ts";
import { useCurrentUserId } from "#/api/auth/currentUserId.ts";
import { useQuery } from "@tanstack/react-query";
import { hour } from "#/utils/time.ts";

async function fetchSubmissionsFn(roundId: string | null | undefined) {
  if (!roundId) return [];
  const { data, error } = await supabase.rpc("get_round_submissions", {
    roundid: roundId,
  });
  if (error) {
    console.error("Error fetching submissions: ", error);
    return [];
  }
  if (Array.isArray(data)) {
    return data as Submission[];
  }
  return [];
}

export function useSubmissions(roundId: string | null | undefined) {
  const userId = useCurrentUserId();
  return useQuery({
    queryKey: ["submissions", userId, roundId],
    queryFn: () => fetchSubmissionsFn(roundId),
    staleTime: hour,
  });
}

import {supabase} from "#/integrations/supabase/supabase.ts";
import {useQuery} from "@tanstack/react-query";
import type {Submission} from "#/models/supabaseTables.ts";
import {useCurrentUserId} from "#/api/sessions.ts";

const oneHour = 1000 * 60 * 60;

async function fetchSubmissions(roundid: string | null | undefined) {
  if (!roundid) return [];
  const { data, error } = await supabase.rpc('get_round_submissions', { roundid });
  if (error) {
    console.error("Error fetching tournament users: ", error);
    return [];
  }
  if (Array.isArray(data)) {
    return data as Submission[];
  }
  return [];
}

export function useSubmissions(roundId: string | null | undefined) {
  const userId = useCurrentUserId();
  return useQuery({ queryKey: ["submissions", userId, roundId], queryFn: () => fetchSubmissions(roundId), staleTime: oneHour });
}
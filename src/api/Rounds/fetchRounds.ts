import { supabase } from "#/integrations/supabase/supabase.ts";
import type { Round } from "#/models/supabaseTables.ts";
import { useCurrentUserId } from "#/api/auth/currentUserId.ts";
import { useQuery } from "@tanstack/react-query";
import { hour } from "#/utils/time.ts";

async function fetchRoundsFn() {
  const { data, error } = await supabase.from("Rounds").select("*");
  if (error) {
    console.error("Error fetching rounds. ", error);
    return [];
  }
  return data as Round[];
}

export function useRounds() {
  const userId = useCurrentUserId();
  return useQuery({
    queryKey: ["rounds", userId],
    queryFn: fetchRoundsFn,
    staleTime: hour,
  });
}

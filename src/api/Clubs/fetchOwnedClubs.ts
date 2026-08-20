import { supabase } from "#/integrations/supabase/supabase.ts";
import type { Club } from "#/models/supabaseTables.ts";
import { useCurrentUserId } from "#/api/auth/currentUserId.ts";
import { useQuery } from "@tanstack/react-query";
import { hour } from "#/utils/time.ts";

async function fetchOwnedClubsFn() {
  const { data, error } = await supabase.rpc("get_owned_clubs");
  if (error) {
    console.error("Error fetching owned Clubs. ", error);
    return [];
  }
  return data as Club[];
}

export function useOwnedClubs() {
  const currentUserId = useCurrentUserId();
  return useQuery({
    queryKey: ["ownedClubs", currentUserId],
    queryFn: fetchOwnedClubsFn,
    staleTime: hour,
  });
}

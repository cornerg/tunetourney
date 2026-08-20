import { supabase } from "#/integrations/supabase/supabase.ts";
import type { Club } from "#/models/supabaseTables.ts";
import { useCurrentUserId } from "#/api/auth/currentUserId.ts";
import { useQuery } from "@tanstack/react-query";
import { hour } from "#/utils/time.ts";

async function fetchClubsFn() {
  const { data, error } = await supabase.from("Clubs").select("*");
  if (error) {
    console.error("Error fetching Clubs. ", error);
    return [];
  }
  return data as Club[];
}

export function useClubs() {
  const currentUserId = useCurrentUserId();
  return useQuery({
    queryKey: ["clubs", currentUserId],
    queryFn: fetchClubsFn,
    staleTime: hour,
  });
}

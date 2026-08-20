import { supabase } from "#/integrations/supabase/supabase.ts";
import type { ClubUserWithData } from "#/models/supabaseUtils.ts";
import { useCurrentUserId } from "#/api/auth/currentUserId.ts";
import { useQuery } from "@tanstack/react-query";
import { hour } from "#/utils/time.ts";

async function fetchClubUsersFn(clubIds: string | string[] | null | undefined) {
  if (!clubIds?.length) return [];
  const clubIdList = Array.isArray(clubIds) ? clubIds : [clubIds];
  const { data, error } = await supabase
    .from("ClubUsers")
    .select("*, userData:Users ( * )")
    .in("club_id", clubIdList);
  if (error) {
    console.error("Error fetching club users. ", error);
    return [];
  }
  return data as ClubUserWithData[];
}

export function useClubUsers(clubIds: string | string[] | null | undefined) {
  const currentUserId = useCurrentUserId();
  return useQuery({
    queryKey: ["clubUsers", currentUserId, clubIds],
    queryFn: () => fetchClubUsersFn(clubIds),
    staleTime: hour,
  });
}

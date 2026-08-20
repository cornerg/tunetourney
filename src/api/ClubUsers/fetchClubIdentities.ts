import { supabase } from "#/integrations/supabase/supabase.ts";
import { useCurrentUserId } from "#/api/auth/currentUserId.ts";
import { useQuery } from "@tanstack/react-query";
import { hour } from "#/utils/time.ts";
import type { UserIdentity } from "#/models/supabaseUtils.ts";

async function fetchClubIdentitiesFn({ clubId }: { clubId: string }) {
  const { data, error } = await supabase.rpc("get_club_identities", { club_id: clubId });
  if (error) {
    console.error("Error fetching club identities. ", error);
    return [];
  }
  return data as UserIdentity[];
}

export function useClubIdentities(clubId: string) {
  const currentUserId = useCurrentUserId();
  return useQuery({
    queryKey: ["clubIdentities", currentUserId, clubId],
    queryFn: () => fetchClubIdentitiesFn({ clubId }),
    staleTime: hour,
  });
}

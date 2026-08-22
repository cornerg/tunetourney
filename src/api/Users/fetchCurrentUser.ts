import { supabase } from "#/integrations/supabase/supabase.ts";
import type { User } from "#/models/supabaseTables.ts";
import { useQuery } from "@tanstack/react-query";
import { hour } from "#/utils/time.ts";

async function fetchCurrentUserFn() {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
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
  if (!Array.isArray(data) || data.length <= 0 || !data[0]) {
    console.error("No user returned for current user.");
    return null;
  }
  return data[0] as User;
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: () => fetchCurrentUserFn(),
    staleTime: hour,
  });
}

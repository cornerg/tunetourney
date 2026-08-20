import { useQuery } from "@tanstack/react-query";
import { supabase } from "#/integrations/supabase/supabase.ts";
import { useCurrentUserId } from "#/api/auth/currentUserId.ts";

const oneHour = 1000 * 60 * 60;

async function fetchMyPoints() {
  const { data, error } = await supabase.rpc("get_my_points");
  if (error) {
    console.error("Error fetching total points: ", error);
    return 0;
  }
  if (typeof data === "number") {
    return data;
  }
  if (Array.isArray(data) && typeof data[0] === "number") {
    return data[0];
  }
  return 0;
}

export function useMyPoints() {
  const currentUserId = useCurrentUserId();
  return useQuery({
    queryKey: ["my-points", currentUserId],
    queryFn: () => fetchMyPoints(),
    staleTime: oneHour,
  });
}

import { supabase } from "#/integrations/supabase/supabase.ts";
import type { Notification } from "#/models/supabaseTables.ts";
import { useCurrentUserId } from "#/api/auth/currentUserId.ts";
import { useQuery } from "@tanstack/react-query";
import { hour } from "#/utils/time.ts";

async function fetchNotificationsFn() {
  const { data, error } = await supabase.from("Notifications").select("*");
  if (error) {
    console.error("Error fetching notifications. ", error);
    return [];
  }
  return data as Notification[];
}

export function useNotifications() {
  const userId = useCurrentUserId();
  return useQuery({
    queryKey: ["notifications", userId],
    queryFn: fetchNotificationsFn,
    staleTime: hour,
  });
}

import type { Notification } from "#/models/supabaseTables.ts";
import { supabase } from "#/integrations/supabase/supabase.ts";
import { useCurrentUserId } from "#/api/auth/currentUserId.ts";
import { useMutation } from "@tanstack/react-query";

type NotificationWithId = Partial<Notification> & { id: string };
async function readNotificationFn(
  rows: NotificationWithId | NotificationWithId[],
) {
  const ids = Array.isArray(rows) ? rows.map(row => row.id) : [rows.id];
  const { data, error } = await supabase
    .from("Notifications")
    .update({ is_read: true })
    .in("id", ids)
    .select();
  if (error) {
    console.error("Error updating notification", error);
    return null;
  }
  return data as Notification[] | null | undefined;
}

export function useReadNotifications() {
  const userId = useCurrentUserId();
  return useMutation({
    mutationFn: (notifications: NotificationWithId | NotificationWithId[]) =>
      readNotificationFn(notifications),
    onMutate: async (rows, context) => {
      const ids = Array.isArray(rows) ? rows.map(row => row.id) : [rows.id];
      if (ids.length) {
        const queryKey = ["notifications", userId];
        await context.client.cancelQueries({ queryKey });
        const old: Notification[] | null | undefined =
          context.client.getQueryData(queryKey);
        context.client.setQueryData(
          queryKey,
          (old ?? []).map(row => ({
            ...row,
            is_read: ids.includes(row.id) ? true : row.is_read,
          })),
        );
      }
    },
    onSuccess: (rows, _v, _r, context) => {
      if (rows) {
        const queryKey = ["notifications", userId];
        context.client.setQueryData(queryKey, (old: Notification[]) => {
          const replacedIds = rows.map(row => row.id);
          return [
            ...(old ?? []).filter(row => !replacedIds.includes(row.id)),
            ...rows,
          ];
        });
        void context.client.invalidateQueries({ queryKey });
      }
    },
  });
}

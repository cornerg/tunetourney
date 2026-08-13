import { supabase } from "#/integrations/supabase/supabase.ts";
import type { Notification } from "#/models/supabaseTables.ts";
import { useCurrentUserId } from "#/api/sessions.ts";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { NotificationTypeKey } from "#/models/enums/NotificationType.ts";

const oneHour = 1000 * 60 * 60;

// Fetch notifications
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
    staleTime: oneHour,
  });
}

// Create notifications
export type CreateNotificationInput = {
  identity: string;
  title: string;
  description: string;
  type: NotificationTypeKey;
  metadata?: object;
};
async function createNotificationsFn(newEntries: CreateNotificationInput[]) {
  const { error } = await supabase.rpc("create_notifications", { input_rows: { data: newEntries } });
  if (error) {
    console.error("Error adding notifications", error);
    return null;
  }
  return true;
}
export function useCreateNotifications() {
  return useMutation({
    mutationFn: (submission: CreateNotificationInput[]) =>
      createNotificationsFn(submission),
  });
}

// Mark notifications as read
type NotificationWithId = Partial<Notification> & { id: string };
async function readNotificationFn(rows: NotificationWithId | NotificationWithId[]) {
  const ids = Array.isArray(rows) ? rows.map((row) => row.id) : [rows.id];
  const { data, error } = await supabase.from("Notifications").update({ is_read: true }).in("id", ids).select();
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
      const ids = Array.isArray(rows) ? rows.map((row) => row.id) : [rows.id];
      if (ids.length) {
        const queryKey = ["notifications", userId];
        await context.client.cancelQueries({ queryKey });
        const old: Notification[] | null | undefined = context.client.getQueryData(queryKey);
        context.client.setQueryData(
          queryKey,
          (old ?? []).map((row) => ({
            ...row,
            is_read: ids.includes(row.id) ? true : row.is_read
          }))
        );
      }
    },
    onSuccess: (rows, _v, _r, context) => {
      if (rows) {
        const queryKey = ["notifications", userId];
        context.client.setQueryData(queryKey, (old: Notification[]) => {
          const replacedIds = rows.map((row) => row.id)
          return [...(old ?? []).filter((row) => !replacedIds.includes(row.id)), ...rows];
        });
        void context.client.invalidateQueries({ queryKey });
      }
    },
  });
}

// Mark that a notification has been handled
async function notificationHandledFn(rows: NotificationWithId | NotificationWithId[]) {
  const ids = Array.isArray(rows) ? rows.map((row) => row.id) : [rows.id];
  const { data, error } = await supabase.from("Notifications").update({ is_handled: true }).in("id", ids).select();
  if (error) {
    console.error("Error updating notification", error);
    return null;
  }
  return data as Notification[] | null | undefined;
}
export function useNotificationsHandled() {
  const userId = useCurrentUserId();
  return useMutation({
    mutationFn: (notifications: NotificationWithId | NotificationWithId[]) =>
      notificationHandledFn(notifications),
    onMutate: async (rows, context) => {
      const ids = Array.isArray(rows) ? rows.map(row => row.id) : [rows.id];
      if (ids.length) {
        const queryKey = ["notifications", userId];
        await context.client.cancelQueries({ queryKey });
        const old: Notification[] | null | undefined = context.client.getQueryData(queryKey);
        context.client.setQueryData(
          queryKey,
          (old ?? []).map(row => ({
            ...row,
            is_handled: ids.includes(row.id) ? true : row.is_handled,
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

import type {
  NotificationType,
  NotificationTypeKey,
} from "#/models/enums/NotificationType.ts";
import type { Notification } from "#/models/supabaseTables.ts";

export const notifTypeClubInvite: NotificationType = {
  key: "invited-to-club",
  name: "You've been invited to a club",
  hasAction: true,
}
export const notifTypeRoundSubmitting: NotificationType = {
  key: "round-submission-started",
  name: "Round submissions are open",
  hasAction: false,
};
export const notifTypeRoundVoting: NotificationType = {
  key: "round-voting-started",
  name: "Round voting has started",
  hasAction: false,
}
export const notifTypeRoundComplete: NotificationType = {
  key: "round-completed",
  name: "A round has been completed",
  hasAction: false,
};

export const allNotificationTypes: NotificationType[] = [
  notifTypeClubInvite, notifTypeRoundSubmitting, notifTypeRoundVoting, notifTypeRoundComplete,
];

export function getNotifType(value: Notification | NotificationTypeKey | null | undefined) {
  if (!value) return;
  let key: NotificationTypeKey;
  if (typeof value === "object") {
    key = value.type;
  } else {
    key = value;
  }
  return allNotificationTypes.find((type) => type.key === key);
}

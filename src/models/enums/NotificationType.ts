export type NotificationTypeKey = "invited-to-club" | "round-submission-started" | "round-voting-started" | "round-completed";

export type NotificationType = {
  key: NotificationTypeKey,
  name: string,
  hasAction: boolean,
}
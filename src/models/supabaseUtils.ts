import type { ClubUser, User } from "#/models/supabaseTables.ts";
import type { NotificationTypeKey } from "#/models/enums/NotificationType.ts";

export type FileUploadResponse =
  | null
  | undefined
  | {
      id: string;
      path: string;
      fullPath: string;
    };

export type ClubUserWithData = {
  userData?: User;
} & ClubUser;

export type TournamentScore = {
  id: string;
  name: string | null | undefined;
  avatar: string | null | undefined;
  score: number;
}

export type UserIdentity = {
  email: string | null;
  name: string | null;
  id: string;
}

export type InsertNotificationInput = {
  identity: string;
  title: string;
  description: string;
  type: NotificationTypeKey;
  metadata?: object;
};

import type { ClubUser, Notification } from "#/models/supabaseTables.ts";
import TTButton from "#/components/primitives/TTButton.tsx";
import React from "react";
import { useInsertClubUser } from "#/api/ClubUsers/insertClubUser.ts";
import { useHandleNotifications } from "#/api/Notifications/handleNotifications.ts";
import { useToast } from "#/state/toastStore.ts";

type Props = {
  notification: Notification;
}
export default function NotifActionsClubInvite({ notification }: Props) {
  const [isSaving, setIsSaving] = React.useState<boolean>(false);

  const { showToast } = useToast();
  const { mutateAsync: insertClubUser } = useInsertClubUser();
  const { mutateAsync: handleNotifications } = useHandleNotifications();
  const { club_id: clubId, is_owner: isOwner } = React.useMemo(() => {
    return notification.metadata!;
  }, [notification]);

  const handleSave = React.useCallback(async (accepting: boolean) => {
    setIsSaving(true);
    let response: ClubUser | boolean | null | undefined = null;
    try {
      if (accepting) {
        response = await insertClubUser({
          user_id: notification.user_id,
          club_id: clubId,
          is_owner: isOwner,
        });
      } else {
        response = true;
      }
      if (!response) {
        throw new Error("Error accepting invitation");
      } else {
        showToast({
          title: `Invitation ${accepting ? "accepted!" : "declined."}`,
          message: accepting
            ? "You've been successfully added to the club."
            : "The club invitation has been successfully declined.",
          type: "success",
        });
        await handleNotifications(notification);
      }
    } catch (error) {
      console.error(error);
      showToast({
        title: "An error occurred",
        message: `Unable to ${accepting ? "accept" : "decline"} the invitation. Please try again.`,
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  }, [insertClubUser, notification, clubId, isOwner, showToast, handleNotifications])

  return (
    <div className="row w-full justify-end flex-1 gap-2 items-center">
      <TTButton
        className="px-2 text-sm h-5.5 focus-visible:outline-none"
        buttonStyle="outline"
        disabled={isSaving}
        onClick={() => handleSave(false)}>
        Decline
      </TTButton>

      <TTButton
        className="px-2 text-sm h-6 focus-visible:outline-none"
        buttonStyle="primary"
        disabled={isSaving}
        onClick={() => handleSave(true)}>
        Accept
      </TTButton>
    </div>
  );
}

import type { Notification } from "#/models/supabaseTables.ts";
import { useReadNotifications } from "#/api/Notifications/readNotifications.ts";
import React from "react";
import NotifActionsClubInvite from "#/components/sections/notifications/NotifActionsClubInvite.tsx";
import { cn, getFormattedDate, getRelativeTime } from "#/utils/utils.ts";
import TTTooltip from "#/components/primitives/TTTooltip.tsx";

type Props = {
  notification: Notification;
}
export default function NotificationRow({ notification }: Props) {
  const isUpdating = React.useRef<boolean>(false);

  const { mutateAsync: readNotification } = useReadNotifications();
  const notifDate = React.useMemo(() => {
    return getRelativeTime(new Date(notification.created_at).getTime());
  }, [notification]);

  const { title, description, type, is_read: isRead, is_handled: isHandled } = React.useMemo(() => {
    return notification;
  }, [notification]);

  const handleHover = React.useCallback(async () => {
    if (isUpdating.current || notification.is_read) return;
    isUpdating.current = true;
    await readNotification(notification);
    isUpdating.current = false;
  }, [notification, readNotification]);

  return (
    <div
      className={cn(
        "column w-full gap-1 p-2 rounded-lg border border-gray-200 hover:border-primary",
        {
          "border-amber-500": !isHandled && isRead,
          "border-red-600": !isRead,
        },
      )}
      onMouseEnter={handleHover}>
      <div className="row w-full justify-between gap-0">
        <p className="w-full flex-1 text-sm text-gray-800 font-semibold select-none">
          {title}
        </p>

        <TTTooltip label={getFormattedDate(notification.created_at)}>
          <p className="w-max text-xs text-gray-600 select-none text-end">
            {notifDate}
          </p>
        </TTTooltip>
      </div>

      <p className="w-full text-xs text-body leading-tight select-none">
        {description}
      </p>

      {type === "invited-to-club" && !isHandled && (
        <NotifActionsClubInvite notification={notification} />
      )}
    </div>
  );
}
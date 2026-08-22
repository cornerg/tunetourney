import { SlBell } from "react-icons/sl";
import { useNotifications } from "#/api/Notifications/fetchNotifications.ts";
import React from "react";
import { Popover } from "radix-ui";
import "#/styles/popover.css";
import NotificationsList from "#/components/sections/notifications/NotificationsList.tsx";
import { cn } from "#/utils/utils.ts";

export default function HeaderNotifications() {
  const { data: notifications } = useNotifications();

  const hasUnread = React.useMemo(() => {
    return !!(notifications ?? []).find((notif) => !notif.is_read);
  }, [notifications]);

  const hasUnhandled = React.useMemo(() => {
    return !!(notifications ?? []).find(notif => !notif.is_handled);
  }, [notifications]);

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <div className="group relative row w-8 h-8 justify-center items-center cursor-pointer">
          <SlBell
            size={24}
            className="w-6 h-6 text-gray-600 hover:text-primary transition-colors"
          />
          {(hasUnread || hasUnhandled) && (
            <div className={cn("absolute w-4 h-4 top-0.5 right-0.5 rounded-2xl border-3 border-surface", hasUnread ? "bg-red-600" : "bg-amber-500")} />
          )}
        </div>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content className="popover-content w-xs min-h-8 bg-surface p-2 border border-gray-400 ouline-none focus:outline-none rounded-lg shadow-lg z-11">
          <NotificationsList />
          <Popover.Arrow className="fill-gray-400" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
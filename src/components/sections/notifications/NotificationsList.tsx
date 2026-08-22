import { useNotifications } from "#/api/Notifications/fetchNotifications.ts";
import React from "react";
import NotificationRow from "#/components/sections/notifications/NotificationRow.tsx";
import TTButton from "#/components/primitives/TTButton.tsx";
import { MdRefresh } from "react-icons/md";
import { AiOutlineLoading } from "react-icons/ai";

export default function NotificationsList() {
  const { data: notifications, isFetching, refetch } = useNotifications();

  const sortedNotifications = React.useMemo(() => {
    return [...(notifications ?? [])].sort((a, b) => {
      const valueA = new Date(a.created_at).getTime();
      const valueB = new Date(b.created_at).getTime();
      return valueB - valueA;
    })
  }, [notifications]);

  return (
    <div className="column w-full h-max gap-2">
      <div className="row w-full gap-2 justify-between items-center px-2">
        <h3 className="text-lg text-dark font-bold leading-none">
          Notifications
        </h3>

        <TTButton
          buttonStyle="outline"
          className="w-6 h-6"
          disabled={isFetching}
          onClick={() => refetch()}>
          {isFetching && (
            <AiOutlineLoading size={18} className="w-4.5 h-4.5 focus-visible:outline-none animate-spin" />
          )}
          {!isFetching && (
            <MdRefresh
              size={18}
              className="w-4.5 h-4.5 focus-visible:outline-none"
            />
          )}
        </TTButton>
      </div>

      <hr className="w-full text-gray-300" />

      <div className="column w-full flex-1 h-max max-h-96 gap-2 overflow-y-auto">
        {sortedNotifications.map(notification => {
          return (
            <NotificationRow
              key={notification.id}
              notification={notification}
            />
          );
        })}
      </div>
    </div>
  );
}
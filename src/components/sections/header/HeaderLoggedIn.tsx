import type { User } from "#/models/supabaseTables.ts";
import HeaderUser from "#/components/sections/header/HeaderUser.tsx";
import HeaderNotifications from "#/components/sections/header/HeaderNotifications.tsx";
import { useBreakpoints } from "#/hooks/utils.ts";
import { cn } from "#/utils/utils.ts";

type Props = {
  currentUser: User;
}
export default function HeaderLoggedIn({ currentUser }: Props) {
  const { isMobile } = useBreakpoints();

  return (
    <div className={cn(
      "row justify-end items-center gap-4 w-full flex-1",
        {
          "gap-8": !isMobile,
        }
      )}
    >
      <HeaderNotifications />
      <HeaderUser currentUser={currentUser} />
    </div>
  );
}
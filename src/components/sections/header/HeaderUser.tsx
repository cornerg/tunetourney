import type { User } from "#/models/supabaseTables.ts";
import TTDropdownMenu from "#/components/primitives/TTDropdownMenu.tsx";
import { DropdownMenu } from "radix-ui";
import ProfilePhoto from "#/components/ProfilePhoto.tsx";
import { useAuth } from "#/hooks/auth.tsx";

type Props = {
  currentUser: User;
}
export default function HeaderUser({ currentUser }: Props) {
  const { signOut } = useAuth();

  return (
    <TTDropdownMenu
      options={[
        <DropdownMenu.Item
          key="signout"
          className="dropdownMenuItem"
          onClick={signOut}>
          Log Out
        </DropdownMenu.Item>,
      ]}>
      <div className="group relative w-8 h-8 cursor-pointer">
        <ProfilePhoto
          user={currentUser}
          size={32}
          fontSize={16}
          className="absolute top-0 left-0 bg-surface rounded-full overflow-hidden"
        />
        <div
          className="absolute top-0.5 left-0.5 w-7 h-7 m-auto rounded-full border-2 border-primary z-0 group-hover:w-10 group-hover:h-10 group-hover:-top-1 group-hover:-left-1"
          style={{
            transition:
              "width 200ms ease, height 200ms ease, top 200ms ease, left 200ms ease",
          }}
        />
      </div>
    </TTDropdownMenu>
  );
}
import type { User } from "#/models/supabaseTables.ts";
import TTTooltip from "#/components/primitives/TTTooltip.tsx";
import ProfilePhoto from "#/components/ProfilePhoto.tsx";
import { FaShieldHalved } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";

type Props = {
  user: User;
  isOrganizer?: boolean;
  isComplete?: boolean;
}
export default function RosterAvatar({ user, isOrganizer, isComplete }: Props) {
  return (
    <div key={user.id} className="relative row items-center gap-2">
      <TTTooltip label={user?.name ?? "Unnamed User"} delay={30}>
        <ProfilePhoto
          user={user}
          size={40}
          fontSize={16}
          className="rounded-full bg-surface border border-dark"
        />
      </TTTooltip>

      {isOrganizer && (
        <TTTooltip label="Organizer" delay={30}>
          <div className="absolute row w-4 h-4 -top-0.5 -right-0.5 justify-center items-center rounded-full bg-primary z-1">
            <FaShieldHalved size={10} className="w-2.5 h-2.5 text-surface" />
          </div>
        </TTTooltip>
      )}

      {isComplete && (
        <TTTooltip label="Submitted" delay={30} placement="bottom">
          <div className="absolute row w-4 h-4 -bottom-0.5 -left-0.5 justify-center items-center rounded-full bg-emerald-600 z-1">
            <FaCheck size={10} className="w-2.5 h-2.5 text-surface" />
          </div>
        </TTTooltip>
      )}
    </div>
  );
}
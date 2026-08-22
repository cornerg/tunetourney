import React from "react";
import type { User } from "#/models/supabaseTables.ts";
import { cn, getInitials } from "#/utils/utils.ts";

const GRADIENTS = [
  "#B55B00, #EDDD53",
  "#00B58E, #96ED53",
  "#04C7A6, #53A0ED",
  "#A378B3, #7187EB",
  "#F06262, #EB71D9",
  "#2B51C4, #9177D4",
];

function getGradient(userId: string | null | undefined) {
  const key = userId?.charCodeAt(0) ?? 0;
  return GRADIENTS[key % GRADIENTS.length];
}

type Props = {
  size?: number;
  fontSize?: number | string;
  name?: string | null | undefined;
} & React.HTMLAttributes<HTMLDivElement>
type PropsWithUser = {
  user: User | null | undefined;
  avatarUrl?: string | null | undefined;
} & Props
type PropsWithAvatar = {
  user?: User | null | undefined;
  avatarUrl: string | null | undefined;
} & Props
export default function ProfilePhoto({
  user,
  avatarUrl,
  name,
  size,
  fontSize,
  className,
  style,
  ...props
}: PropsWithUser | PropsWithAvatar) {
  const photo = React.useMemo(
    () => user?.avatar || avatarUrl,
    [user?.avatar, avatarUrl],
  );
  const gradient = React.useMemo(() => getGradient(user?.id), [user?.id]);

  if (photo) {
    return (
      <img
        className={cn("border border-gray-300 select-none", className)}
        src={photo}
        alt="user avatar"
        width={size}
        height={size}
        style={{ minWidth: size, minHeight: size, zIndex: 1, ...style }}
        {...props}
      />
    );
  }
  return (
    <div
      className={cn(
        "row justify-center items-center border border-gray-300",
        className,
      )}
      style={{
        background: `linear-gradient(45deg, ${gradient})`,
        minWidth: size,
        minHeight: size,
        ...style,
      }}
      {...props}>
      <p
        className="text-center text-surface font-bold select-none"
        style={{ fontSize }}>
        {getInitials(user?.name || name)}
      </p>
    </div>
  );
}

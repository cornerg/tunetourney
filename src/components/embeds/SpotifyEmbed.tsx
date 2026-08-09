import React from "react";
import { cn } from "#/utils/utils.ts";

type Props = {
  embedId: string;
  width: number;
  height: number;
} & Omit<
  React.HTMLProps<HTMLDivElement>,
  "width" | "height"
>
export default function SpotifyEmbed({
  embedId,
  height,
  width,
  className,
  ...props
}: Props) {
  return (
    <div
      className={cn(
        `relative w-[${width}px] h-[${height}px] rounded-2xl border-1 border-dark overflow-hidden`,
      )}
      {...props}>
      <iframe
        data-testid="embed-iframe"
        src={`https://open.spotify.com/embed/track/${embedId}?utm_source=generator`}
        width={width.toString()}
        height={height.toString()}
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"></iframe>
    </div>
  );
}

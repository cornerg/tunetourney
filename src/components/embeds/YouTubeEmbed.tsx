import React from "react";
import {cn} from "#/utils/utils.ts";

interface Props extends Omit<React.HTMLProps<HTMLDivElement>, "width" | "height"> {
  embedId: string
  width: number
  height: number
}
export default function YouTubeEmbed({ embedId, className, width, height, ...props }: Props) {

  return (
    <div className={cn(`relative w-[${width}px] h-[${height}px] rounded-xl border-1 border-dark overflow-hidden`)} {...props}>
      <iframe
        className={`absolute top-0 left-0`}
        width={width.toString()}
        height={height.toString()}
        src={`https://www.youtube.com/embed/${embedId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Embedded youtube"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  )
}
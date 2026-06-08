import React from "react";
import {cn} from "#/utils/utils.ts";
import {useBreakpoints} from "#/hooks/utils.ts";

export default function TTBox({ className, children, ...props }: React.HTMLProps<HTMLDivElement>) {
  const { isMobile } = useBreakpoints();

  return (
    <div
      className={cn(
        "rounded-3xl overflow-hidden bg-surface border border-gray-400",
        {
          "p-4": !isMobile,
          "p-2": isMobile,
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
import React from "react";
import {cn} from "#/utils/utils.ts";
import TTTooltip from "#/components/primitives/TTTooltip.tsx";

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  tooltip?: string | undefined;
  disabled?: boolean | undefined;
}
export default function TTButton({ children, tooltip, className, style, disabled, ...props }: Props) {
  const button = React.useMemo(() => {
    return (
      <button
        className={cn(
          "row justify-center items-center bg-surface text-dark border border-dark rounded-lg",
          {
            "opacity-50 select-none cursor-auto": disabled,
            "cursor-pointer hover:text-primary hover:border-primary": !disabled,
          },
          className
        )}
        style={{ transition: "border 150ms ease, color 150ms ease" }}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    )
  }, [children, className, disabled, style, ...Object.values(props)]);

  if (!!tooltip?.trim()?.length) {
    return (
      <TTTooltip label={tooltip ?? ""} delay={100}>
        {button}
      </TTTooltip>
    )
  }
  return button
}
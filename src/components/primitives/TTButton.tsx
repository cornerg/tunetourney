import React from "react";
import TTTooltip from "#/components/primitives/TTTooltip.tsx";
import { cn } from "#/utils/utils.ts";

import "@/styles/ttbutton.css";

type Props = {
  tooltip?: string | undefined;
  disabled?: boolean | undefined;
  buttonStyle?: "primary" | "outline" | undefined;
} & React.HTMLAttributes<HTMLButtonElement>
export default function TTButton({
  children,
  tooltip,
  className,
  style,
  disabled,
  buttonStyle = "primary",
  ...props
}: Props) {
  const button = React.useMemo(() => {
    return (
      <button
        className={cn(
          "row justify-center items-center rounded-lg",
          {
            "ttbutton-primary": buttonStyle === "primary",
            "ttbutton-outline": buttonStyle === "outline",
            "ttbutton-disabled opacity-50 select-none cursor-auto": disabled,
            "cursor-pointer": !disabled,
          },
          className,
        )}
        style={{
          transition:
            "border 150ms ease, color 150ms ease, background 150ms ease",
        }}
        disabled={disabled}
        {...props}>
        {children}
      </button>
    );
  }, [buttonStyle, children, className, disabled, props]);

  if (tooltip?.trim()?.length) {
    return (
      <TTTooltip label={tooltip ?? ""} delay={100}>
        {button}
      </TTTooltip>
    );
  }
  return button;
}

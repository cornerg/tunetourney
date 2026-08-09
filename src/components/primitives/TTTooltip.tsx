import type { ReactNode } from "react";
import { Tooltip } from "radix-ui";

type Props = {
  children?: ReactNode | undefined;
  label: string;
  delay?: number | undefined;
}
export default function TTTooltip({ children, label, delay }: Props) {
  return (
    <Tooltip.Provider delayDuration={delay}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="rounded-sm py-0.5 px-1 bg-dark text-xs text-surface shadow z-20"
            sideOffset={2}>
            {label}
            <Tooltip.Arrow className="fill-dark" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

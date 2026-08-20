import React from "react";
import { DropdownMenu } from "radix-ui";

import "@/styles/TTDropdownMenu.css";

type Props = {
  options: React.ReactNode[];
  triggerAsChild?: boolean;
  disabled?: boolean;
  width?: number;
  children: React.ReactNode;
}
export default function TTDropdownMenu({
  options,
  triggerAsChild = true,
  disabled,
  width = 220,
  children,
}: Props) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger disabled={disabled} asChild={triggerAsChild}>
        {children}
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className="dropdownMenuContent" style={{ minWidth: `${width}px` }}>
          {options}
          <DropdownMenu.Arrow className="dropdownMenuArrow" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

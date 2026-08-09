import React from "react";
import { DropdownMenu } from "radix-ui";

import "@/styles/TTDropdownMenu.css";

type Props = {
  options: React.ReactNode[];
  triggerAsChild?: boolean;
  children: React.ReactNode;
}
export default function TTDropdownMenu({
  options,
  triggerAsChild = true,
  children,
}: Props) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild={triggerAsChild}>
        {children}
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className="dropdownMenuContent">
          {options}
          <DropdownMenu.Arrow className="dropdownMenuArrow" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

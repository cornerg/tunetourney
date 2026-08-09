import type React from "react";
import { cn } from "#/utils/utils.ts";
import { Dialog } from "radix-ui";
import { MdClose } from "react-icons/md";

type Props = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title?: string | undefined;
  width?: number | undefined;
  className?: string | undefined;
  style?: React.CSSProperties | undefined;
  children: React.ReactNode;
}
export default function TTDialog({
  isOpen,
  onOpenChange,
  title,
  width,
  className,
  style,
  children,
}: Props) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-gray-800/40 fixed inset-0 z-11 backdrop-blur-sm" />
        <Dialog.Content
          className={cn(
            "fixed column w-[calc(100vw - 16px)] min-h-32 top-[50%] left-[50%] p-4 pt-2 bg-surface rounded-xl shadow-lg focus:outline-none z-12",
            className,
          )}
          style={{
            maxWidth: width,
            transform: "translate(-50%, -50%)",
            ...style,
          }}>
          <div className="w-full row justify-between gap-2">
            <Dialog.Title className="text-2xl font-bold text-primary w-full flex-1">
              {title}
            </Dialog.Title>
            <Dialog.Close
              className="group row w-10 h-10 mt-[-8px] mr-[-16px] pl-2 pb-2 justify-start items-end cursor-pointer"
              onClick={() => onOpenChange(false)}>
              <MdClose
                size={22}
                className="w-6 h-6 text-body group-hover:text-red-600 transition-colors"
              />
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

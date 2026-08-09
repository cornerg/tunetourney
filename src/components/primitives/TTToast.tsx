import React from "react";
import { Toast } from "radix-ui";

import "@/styles/TTToast.css";

type ToastType = "success" | "warning" | "error" | "default";

type ToastProps = {
  title?: string;
  message?: string;
  type?: ToastType;
}

export type ToastFn = (params: ToastProps) => void;

export function useTTToast() {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [title, setTitle] = React.useState<string>("");
  const [message, setMessage] = React.useState<string>("");
  const [toastType, setToastType] = React.useState<ToastType>("default");

  const toast: ToastFn = React.useCallback(
    ({
      title: newTitle,
      message: newMessage,
      type = "default",
    }: ToastProps) => {
      setTitle(newTitle ?? "");
      setMessage(newMessage ?? "");
      setToastType(type ?? "success");
      setIsOpen(true);
    },
    [],
  );

  const TTToast = React.useCallback(() => {
    const typeClass = "toast-type-" + toastType;
    return (
      <Toast.Provider swipeDirection="right">
        <Toast.Root
          className={`toastRoot ${typeClass}`}
          open={isOpen}
          onOpenChange={setIsOpen}>
          <Toast.Title className="toastTitle">{title}</Toast.Title>
          <Toast.Description className="toastDescription">
            {message}
          </Toast.Description>
        </Toast.Root>
        <Toast.Viewport className="toastViewport" />
      </Toast.Provider>
    );
  }, [isOpen, setIsOpen, title, message, toastType]);

  return { TTToast, toast };
}
